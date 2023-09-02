import { BaseEventStructure } from '../structures';
import { IpcMainEvent, screen } from 'electron';
import { Backend } from '../backend';
import { Window } from '../helpers';

export class StartExibition extends BaseEventStructure {
  constructor(backend: Backend) {
    super('exibition.start', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    const exibition = this.backend.getExibitionWindow();

    if (exibition && !exibition.windowInstance.isDestroyed()) {
      exibition.windowInstance.reload();
      this.handlePosition(exibition);
      exibition.windowInstance.focus();
      exibition.windowInstance.show();
      receivedEvent.reply('exibition.start.done');
      return;
    }

    const exibitionWindow = new Window(this.backend, 'exibition', {
      width: 800,
      height: 600,
      minWidth: 800,
      minHeight: 600,
      show: false,
      minimizable: false,
      maximizable: false,
      closable: false,
    });

    exibitionWindow.windowInstance.removeMenu();

    // get second screen
    this.handlePosition(exibitionWindow);

    await exibitionWindow.loadURL('/exibition');

    this.backend.setExibitionWindow(exibitionWindow);

    exibitionWindow.windowInstance.on('close', (event: IpcMainEvent) => {
      this.backend.getLogger().debug('Exibition window close event received');
      this.handleClose(event, exibitionWindow);
    });

    // Unhandle the close event
    exibitionWindow.windowInstance.once('closed', (event: IpcMainEvent) => {
      exibitionWindow.windowInstance.removeAllListeners('close');
      this.handleClose(event, exibitionWindow);
      this.backend.getLogger().info('Exibition window closed');
    });

    exibitionWindow.windowInstance.show();
    this.backend.getLogger().debug('FullScreen Enable?: ', exibitionWindow.windowInstance.isFullScreen());

    receivedEvent.reply('exibition.start.done');
  }

  private handleClose(event: IpcMainEvent, exibitionWindow: Window): void {
    event.preventDefault();
    this.backend.getLogger().debug('Signal to close the exibition window received');

    if (!this.backend.getExibitionWindow()) {
      exibitionWindow.destroy();
      this.backend.setExibitionWindow(null);
      this.backend.getLogger().debug('Close tasks completed');
    } else {
      this.backend.getLogger().warn('An attempt to close the exibiiton window was made, but it was not from the controller');
    }
  }

  private handlePosition(exibitionWindow: Window): void {
    const displays = screen.getAllDisplays();

    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });

    if (externalDisplay) {
      this.backend.getLogger().debug('External display found');
      exibitionWindow.setAlwaysOnTop(true);
      exibitionWindow.moveTo(externalDisplay.bounds.x, externalDisplay.bounds.y);
      if (exibitionWindow.isFullScreenable()) {
        exibitionWindow.setFullScreen(true);
      } else {
        this.backend.getLogger().warn('The exibition window is not fullscreenable!');
      }
    } else {
      exibitionWindow.moveTo(0, 0);
      exibitionWindow.setResizable(false);
      this.backend.getLogger().warn('No external display found');
    }
  }
}
