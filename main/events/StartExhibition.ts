import { BaseEventStructure } from '../structures';
import { IpcMainEvent, screen } from 'electron';
import { Backend } from '../backend';
import { Window } from '../helpers';

export class StartExhibition extends BaseEventStructure {
  constructor(backend: Backend) {
    super('exhibition.start', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    const exhibition = this.backend.getExhibitionWindow();

    if (exhibition && !exhibition.windowInstance.isDestroyed()) {
      exhibition.windowInstance.reload();
      this.handlePosition(exhibition);
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

    exhibitionWindow.windowInstance.removeMenu();

    this.backend.setExhibitionWindow(exhibitionWindow);

    // get second screen
    this.handlePosition(exhibitionWindow);

    await exhibitionWindow.loadURL('/exhibition');

    exhibitionWindow.windowInstance.on('close', (event: IpcMainEvent) => {
      this.backend.getLogger().debug('Exibition window close event received');
      this.handleClose(event, exhibitionWindow);
    });

    // Unhandle the close event
    exhibitionWindow.windowInstance.once('closed', (event: IpcMainEvent) => {
      exhibitionWindow.windowInstance.removeAllListeners('close');
      this.handleClose(event, exhibitionWindow);
      this.backend.getLogger().info('Exibition window closed');
    });

    exhibitionWindow.windowInstance.show();
    this.backend.getLogger().debug('FullScreen Enable?: ', exhibitionWindow.windowInstance.isFullScreen());

    receivedEvent.reply('exibition.start.done');
  }

  private handleClose(event: IpcMainEvent, exibitionWindow: Window): void {
    event.preventDefault();
    this.backend.getLogger().debug('Signal to close the exibition window received');

    if (!this.backend.getExhibitionWindow()) {
      exibitionWindow.destroy();
      this.backend.setExhibitionWindow(null);
      this.backend.getLogger().debug('Close tasks completed');
    } else {
      this.backend.getLogger().warn('An attempt to close the exibiiton window was made, but it was not from the controller');
    }
  }

  private handlePosition(exhibitionWindow: Window): void {
    const displays = screen.getAllDisplays();

    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    if (externalDisplay) {
      this.backend.getLogger().debug('External display found');
      exhibitionWindow.setAlwaysOnTop(true);
      exhibitionWindow.moveTo(externalDisplay.bounds.x, externalDisplay.bounds.y);
      if (exhibitionWindow.isFullScreenable()) {
        exhibitionWindow.setFullScreen(true);
      } else {
        this.backend.getLogger().warn('The exibition window is not fullscreenable!');
      }
    } else {
      exhibitionWindow.moveTo(0, 0);
      exhibitionWindow.setResizable(false);
      this.backend.getLogger().warn('No external display found');
    }
  }
}
