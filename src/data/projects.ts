export type Project = {
  id: string;
  title: string;
  category: 'Games' | 'Engineering' | 'Software';
  role: string;
  summary: string;
  tags: string[];
  cover?: string;
  coverAlt?: string;
  link?: string;
  linkLabel?: string;
  gallery?: { src: string; alt: string; caption: string; link?: string }[];
  chapters: { title: string; body: string; points?: string[] }[];
};

// Authored portfolio copy only. See docs/project-sources.md for provenance.
export const projects: Project[] = [
  {
    id: 'lemony-fresh', title: 'Lemony Fresh', category: 'Games',
    role: 'Programmer / Producer · My Dog Zorro',
    summary: 'A 3D action-adventure platformer, built with Unity and C#.',
    tags: ['Unity', 'C#', 'Gameplay', 'Production'],
    cover: '/projects/lemony-fresh.png', coverAlt: 'Lemony Fresh title artwork',
    link: 'https://store.steampowered.com/app/4450050/Lemony_Fresh/', linkLabel: 'Wishlist on Steam',
    gallery: [
      { src: '/projects/lemony-steam-1.jpg', alt: 'Lemony Fresh gameplay screenshot 1', caption: 'Lemony Fresh / official Steam screenshot 01' },
      { src: '/projects/lemony-steam-2.jpg', alt: 'Lemony Fresh gameplay screenshot 2', caption: 'Lemony Fresh / official Steam screenshot 02' },
      { src: '/projects/lemony-steam-3.jpg', alt: 'Lemony Fresh gameplay screenshot 3', caption: 'Lemony Fresh / official Steam screenshot 03' },
      { src: '/projects/lemony-steam-4.jpg', alt: 'Lemony Fresh gameplay screenshot 4', caption: 'Lemony Fresh / official Steam screenshot 04' },
      { src: '/projects/lemony-playnyc.jpg', alt: 'Lemony Fresh booth and gameplay display at PlayNYC', caption: 'PlayNYC / preview of my LinkedIn video post', link: 'https://www.linkedin.com/feed/update/urn:li:activity:7497842255802572800/' },
    ],
    chapters: [
      { title: 'Movement, interaction, feel.', body: 'My work on Lemony Fresh spans programming and production at My Dog Zorro. The project brings together character movement, physics interactions, and real-time performance.' },
      { title: 'Inside the gameplay.', body: 'I build custom player controllers and physics interactions, alongside optimization pipelines in Unity.', points: ['Custom player controllers', 'Physics interactions', 'Gameplay optimization'] },
      { title: 'Taking Lemony Fresh to PlayNYC.', body: 'I showed Lemony Fresh at PlayNYC, where visitors stopped by the booth to try the game. My post thanks Brett Taylor, Isabella Trama, Noor Romans, Andrew, and the volunteers who helped bring the booth together. The gallery includes a preview and a link to the original video post.' },
    ],
  },
  {
    id: 'fairys-inferno', title: "Fairy’s Inferno", category: 'Games',
    role: 'Lead Gameplay & Shader Developer',
    summary: 'A Touhou-inspired vertical bullet-hell shooter made for The Very Serious Juniper Dev Game Jam.',
    tags: ['Unity', 'C#', 'WebGL', 'Shaders'],
    cover: '/projects/fairys-inferno.png', coverAlt: 'Fairy’s Inferno illustrated title artwork',
    link: 'https://tukotara.itch.io/fairys-inferno', linkLabel: 'Play on itch.io',
    chapters: [
      { title: 'A screen full of patterns.', body: 'A small team, a game-jam deadline, and a vertical shooter inspired by Touhou. I led gameplay and shader development.' },
      { title: 'Built for the browser.', body: 'The project shipped as a WebGL build on itch.io. Custom particle shaders were part of the work of bringing the game’s effects to the browser.', points: ['Gameplay development', 'Custom particle shaders', 'WebGL build'] },
    ],
  },
  {
    id: 'takedown-protocol', title: 'Takedown Protocol', category: 'Games',
    role: 'Game Developer · Arcadia Games Collective',
    summary: 'A 2D fighting game with custom character mechanics, combos, and responsive input.',
    tags: ['Unity', 'C#', 'Combat', 'Game Physics'],
    cover: '/projects/arcadiaprotocol.png', coverAlt: 'Takedown Protocol artwork from the original portfolio',
    link: 'https://github.com/Arcadia-Collective-Games',
    chapters: [
      { title: 'Every input matters.', body: 'At Arcadia Games Collective, I helped develop Takedown Protocol: a 2D fighter built around character mechanics, combo systems, and multiplayer.' },
      { title: 'Combat under the surface.', body: 'The work includes input detection, dynamic hitboxes, and custom physics and collision systems. The original project plan also includes rollback netcode for online play.', points: ['Character mechanics and combos', 'Input handling and dynamic hitboxes', 'Physics and collision systems'] },
    ],
  },
  {
    id: 'prescription', title: 'Prescription', category: 'Games',
    role: 'Current game project',
    summary: 'A game I’m currently making, alongside my other game-development work.',
    tags: ['Game Development', 'In progress'],
    cover: '/projects/prescription-blue.png', coverAlt: 'Prescription blue character painting',
    gallery: [
      { src: '/projects/prescription-blue.png', alt: 'Blue character in a moonlit scene from Prescription', caption: 'Prescription / blue character artwork' },
      { src: '/projects/prescription-farmer.png', alt: 'Farmer character wearing a broad yellow hat from Prescription', caption: 'Prescription / farmer character artwork' },
    ],
    chapters: [{ title: 'Still taking shape.', body: 'Prescription is part of my current game work. These character paintings offer a first look at the project: the blue character and the farmer. More of the game will appear here as it develops.' }],
  },
  {
    id: 'gif-to-avif', title: 'GIF to AVIF', category: 'Software',
    role: 'Developer', summary: 'A lightweight browser-based converter for making animated assets smaller.',
    tags: ['JavaScript', 'Image Processing', 'AVIF'],
    cover: '/projects/gif_to_avif.png', coverAlt: 'GIF-to-AVIF converter interface',
    link: 'https://github.com/Hyunguy/GIF-to-avif-converter',
    chapters: [
      { title: 'Animation, less weight.', body: 'I built this converter in about a week to turn GIFs into more compact AVIF files. It started with a practical need: lighter animated media for the web.' },
      { title: 'Preserving transparency.', body: 'The conversion work includes checking alpha channels and encoding animated assets. File-size savings depend on the input, so the result is an asset to inspect rather than a fixed compression promise.', points: ['GIF-to-AVIF conversion', 'Alpha-channel handling', 'Smaller animated web assets'] },
    ],
  },
  {
    id: 'fiber-bragg', title: 'Optical Sensing Tools', category: 'Engineering',
    role: 'Electrical Engineer Co-op · SRI International',
    summary: 'C++ tooling for Fiber Bragg grating sensing and optical signal analysis.',
    tags: ['C++', 'Optics', 'Signal Processing'],
    chapters: [
      { title: 'Reading strain through light.', body: 'At SRI International, I built C++ tooling for an optical Fiber Bragg grating sensing pipeline.' },
      { title: 'Signals into measurements.', body: 'The work involved analyzing wavelength-shifted light signals to detect mechanical strain. This entry stays at the public, high-level description of that work.' },
    ],
  },
  {
    id: 'nl2sql', title: 'Natural Language to SQL', category: 'Engineering',
    role: 'Break Through Tech AI Fellow · Cornell Tech',
    summary: 'A natural-language-to-SQL translation pipeline built with LangChain.',
    tags: ['Python', 'LangChain', 'SQL'],
    chapters: [
      { title: 'Ask in plain language.', body: 'I engineered a pipeline that translates natural-language requests into SQL as part of my AI fellowship work.' },
      { title: 'Connecting language and data.', body: 'The project combines Python and LangChain with structured database queries, exploring the boundary between a user’s question and the database operation it represents.' },
    ],
  },
  {
    id: 'bearing-diagnosis', title: 'Bearing Fault Diagnosis', category: 'Engineering',
    role: 'Break Through Tech AI Fellow',
    summary: 'A bearing fault diagnosis model for the MathWorks AI Studio Challenge.',
    tags: ['MATLAB', 'Machine Learning', 'Diagnostics'],
    chapters: [
      { title: 'Learning from machine signals.', body: 'I built a bearing fault diagnosis model for MathWorks’ AI Studio Challenge during my Break Through Tech AI fellowship.' },
      { title: 'An applied AI problem.', body: 'This project brought machine learning into an engineering context: recognizing faults in mechanical equipment, using MATLAB as part of the workflow.' },
    ],
  },
  {
    id: 'microhydrogel', title: 'Microhydrogel Research', category: 'Engineering',
    role: 'Laboratory Intern · Stevens · Summer 2025',
    summary: 'Monte Carlo simulation and microhydrogel coating research for experimental repeatability.',
    tags: ['Monte Carlo', 'CASINO', 'SEM', 'Research'],
    cover: '/projects/stevensresearch.png', coverAlt: 'Stevens research material from the original portfolio',
    chapters: [
      { title: 'Simulation meets the lab.', body: 'I developed a Monte Carlo simulation tool to model process variability and supported microhydrogel synthesis using microfluidic systems.' },
      { title: 'Checking the experiment.', body: 'My work included equipment calibration, root-cause investigations, SEM work, and modifications to a CASINO module for electron-penetration analysis. I presented findings in peer reviews and to Army engineers at Picatinny Arsenal.', points: ['Simulation and experimental comparison', 'Equipment calibration', 'Research presentations'] },
    ],
  },
  {
    id: 'autonomous-boat', title: 'Autonomous Boat', category: 'Engineering',
    role: 'Project Contributor', summary: 'A real-time navigation system combining LIDAR sensing and GIS flow modeling.',
    tags: ['C++', 'LIDAR', 'MQTT', 'Circuits'],
    cover: '/projects/engr112.png', coverAlt: 'Autonomous boat engineering project',
    chapters: [
      { title: 'Finding a route on water.', body: 'The project explores autonomous marine navigation using LIDAR sensors and GIS flow modeling.' },
      { title: 'Sense, process, navigate.', body: 'Environmental data feeds route calculation and obstacle avoidance. My contribution sits at the intersection of sensing, circuits, and real-time navigation.', points: ['Environmental sensing', 'Obstacle detection', 'GIS mapping integration'] },
    ],
  },
  {
    id: 'smart-planter', title: 'Smart-Water Planter', category: 'Engineering',
    role: 'Project Contributor', summary: 'An Arduino irrigation system with soil-moisture feedback and remote monitoring.',
    tags: ['Arduino', 'C++', 'IoT', 'MQTT'],
    cover: '/projects/111.png', coverAlt: 'Arduino smart-water planter project',
    chapters: [
      { title: 'Water only when needed.', body: 'An intelligent irrigation system built around an Arduino, soil-moisture sensors, and automated water pumps.' },
      { title: 'Closing the loop.', body: 'Feedback control maintains soil moisture, with systematic testing to improve consistency. An MQTT network supports remote monitoring and data collection.', points: ['Moisture sensing', 'Pump feedback control', 'MQTT monitoring'] },
    ],
  },
  {
    id: 'amazon-analysis', title: 'Fulfillment Center Analysis', category: 'Engineering',
    role: 'Data Analyst Extern · Amazon operations project',
    summary: 'Analysis of employee attrition patterns using data science and machine learning.',
    tags: ['Python', 'Pandas', 'Scikit-learn'],
    cover: '/projects/amazoncert.png', coverAlt: 'Certificate from the Amazon operations externship',
    chapters: [
      { title: 'Understanding employee turnover.', body: 'I analyzed employee attrition patterns, trained predictive models, and prepared interactive dashboards for stakeholder presentations.' },
      { title: 'Beyond the dataset.', body: 'The project combined employee records with interviews of fulfillment-center workers, turning quantitative data and interview transcripts into recommendations.', points: ['Data analysis and predictive modeling', 'Employee interviews', 'Stakeholder presentations'] },
    ],
  },
  {
    id: 'eventide', title: 'EVENTIDE', category: 'Software', role: 'Developer',
    summary: 'A React and Vite e-commerce application with responsive state management.',
    tags: ['React', 'Vite', 'E-commerce'],
    chapters: [{ title: 'A storefront on the web.', body: 'EVENTIDE is an e-commerce application built with React and Vite. The work focuses on the frontend and responsive application state.' }],
  },
  {
    id: 'gedcom-parser', title: 'GEDCOM Parser', category: 'Software', role: 'Agile team project',
    summary: 'Parsing genealogical datasets in a team-based software project.',
    tags: ['Python', 'GEDCOM', 'Agile'],
    link: 'https://github.com/Hyunguy/ssw-555-group-G-M3.B2-Assignment-Programming-Project-3',
    chapters: [{ title: 'Making sense of family data.', body: 'A sprint-based team project for parsing complex genealogical tree datasets. The repository contains the programming assignment and implementation.' }],
  },
  {
    id: 'arcane-macro', title: 'Arcane Odyssey Macro', category: 'Software', role: 'Developer',
    summary: 'An AutoHotkey v2 fishing macro using pixel detection.', tags: ['AutoHotkey v2', 'Automation', 'Pixel Detection'],
    chapters: [{ title: 'Working from what is on screen.', body: 'An automation project using AutoHotkey v2 and pixel detection to support fishing in Arcane Odyssey.' }],
  },
  {
    id: 'newsletter-bot', title: 'Discord Newsletter Bot', category: 'Software', role: 'Developer',
    summary: 'A Python bot that aggregates technology articles and updates.', tags: ['Python', 'discord.py', 'Automation'],
    chapters: [{ title: 'Bringing updates together.', body: 'A newsletter bot built with Python and discord.py to aggregate tech articles and updates in Discord.' }],
  },
  {
    id: 'hyunspace', title: 'HYUNSPACE', category: 'Software', role: 'Developer & Designer',
    summary: 'My personal portfolio: interactive 3D forms, experiments in shading, and the work behind them.',
    tags: ['React', 'Three.js', 'GLSL', 'Design'], link: 'https://github.com/Hyunguy/hyunspace.me',
    chapters: [
      { title: 'A living site.', body: 'HYUNSPACE is my portfolio and an ongoing place to experiment with visual interaction, real-time graphics, and how to present my work.' },
      { title: 'Dots, depth, and movement.', body: 'The current version combines draggable 3D forms, a moving node field, lighting-driven halftone shading, and horizontally scrolling project stories.' },
    ],
  },
];
