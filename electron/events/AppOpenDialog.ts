import { BaseEventStructure } from '../structures';
import { IpcMainEvent, dialog } from 'electron';
import { Backend } from '../backend';

export class AppOpenDialog extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.openDialog', backend, false);
  }

  override async execute(receivedEvent: IpcMainEvent, ...args: any[]): Promise<void> {
    if (!args[0] || typeof args[0] !== 'object') return receivedEvent.reply('app.openDialog.error', 'Invalid arguments');

    const title = args[0].title ?? 'Select a folder';

    const result = await dialog.showOpenDialog({
      properties: args[0].properties,
      title,
    });

    if (result.canceled) {
      return receivedEvent.reply('app.openDialog.response', null);
    }

    return receivedEvent.reply('app.openDialog.response', result.filePaths);
  }
}
