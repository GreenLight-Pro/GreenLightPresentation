import { BaseEventStructure } from '../structures';
import { Backend } from '../backend';

export class ControllerMinimize extends BaseEventStructure {
  constructor(backend: Backend) {
    super('controller.minimize', backend, false);
  }

  override async execute(): Promise<void> {
    this.backend.getMainWindow()!.minimize();
  }
}
