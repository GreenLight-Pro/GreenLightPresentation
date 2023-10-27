import { app, IpcMainEvent, ipcMain } from 'electron';
import { Logger } from '@promisepending/logger.js';
import { BaseEventStructure } from './structures';
import { Window } from './helpers';
import serve from 'electron-serve';
import { events } from './events';

export class Backend {
  private readonly isProd: boolean = process.env.NODE_ENV === 'production';
  private logger: Logger;
  private controllerWindow: Window;
  private exhibitionWindow: Window;

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
    this.controllerWindow = new Window(this, 'controller', {
      width: 800,
      height: 600,
      frame: false,
      minWidth: 800,
      minHeight: 600,
    });
    this.controllerWindow.windowInstance.removeMenu();
    this.controllerWindow.loadURL('/home');

    this.controllerWindow.windowInstance.on('close', (event: IpcMainEvent) => {
      if (this.exhibitionWindow && !this.exhibitionWindow.windowInstance.isDestroyed()) {
        event.preventDefault();
        // Ask user if he really wants to close the application
        this.controllerWindow.windowInstance.webContents.send('app.stop.ask');
        this.logger.debug('Controller window close event received');
      }
    });

    this.controllerWindow.windowInstance.once('closed', () => {
      if (this.exhibitionWindow) {
        this.exhibitionWindow.destroy();
      }
      process.exit(0);
    });
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

  public getControllerWindow(): Window {
    return this.controllerWindow;
  }

  public getExhibitionWindow(): Window {
    return this.exhibitionWindow;
  }

  public setControllerWindow(window: Window): void {
    this.controllerWindow = window;
  }

  public setExhibitionWindow(window: Window): void {
    this.exhibitionWindow = window;
  }

  public isProduction(): boolean {
    return this.isProd;
  }
}
