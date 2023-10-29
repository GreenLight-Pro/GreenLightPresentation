import { BaseEventStructure } from '../structures';
import { IpcMainEvent } from 'electron';
import { Backend } from '../backend';
import ffmpeg from 'ffmpeg-static';
import path from 'path';
import fs from 'fs';

export class AppGenerateThumbnail extends BaseEventStructure {
  constructor(backend: Backend) {
    super('app.generate.thumbnail', backend, false);
  }

  private static processingFiles: string[] = [];

  override async execute(receivedEvent: IpcMainEvent, projectPath: string): Promise<void> {
    const files = fs.readdirSync(projectPath);
    if (files.length === 0) return receivedEvent.reply('app.generate.thumbnail.done', []);

    const videoFiles = files.filter((file: string) => {
      const ext = path.extname(file);
      return ['.mp4', '.webm'].includes(ext);
    });

    if (videoFiles.length === 0) return receivedEvent.reply('app.generate.thumbnail.done', []);

    const thumbnailPath = path.join(projectPath, '.glp', 'cache', 'thumbnail');

    const toProcessFiles = videoFiles;

    if (!fs.existsSync(thumbnailPath)) {
      fs.mkdirSync(thumbnailPath, { recursive: true });
    } else {
      const thumbnailFiles = fs.readdirSync(thumbnailPath);
      toProcessFiles.forEach((file: string) => {
        const ext = path.extname(file);
        const fileName = path.basename(file, ext);
        if (thumbnailFiles.includes(`${fileName}.jpg`)) {
          const index = toProcessFiles.indexOf(file);
          toProcessFiles.splice(index, 1);
        }
      });
    }

    if (toProcessFiles.length === 0) return receivedEvent.reply('app.generate.thumbnail.done', []);

    // Start thumbnail generation, send each new thumbnail to the renderer with the event 'app.generate.thumbnail.progress'
    // NEVER generate thumbails for the same file at the same time (check if the file is already in processingFiles)
    // When a thumbnail is generated, remove it from the processingFiles array
    // When all thumbnails are generated, send the event 'app.generate.thumbnail.done' to the renderer with the list of generated thumbnails
    // If an error occurs, send the event 'app.generate.thumbnail.error' to the renderer with the error message

    const promises: Promise<void>[] = [];

    for (const file of toProcessFiles) {
      if (AppGenerateThumbnail.processingFiles.includes(file)) continue;
      const filePath = path.join(projectPath, file);
      promises.push(
        new Promise((resolve, reject) => {
          const process = new (ffmpeg as any)(filePath);
          process.then((video: any) => {
            video.fnExtractFrameToJPG(
              thumbnailPath,
              {
                number: 1,
                file_name: path.basename(file, path.extname(file)),
              },
              (error: any) => {
                if (error) {
                  reject(error);
                } else {
                  resolve();
                  receivedEvent.reply('app.generate.thumbnail.progress', file);
                }
              },
            );
          });
        }),
      );
      AppGenerateThumbnail.processingFiles.push(file);
    }

    await Promise.all(promises);

    receivedEvent.reply('app.generate.thumbnail.done', toProcessFiles);
  }
}
