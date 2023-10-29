'use client';

import { ReactElement } from 'react';
import styles from './projectSetup.module.css';

export default function InteractForm({ path, basename }: { path: string, basename: string }): ReactElement {
  const projectData = {
    name: basename,
    fileRoot: path,
    scenes: [],
  };

  // fs.writeFileSync(projectPath, JSON.stringify(projectData, null, 2));

  return (
    <div id={styles.setupPage}>
      <h1>Project Setup</h1>
      <p>Project Name</p>
      <input type="text" id="projectName" value={projectData.name}/>
      <button onClick={(): void => {}}>Next</button>
    </div>
  );
}
