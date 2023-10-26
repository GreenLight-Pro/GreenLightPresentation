import { BaseEventStructure } from '../structures';
import { IpcMainEvent, screen } from 'electron';
import { Backend } from '../backend';

export class GetScreens extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.getScreens', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent): Promise<void> {
    const displays = screen.getAllDisplays();

    // [ {name: display.label, size: { width: "width", height: "height" }, id: display.id }]
    const responseObject = displays.map((display) => {
      return {
        name: display.label,
        size: {
          width: display.size.width,
          height: display.size.height,
        },
        id: display.id,
      };
    });

    receivedEvent.reply('app.getScreens.return', responseObject);
  }
}
