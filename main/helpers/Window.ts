import { screen, BrowserWindow, BrowserWindowConstructorOptions, Rectangle } from 'electron';
import Store from 'electron-store';
import { Backend } from '../backend';

export class Window {
  private key = 'window-state';
  private name: string;
  private options: BrowserWindowConstructorOptions;
  private store: Store;
  private state: Rectangle;
  private window: BrowserWindow;
  private backend: Backend;

  constructor(backend: Backend, windowName: string, options: BrowserWindowConstructorOptions) {
    this.backend = backend;
    this.options = options;
    this.name = `window-state-${windowName}`;
    this.resetToDefaults();
    this.store = new Store({ name: this.name });

    this.restore();
    this.ensureVisibleOnSomeDisplay();

    const browserOptions: BrowserWindowConstructorOptions = {
      ...this.state,
      ...options,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        ...options.webPreferences,
      },
    };

    this.window = new BrowserWindow(browserOptions);

    this.window.on('close', () => { this.saveState(); });
  }

  public restore(): void {
    this.state = this.store.get(this.key, this.state) as Rectangle;
  }

  public getCurrentPosition(): Rectangle {
    const position = this.window.getPosition();
    const size = this.window.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  }

  public windowWithinBounds(bounds: Rectangle): boolean {
    return (
      this.state.x >= bounds.x &&
      this.state.y >= bounds.y &&
      this.state.x + this.state.width <= bounds.x + bounds.width &&
      this.state.y + this.state.height <= bounds.y + bounds.height
    );
  }

  public resetToDefaults(): void {
    const bounds = screen.getPrimaryDisplay().bounds;
    this.state = {
      x: (bounds.width - (this.options.width ?? 800)) / 2,
      y: (bounds.height - (this.options.height ?? 600)) / 2,
      width: Math.min(this.options.width ?? 800, bounds.width),
      height: Math.min(this.options.height ?? 600, bounds.height),
    };
  }

  public ensureVisibleOnSomeDisplay(): void {
    const visible = screen.getAllDisplays().some((display) => {
      return this.windowWithinBounds(display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return this.resetToDefaults();
    }
  }

  public moveTo(x: number, y: number): void {
    this.state.x = x;
    this.state.y = y;
    this.window.setPosition(x, y, false);
    return this.saveState();
  }

  public saveState(): void {
    if (!this.window.isMinimized() && !this.window.isMaximized()) {
      Object.assign(this.state, this.getCurrentPosition());
    }
    return this.store.set(this.key, this.state);
  }

  public setAlwaysOnTop(isAlwaysOnTop: boolean): void {
    return this.window.setAlwaysOnTop(isAlwaysOnTop);
  }

  public minimize(): void {
    return this.window.minimize();
  }

  public maximize(): void {
    return this.window.maximize();
  }

  public unmaximize(): void {
    return this.window.unmaximize();
  }

  public close(): void {
    return this.window.close();
  }

  public destroy(): void {
    if (this.windowInstance.isDestroyed()) return;
    return this.window.destroy();
  }

  public setFullScreen(isFullScreen: boolean): void {
    return this.window.setFullScreen(isFullScreen);
  }

  public setResizable(isResizable: boolean): void {
    return this.window.setResizable(isResizable);
  }

  public isFullScreenable(): boolean {
    return this.window.isFullScreenable();
  }

  /**
   * Loads the URL of the window.
   * @param url The URL to load. Should look like '/home'
   * @returns A promise that resolves when the URL is loaded.
   **/
  public async loadURL(url: string): Promise<void> {
    if (this.backend.isProduction()) {
      return this.window.loadURL(`app://.${url}.html`);
    } else {
      const port = process.argv[2];
      return this.window.loadURL(`http://localhost:${port}${url}`);
    }
  }

  get windowInstance(): BrowserWindow {
    return this.window;
  }
}
