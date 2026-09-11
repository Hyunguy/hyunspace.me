import React from '@fuser/vendor/react';
import { Settings, RefreshCw, Activity, Sun, Moon } from '@fuser/vendor/lucide-react';

interface HeaderNavProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  renderMode: 'render' | 'wireframe';
  toggleRenderMode: () => void;
  showProfiler: boolean;
  setShowProfiler: (show: boolean) => void;
  gyroEnabled: boolean;
  handleRequestGyro: () => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export default function HeaderNav({
  theme,
  toggleTheme,
  renderMode,
  toggleRenderMode,
  showProfiler,
  setShowProfiler,
  gyroEnabled,
  handleRequestGyro,
  activeSection,
  setActiveSection
}: HeaderNavProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-8 py-3 flex items-center justify-between pointer-events-auto">

      {/* Brand / Logo Mark */}
      <button
        onClick={() => setActiveSection('home')}
        className="flex items-center space-x-3 text-left group cursor-pointer"
      >
        {/* Logo Mark: 4-square mini checker */}
        <div className="w-8 h-8 grid grid-cols-2 gap-0.5 border-2 border-current p-0.5 bg-black">
          <div className="bg-white group-hover:bg-accent-warm transition-colors" />
          <div className="bg-black border border-white" />
          <div className="bg-black border border-white" />
          <div className="bg-white group-hover:bg-accent-cool transition-colors" />
        </div>
        <div className="flex flex-col">
          <span className="font-display font-black text-2xl tracking-tighter leading-none text-current group-hover:translate-x-0.5 transition-transform">
            kh.
          </span>
          <span className="font-mono text-[10px] text-ink-muted uppercase tracking-wider">
            kevin hyun
          </span>
        </div>
      </button>

      {/* Top Right Controls & Gyro */}
      <div className="flex items-center space-x-3 font-mono text-xs">

        {/* Gyro Sensor Button */}
        <button
          onClick={handleRequestGyro}
          title="Enable Device Accelerometer / Gyroscope Physics"
          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border text-[11px] transition-all cursor-pointer ${
            gyroEnabled
              ? 'bg-black text-white border-black font-bold'
              : 'bg-white/80 text-black border-black/30 hover:border-black'
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${gyroEnabled ? 'animate-spin' : ''}`} />
          <span>enable_gyro?</span>
        </button>

        {/* Theme Light / Dark Switcher */}
        <button
          onClick={toggleTheme}
          title="Toggle Light / Dark Mode"
          className="flex items-center space-x-1.5 bg-white/80 dark:bg-black/80 hover:bg-black/10 dark:hover:bg-white/10 border border-black/30 dark:border-white/30 px-2.5 py-1 rounded text-[11px] text-current transition-all cursor-pointer"
        >
          {theme === 'light' ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3 text-cyan-400" />}
          <span className="font-bold uppercase">{theme} mode</span>
        </button>

        {/* Render / Wireframe Blueprint Mode */}
        <button
          onClick={toggleRenderMode}
          title="Toggle Render vs Blueprint Wireframe Shaders"
          className="hidden sm:flex items-center space-x-1.5 bg-white/80 dark:bg-black/80 border border-black/30 dark:border-white/30 px-2.5 py-1 rounded text-[11px] text-current transition-all cursor-pointer"
        >
          <Settings className="w-3 h-3 text-accent-cool" />
          <span className="font-bold uppercase">{renderMode}</span>
        </button>

        {/* Dev Profiler HUD */}
        <button
          onClick={() => setShowProfiler(!showProfiler)}
          title="Toggle WebGL Profiler HUD"
          className={`flex items-center space-x-1 px-2 py-1 rounded border text-[11px] transition-all cursor-pointer ${
            showProfiler
              ? 'bg-black text-white border-black'
              : 'bg-white/80 text-black border-black/30 hover:border-black'
          }`}
        >
          <Activity className="w-3 h-3" />
          <span>HUD</span>
        </button>

      </div>

    </header>
  );
}
