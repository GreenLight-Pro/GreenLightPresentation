import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import Store from 'electron-store';

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

const store = {
  createStore(options: any): {
    get: (key: string) => any;
    set: (key: string, value: any) => void;
    delete: (key: string) => void;
    clear: () => void;
  } {
    const createdStore = new Store(options);

    return {
      get: (key: string): any => { return createdStore.get(key); },
      set: (key: string, value: any) => createdStore.set(key, value),
      delete: (key: string) => createdStore.delete(key),
      clear: () => createdStore.clear(),
    };
  },
};

contextBridge.exposeInMainWorld('store', store);
contextBridge.exposeInMainWorld('ipc', handler);

export type IpcHandler = typeof handler
export type BackendStore = typeof store
