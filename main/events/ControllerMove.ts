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

    const controller = this.backend.getControllerWindow().windowInstance;

    controller.setBounds(window.bounds);

    controller.focus();
    controller.show();
    controller.maximize();

    receivedEvent.reply('exibition.move.done');
  }
}
