import { redirect } from 'next/navigation';
import { ReactElement } from 'react';
import path from 'path';
import InteractForm from './Form';
import fs from 'fs';

export default function Page({ params }: { params: { project: string } }): ReactElement {
  const project = decodeURIComponent(params.project);

  if (!project || !fs.existsSync(project)) return redirect('/home');

  // find the project.json file inside the project folder
  const projectPath = path.resolve(project, '.glp', 'project.json');

  if (fs.existsSync(projectPath)) return redirect(`/controller/present/${encodeURIComponent(project)}`);

  if (!fs.existsSync(path.resolve(project, '.glp'))) fs.mkdirSync(path.resolve(project, '.glp'));

  return <InteractForm path={project} basename={path.basename(project)} />;
}
