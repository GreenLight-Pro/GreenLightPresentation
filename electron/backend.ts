import { app, IpcMainEvent, ipcMain } from 'electron';
import { Logger } from '@promisepending/logger.js';
import { BaseEventStructure } from './structures';
import isDev from 'electron-is-dev';
import { createServer } from 'http';
import { Window } from './helpers';
import serve from 'electron-serve';
import { events } from './events';
// eslint-disable-next-line n/no-deprecated-api
import { parse } from 'url';
import next from 'next';
import path from 'path';

export class Backend {
  private readonly isProd: boolean = process.env.NODE_ENV === 'production';
  private mainWindow: Window | null = null;
  private exhibitionWindow: Window | null = null;
  private logger: Logger;

  public static main(logger?: Logger): Backend {
    return new Backend(logger);
  }

  public constructor(logger?: Logger) {
    this.logger = logger || new Logger({
      prefix: 'Backend',
      debug: !this.isProd,
      disableFatalCrash: true,
      allLineColored: true,
      fileProperties: {
        enable: this.isProd,
        logFolderPath: './logs',
      },
    });

    if (this.isProd) {
      serve({ directory: 'app' });
    } else {
      app.setPath('userData', `${app.getPath('userData')} (development)`);
    }

    app.on('window-all-closed', () => {
      app.quit();
    });

    app.once('ready', async () => {
      await this.start();
      await this.registerEvents();
    });
  }

  private async start(): Promise<void> {
    this.mainWindow = new Window(this, 'controller', {
      width: 800,
      height: 600,
      frame: false,
      minWidth: 800,
      minHeight: 600,
    });
    this.mainWindow.windowInstance.removeMenu();
    // this.controllerWindow.loadURL('/home');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.mainWindow.windowInstance.on('close', (event: IpcMainEvent) => {
      if (this.exhibitionWindow && !this.exhibitionWindow.windowInstance.isDestroyed()) {
        event.preventDefault();
        // Ask user if he really wants to close the application
        this.mainWindow!.windowInstance.webContents.send('app.stop.ask');
        this.logger.debug('Controller window close event received');
      }
    });

    this.mainWindow.windowInstance.once('closed', () => {
      if (this.exhibitionWindow) {
        this.exhibitionWindow.destroy();
      }
      process.exit(0);
    });

    this.logger.info(path.resolve(app.getAppPath(), 'renderer'));

    const nextApp = next({
      dev: isDev,
      dir: path.resolve(app.getAppPath(), 'renderer'),
    });
    const requestHandler = nextApp.getRequestHandler();

    // Build the renderer code and watch the files
    await nextApp.prepare();

    this.logger.info('> Starting on http://localhost:' + (process.env.SMP_PORT || 3000));
    // Create a new native HTTP server (which supports hot code reloading)
    createServer((req: any, res: any) => {
      const parsedUrl = parse(req.url, true);
      requestHandler(req, res, parsedUrl);
    }).listen(process.env.SMP_PORT || 3000, () => {
      this.logger.info('> Ready on http://localhost:' + (process.env.SMP_PORT || 3000));
    });

    this.mainWindow.loadURL('/home');
  }

  private async registerEvents(): Promise<void> {
    for await (const eventClass of events) {
      try {
        this.logger.debug('Registering event ' + eventClass.name);
        const event: BaseEventStructure = new eventClass(this);
        if (event.runOnce()) {
          ipcMain.once(event.getName(), (receivedEvent: IpcMainEvent, ...args: any[]) => event.preExecute(receivedEvent, ...args).catch((error: any) => {
            this.logger.error('An error occurred while executing single-run event ' + event.getName(), error);
          }));
        } else {
          ipcMain.on(event.getName(), (receivedEvent: IpcMainEvent, ...args: any[]) => event.preExecute(receivedEvent, ...args).catch((error: any) => {
            this.logger.error('An error occurred while executing event ' + event.getName(), error);
          }));
        }
      } catch (error) {
        this.logger.error('An error occurred while registering event ' + eventClass.name, error);
      }
    }
  }

  public getLogger(): Logger {
    return this.logger;
  }

  public getMainWindow(): Window | null {
    return this.mainWindow;
  }

  public getExhibitionWindow(): Window | null {
    return this.exhibitionWindow;
  }

  public setMainWindow(window: Window | null): void {
    this.mainWindow = window;
  }

  public setExhibitionWindow(window: Window | null): void {
    this.exhibitionWindow = window;
  }

  public isProduction(): boolean {
    return this.isProd;
  }
}
