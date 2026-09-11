import './tailwind.css';
import React from '@fuser/vendor/react';
import { createRoot } from '@fuser/vendor/react-dom/client';
import App from './App';

const container = document.getElementById('root');
const appData = JSON.parse(document.getElementById('__APP_DATA__')?.textContent ?? '{}') as {
  sceneReference?: string;
  portfolioMedia?: { va11HeadsGif?: string; va11CityGif?: string; takopiGif?: string; communityPhoto?: string };
};
if (container) {
  const root = createRoot(container);
  root.render(<App sceneReference={appData.sceneReference} portfolioMedia={appData.portfolioMedia} />);
}
