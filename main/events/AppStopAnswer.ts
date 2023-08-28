import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';

export class AppStopAnswer extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.stop.answer', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, ...args: any[]): Promise<void> {
    if (!args[0]) return;
    receivedEvent.reply('goodbye');
    this.backend.getControllerWindow().destroy();
  }
}
