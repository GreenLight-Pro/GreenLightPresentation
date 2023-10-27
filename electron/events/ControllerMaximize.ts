import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';

export class ControllerMaximize extends BaseEventStructure {
  constructor(backend: Backend) {
    super('controller.maximize', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    if (this.backend.getControllerWindow()!.windowInstance.isMaximized()) {
      this.backend.getControllerWindow()!.unmaximize();
      receivedEvent.reply('exibition.maximize.done.unmaximized');
    } else {
      this.backend.getControllerWindow()!.maximize();
      receivedEvent.reply('exibition.maximize.done.maximized');
    }
  }
}
