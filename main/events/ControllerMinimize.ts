import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';

export class ControllerMinimize extends BaseEventStructure {
  constructor(backend: Backend) {
    super('controller.minimize', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    this.backend.getControllerWindow().minimize();
    receivedEvent.reply('exibition.minimize.done');
  }
}
