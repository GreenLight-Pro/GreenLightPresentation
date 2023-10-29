'use client';

import React, { useEffect, useState } from 'react';
import styles from './controlScreen.module.css';

export default function ControllerScreen({ project }: { project: { name: string, fileRoot: string, scenes: any[] } }): React.ReactElement {
  const [indexing, setIndexing] = useState<boolean>(true);
  const [fileList, setFileList] = useState<string[]>([]);

  useEffect(() => {
    const fs = (window as any).fs;
    const ipc = (window as any).ipc;
    const path = (window as any).path;

    const validExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg', '.mp4', '.webm', '.ogg', '.mp3', '.wav'];

    const files = fs.readdirSync(project.fileRoot);
    const filteredFiles = files.filter((file: string) => {
      const ext = path.extname(file);
      return validExtensions.includes(ext);
    });

    // Disparado a cada arquivo que tiver thumbnail gerado
    ipc.on('app.generate.thumbnail.progress', ([file]: string) => {
    });

    // Recebe a lista de todos os arquivos que tiveram thumbnails gerados
    ipc.once('app.generate.thumbnail.done', ([files]: string[]) => {
      setIndexing(false);
      ipc.removeAllListeners('app.generate.thumbnail.progress');
    });

    ipc.send('app.generate.thumbnail', project.fileRoot);
  }, []);

  return <div id={styles.controlScreen}>
    <div id={styles.leftPanel}>
      <div id={styles.scenesPanel}></div>
      <div id={styles.fileExplorer}></div>
    </div>
    <div id={styles.mainRegion}>
      <div id={styles.topRegion}>
        <div id={styles.previewArea}></div>
        <div id={styles.controlButtons}></div>
      </div>
      <div id={styles.timeline}>

      </div>
    </div>
  </div>;
}
