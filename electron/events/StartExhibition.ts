import { BaseEventStructure } from '../structures';
import { Display, IpcMainEvent, screen } from 'electron';
import { Backend } from '../backend';
import { Window } from '../helpers';

export class StartExhibition extends BaseEventStructure {
  constructor(backend: Backend) {
    super('exhibition.start', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, screenId: number): Promise<void> {
    const exhibition = this.backend.getExhibitionWindow();

    if (exhibition && !exhibition.windowInstance.isDestroyed()) {
      if (process.env.NODE_ENV !== 'production') return;

      exhibition.windowInstance.reload();
      this.handlePosition(exhibition, screenId);
      exhibition.windowInstance.focus();
      exhibition.windowInstance.show();
      receivedEvent.reply('exhibition.start.done');

      return;
    }

    const exhibitionWindow = new Window(this.backend, 'exhibition', {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      minimizable: false,
      maximizable: false,
      closable: false,
      show: false,
    });

    this.backend.setExhibitionWindow(exhibitionWindow);

    exhibitionWindow.windowInstance.removeMenu();

    // get second screen
    if (!this.handlePosition(exhibitionWindow, screenId)) {
      exhibitionWindow.destroy();
      this.backend.setExhibitionWindow(null);
      this.backend.getLogger().debug(screenId);
      receivedEvent.reply('exhibition.start.error', 'Screen not found');
      return;
    }

    await exhibitionWindow.loadURL('/exhibition');

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore(2339)
    exhibitionWindow.windowInstance.on('close', (event: IpcMainEvent) => {
      this.backend.getLogger().debug('Exhibition window close event received');
      this.handleClose(event, exhibitionWindow);
    });

    // Unhandle the close event
    exhibitionWindow.windowInstance.once('closed', (event: IpcMainEvent) => {
      exhibitionWindow.windowInstance.removeAllListeners('close');
      this.handleClose(event, exhibitionWindow);
      this.backend.getLogger().info('Exhibition window closed');
    });

    exhibitionWindow.windowInstance.show();
    this.backend.getLogger().debug('FullScreen Enable?: ', exhibitionWindow.windowInstance.isFullScreen());

    receivedEvent.reply('exhibition.start.done');
  }

  private handleClose(event: IpcMainEvent, exibitionWindow: Window): void {
    event.preventDefault();
    this.backend.getLogger().debug('Signal to close the exhibition window received');

    if (!this.backend.getExhibitionWindow()) {
      exibitionWindow.destroy();
      this.backend.setExhibitionWindow(null);
      this.backend.getLogger().debug('Close tasks completed');
    } else {
      this.backend.getLogger().warn('An attempt to close the exibiiton window was made, but it was not from the controller');
    }
  }

  private handlePosition(exhibitionWindow: Window, screenId: number): boolean {
    const displays = screen.getAllDisplays();

    const selectedDisplay = displays.find((display: Display) => display.id === screenId);

    if (!selectedDisplay) return false;

    exhibitionWindow.windowInstance.setPosition(selectedDisplay.bounds.x, selectedDisplay.bounds.y);

    if (displays.length > 1) {
      exhibitionWindow.setAlwaysOnTop(true);
      if (exhibitionWindow.windowInstance.isFullScreenable()) {
        exhibitionWindow.windowInstance.setFullScreen(true);
      } else {
        this.backend.getLogger().warn('The exhibition window is not fullscreenable!');
      }

      // Ensure that the controller windows is not on the same screen as the exhibition window
      const controllerWindow = this.backend.getMainWindow();
      const controllerScreen = screen.getDisplayNearestPoint({ x: controllerWindow!.getCurrentPosition().x, y: controllerWindow!.getCurrentPosition().y });
      if (controllerScreen.id === selectedDisplay.id) {
        this.backend.getLogger().warn('The controller window is on the same screen as the exhibition window!');
        const anyOtherScreen = displays.find((display: Display) => display.id !== screenId);
        controllerWindow!.windowInstance.setBounds(anyOtherScreen!.bounds);
      }
    } else {
      exhibitionWindow.windowInstance.setResizable(false);
      this.backend.getLogger().warn('Single display set');
    }
    return true;
  }
}
