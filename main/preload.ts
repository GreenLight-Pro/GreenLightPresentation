import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

const handler = {
  send(channel: string, value: unknown): void {
    ipcRenderer.send(channel, value);
  },

  on(channel: string, callback: (...args: unknown[]) => void): () => void {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]): void => {
      callback(args);
    };
    ipcRenderer.on(channel, subscription);

    return (): void => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },

  once(channel: string, callback: (...args: unknown[]) => void): () => void {
    const subscription = (_event: IpcRendererEvent, ...args: unknown[]): void => {
      callback(args);
    };
    ipcRenderer.once(channel, subscription);

    return (): void => {
      ipcRenderer.removeListener(channel, subscription);
    };
  },
};

contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler
