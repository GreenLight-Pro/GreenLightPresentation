import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';

export class StopExibition extends BaseEventStructure {
  constructor(backend: Backend) {
    super('exibition.stop', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    this.backend.getExibitionWindow().close();
    this.backend.setExibitionWindow(null);
    receivedEvent.reply('exibition.stop.done');
  }
}
