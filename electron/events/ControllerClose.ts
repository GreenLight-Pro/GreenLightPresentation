import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';

export class ControllerClose extends BaseEventStructure {
  constructor(backend: Backend) {
    super('controller.close', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    this.backend.getControllerWindow()!.close();
    receivedEvent.reply('exibition.close.done');
  }
}
