import { BaseEventStructure } from '../structures';
import { Backend } from '../backend';

export class AppStop extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.stop', backend, false);
  }

  override async execute(): Promise<void> {
    this.backend.getMainWindow()!.close();
  }
}
