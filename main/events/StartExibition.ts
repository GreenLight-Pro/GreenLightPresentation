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
    if (exibition) {
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
      show: false,
    });

    exibitionWindow.windowInstance.removeMenu();
    // get second screen
    this.handlePosition(exibitionWindow);
    await exibitionWindow.loadURL('/exibition');
    this.backend.setExibitionWindow(exibitionWindow);

    exibitionWindow.windowInstance.once('closed', () => {
      this.backend.setExibitionWindow(null);
    });

    exibitionWindow.windowInstance.show();

    receivedEvent.reply('exibition.start.done');
  }

  private handlePosition(exibitionWindow: Window): void {
    const displays = screen.getAllDisplays();

    const externalDisplay = displays.find((display) => {
      return display.bounds.x !== 0 || display.bounds.y !== 0;
    });
    if (externalDisplay) {
      exibitionWindow.setAlwaysOnTop(true);
      exibitionWindow.moveTo(externalDisplay.bounds.x, externalDisplay.bounds.y);
      exibitionWindow.setFullScreen(true);
    } else {
      exibitionWindow.moveTo(0, 0);
      this.backend.getLogger().warn('No external display found');
    }
  }
}
