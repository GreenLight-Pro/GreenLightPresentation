import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';

export class StopExhibition extends BaseEventStructure {
  constructor(backend: Backend) {
    super('exhibition.stop', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    const screen = this.backend.getExhibitionWindow();
    if (!screen || screen.windowInstance.isDestroyed()) {
      this.backend.getLogger().warn('An attempt to close the exhibition window was made, but it  wasn\'t open!');
      receivedEvent.reply('exhibition.stop.done');
      return;
    }
    this.backend.getLogger().info('Closing exhibition window');
    this.backend.setExhibitionWindow(null);
    screen.close();

    // If close not worked
    screen.destroy();
    receivedEvent.reply('exhibition.stop.done');
  }
}
