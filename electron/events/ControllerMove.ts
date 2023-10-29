import { BaseEventStructure } from '../structures';
import { IpcMainEvent, screen } from 'electron';
import { Backend } from '../backend';

export class ControllerMove extends BaseEventStructure {
  constructor(backend: Backend) {
    super('controller.move', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, screenId: number): Promise<void> {
    const displays = screen.getAllDisplays();

    const window = displays.find((display) => display.id === screenId);

    if (!window) {
      receivedEvent.reply('controller.move.error', 'Screen not found');
      return;
    }

    const controller = this.backend.getMainWindow()!.windowInstance;

    controller.setPosition(window.bounds.x, window.bounds.y, true);

    controller.focus();
    controller.show();
    controller.maximize();
  }
}
