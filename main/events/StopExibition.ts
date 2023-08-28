import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';

export class StopExibition extends BaseEventStructure {
  constructor(backend: Backend) {
    super('exibition.stop', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    const screen = this.backend.getExibitionWindow();
    if (!screen || screen.windowInstance.isDestroyed()) {
      this.backend.getLogger().warn('An attempt to close the exibiiton window was made, but it  wasn\'t open!');
      receivedEvent.reply('exibition.stop.done');
      return;
    }
    this.backend.getLogger().info('Closing exibition window');
    this.backend.setExibitionWindow(null);
    screen.close();

    // If close not worked
    screen.destroy();
    receivedEvent.reply('exibition.stop.done');
  }
}
