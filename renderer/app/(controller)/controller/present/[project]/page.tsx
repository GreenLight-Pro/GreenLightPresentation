import React from 'react';
import SelectScreen from './selectScreen';
import ControllerScreen from './controlScreen';
import path from 'path';
import fs from 'fs';

export default function Page({ params }: { params: { project: string }}): React.ReactElement {
  return <SelectScreen>
    <ControllerScreen project={JSON.parse(fs.readFileSync(path.resolve(decodeURIComponent(params.project), '.glp', 'project.json'), 'utf8'))} />
  </SelectScreen>;
}
