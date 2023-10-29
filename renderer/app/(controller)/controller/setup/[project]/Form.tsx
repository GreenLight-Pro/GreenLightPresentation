'use client';

import { ReactElement, useState } from 'react';
import { redirect } from 'next/navigation';
import styles from './projectSetup.module.css';

function validProjectName(name: string, defaultValue: string): string {
  // remove special characters like / or *, allow spaces and accents
  const newName = name.replace(/[^a-zA-Z0-9áàâãéèêíïóôõöúçñ\- ]/g, '');
  if (newName === '') return defaultValue;
  return newName;
}

export default function InteractForm({ path, basename }: { path: string, basename: string }): ReactElement {
  const projectData = {
    name: basename,
    fileRoot: path,
    scenes: [],
  };

  // fs.writeFileSync(projectPath, JSON.stringify(projectData, null, 2));

  const [projectName, setProjectName] = useState<string>('');

  return (
    <div id={styles.setupPage}>
      <h1>Project Setup</h1>
      <form onSubmit={(e): boolean => { e.preventDefault(); return false; }}>
        <p>Project Name</p>
        <input onInput={(value): void => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          setProjectName(value.target.value);
        }} type="text" id="projectName" defaultValue={projectData.name}/>
        {projectName !== validProjectName(projectName, projectData.name) && <p className={styles.error}>O nome do projeto será "{validProjectName(projectName, projectData.name)}"</p>}
        <button onClick={(): void => {
          projectData.name = validProjectName(projectName, projectData.name);
          // save project data to the file
          (window as any)?.fs.writeFileSync((window as any)?.path.resolve(path, '.glp', 'project.json'), JSON.stringify(projectData, null, 2));
          redirect(`/present/${encodeURIComponent(path)}`);
        }} type='button'>Next</button>
      </form>
    </div>
  );
}
