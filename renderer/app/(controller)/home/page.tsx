'use client';
import { ReactElement, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import styles from './home.module.css';
import Store from 'electron-store';
import Link from 'next/link';

export default function Page(): ReactElement {
  const [projects, setProjects] = useState<string[]>([]);

  useEffect(() => {
    const alert = (window as any)?.alert;
    const ipc = (window as any)?.ipc;

    // load projects from the store
    const projectStore: Store = (window as any)?.store?.createStore({
      name: 'projects',
    });

    var projectsLoaded = projectStore.get('projects') as string[] || [];

    if (projectsLoaded && projectsLoaded.length > 0) {
      setProjects(projectsLoaded);
    }

    ipc.on('app.openDialog.response', ([data]: any[]) => {
      projectsLoaded = projectStore.get('projects') as string[] || [];

      if (data[0]) {
        if (projectsLoaded.includes(data[0])) {
          alert('Já existe um projeto nesse diretório!');
          return;
        }
        // add the project to the store
        projectsLoaded.push(data[0]);

        projectStore.set('projects', projectsLoaded);

        setProjects(projectsLoaded);

        // redirect to the project page
        redirect(`/controller/setup/${encodeURIComponent(data[0])}`);
      } else {
        alert('An unknown error has occurred!');
      }
    });

    ipc.on('app.openDialog.error', ([data]: any[]) => {
      alert('ERRO: ' + data);
    });
    return (): void => {
      ipc.removeAllListeners('app.openDialog.response');
      ipc.removeAllListeners('app.openDialog.error');
    };
  }, []);

  return (
    <div id={styles.homePage}>
      <div id={styles.mainContent}>
        <h1>Projetos</h1>
        <p>{projects.length ? 'Selecione um projeto abaixo ou crie um novo :)' : 'Parece que você não tem nenhum projeto. Para começar, aperte o botão abaixo :)'}</p>
        <div id={styles.projects}>
          {projects.map((project) => {
            const path = (window as any).path;
            const fs = (window as any).fs;
            const jsonPath = path.resolve(project, '.glp', 'project.json');
            const projectName = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, 'utf8').toString()).name : path.basename(project);
            return <div className={styles.project} key={project} title={project}>
              <Link href={`/controller/setup/${encodeURIComponent(project)}`} className={styles.projectLink}>
                <span className={styles.projectName}>{projectName}</span>
              </Link>
              <button title='Remover da lista' className={styles.removeProjectButton} onClick={(): void => {
                const projectStore: Store = (window as any)?.store?.createStore({
                  name: 'projects',
                });
                const projectsLoaded = projectStore.get('projects') as string[] || [];
                const index = projectsLoaded.indexOf(project);
                if (index > -1) {
                  projectsLoaded.splice(index, 1);
                  projectStore.set('projects', projectsLoaded);
                  setProjects(projectsLoaded);
                }
              }}>
                <div className={styles.removeIcon}>
                  <div className={styles.iconpart}/>
                  <div className={styles.iconpart}/>
                </div>
              </button>
            </div>;
          })}
          <button title='Adicionar/Criar projeto à lista' className={styles.project} onClick={(): void => {
            ((window as any)?.ipc)?.send('app.openDialog', {
              title: 'Selecione um projeto',
              properties: ['openDirectory'],
            });
          }}>
            <div className={styles.addProjectButton}>
              <div className={styles.iconpart}/>
              <div className={styles.iconpart}/>
            </div>
            <span className={styles.projectName}>Criar</span>
          </button>
        </div>
      </div>
    </div>
  );
}
