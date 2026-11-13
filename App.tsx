import { useEffect, useRef, useState } from 'react';
import { createPreviewScene, type PreviewScene } from '../game/createPreviewScene';
import { DEFAULT_SETTINGS, loadSettings, saveSettings, type GraphicsPreset, type LocalSettings } from '../storage/settings';

type Screen = 'menu' | 'driving' | 'settings';

function DrivingView({ onExit }: { onExit: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graphicsError, setGraphicsError] = useState('');
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let preview: PreviewScene | undefined;
    try {
      preview = createPreviewScene(canvas);
    } catch (error) {
      console.error(error);
      setGraphicsError('3D náhled nelze spustit. Zkontroluj podporu WebGL a zkus nižší grafické nastavení.');
    }
    return () => preview?.dispose();
  }, []);

  return <main className="drive-screen">
    <canvas ref={canvasRef} className="world-canvas" aria-label="3D náhled tréninkové silnice" />
    <div className="drive-topbar"><button className="icon-button" onClick={onExit} aria-label="Zpět do menu">←</button><div><span className="eyebrow">VOLNÁ JÍZDA · PROTOTYP</span><strong>Tréninková oblast</strong></div><span className="offline-pill">OFFLINE</span></div>
    {graphicsError && <div className="graphics-error" role="alert">{graphicsError}</div>}
    <div className="prototype-note">Základní 3D scéna · fyzika vozidla se připravuje</div>
    <div className="drive-bottom"><div className="telemetry"><span>RYCHLOST</span><strong>0 <small>km/h</small></strong></div><div className="telemetry"><span>PŘEVOD</span><strong>N</strong></div><div className="telemetry"><span>OTÁČKY</span><strong>800 <small>rpm</small></strong></div></div>
  </main>;
}

export function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [settings, setSettings] = useState<LocalSettings>(() => loadSettings());
  const updateSettings = (next: LocalSettings) => { setSettings(next); saveSettings(next); };

  if (screen === 'driving') return <DrivingView onExit={() => setScreen('menu')} />;
  if (screen === 'settings') return <main className="menu-shell"><header className="topbar"><span className="brand-mark">&</span><span className="eyebrow">NASTAVENÍ</span><span className="offline-pill">OFFLINE</span></header><section className="settings-panel"><button className="back-link" onClick={() => setScreen('menu')}>← Zpět do menu</button><h1>Nastavení</h1><p className="muted">Změny se ukládají pouze do tohoto zařízení.</p><label className="setting-row"><span><strong>Grafická kvalita</strong><small>Vyšší kvalita může snížit výkon na mobilu.</small></span><select value={settings.graphics} onChange={(event) => updateSettings({ ...settings, graphics: event.target.value as GraphicsPreset })}><option value="performance">Výkon</option><option value="balanced">Vyvážená</option><option value="quality">Kvalita</option></select></label><label className="setting-row"><span><strong>Zvuk</strong><small>Zvukový systém bude doplněn v další etapě.</small></span><input type="checkbox" checked={settings.soundEnabled} onChange={(event) => updateSettings({ ...settings, soundEnabled: event.target.checked })} /></label><button className="secondary-button" onClick={() => updateSettings(DEFAULT_SETTINGS)}>Obnovit výchozí nastavení</button></section></main>;

  return <main className="menu-shell">
    <div className="ambient ambient-one" /><div className="ambient ambient-two" />
    <header className="topbar"><div className="brand"><span className="brand-mark">&</span><div><strong>DRIVING SCHOOL</strong><span>SIMULATOR</span></div></div><div className="topbar-right"><span className="offline-pill"><i /> PLNĚ OFFLINE</span><button className="icon-button" onClick={() => setScreen('settings')} aria-label="Nastavení">⚙</button></div></header>
    <section className="hero"><div className="hero-copy"><span className="eyebrow">PRODUCTION EDITION</span><h1>Nauč se řídit.<br /><em>Ovládni cestu.</em></h1><p>Realistický řidičský simulátor. Bez účtů, bez reklam a bez připojení k internetu po instalaci.</p><div className="menu-actions"><button className="primary-button" onClick={() => setScreen('driving')}>ZAHÁJIT JÍZDU <span>→</span></button><button className="secondary-button" onClick={() => setScreen('settings')}>NASTAVENÍ</button></div><div className="platform-note"><span>ANDROID</span><b>·</b><span>TABLET</span><b>·</b><span>PC</span></div></div><div className="hero-art"><div className="ring ring-one"/><div className="ring ring-two"/><div className="car-silhouette"><div className="car-roof"/><div className="car-body"/><i className="wheel wheel-left"/><i className="wheel wheel-right"/></div><div className="art-caption">01 <span>/</span> DRIVE</div></div></section>
    <footer className="menu-footer"><span>BUILD 0.1.0 · TECHNICKÝ ZÁKLAD</span><span>100% ZDARMA <b>·</b> BEZ REKLAM</span></footer>
  </main>;
}
