import { useEffect, useState } from 'react';
import type { Profile } from './engine/model';
import { setActiveProfile } from './lib/audioStore';
import { configureVoice } from './lib/speech';
import { load, save, type AppData } from './lib/storage';
import { Album } from './screens/Album';
import { Home } from './screens/Home';
import { Library } from './screens/Library';
import { Onboarding } from './screens/Onboarding';
import { Parents } from './screens/Parents';
import { Placement } from './screens/Placement';
import { Profiles } from './screens/Profiles';
import { Session } from './screens/Session';

export type Route =
  | { name: 'perfis' }
  | { name: 'novo' }
  | { name: 'nivelamento' }
  | { name: 'inicio' }
  | { name: 'sessao' }
  | { name: 'biblioteca' }
  | { name: 'album' }
  | { name: 'adultos'; tab?: string };

export interface Ctx {
  data: AppData;
  profile: Profile | null;
  go: (r: Route) => void;
  selectProfile: (id: string | null) => void;
  /** Atualiza o perfil ativo (recebe uma cópia mutável). */
  update: (fn: (p: Profile) => void, id?: string) => void;
  setData: (fn: (d: AppData) => AppData) => void;
}

export default function App() {
  const [data, setDataState] = useState<AppData>(() => load());
  const [profileId, setProfileId] = useState<string | null>(() => (load().profiles.length === 1 ? load().profiles[0].id : null));
  const [route, setRoute] = useState<Route>(() => {
    const d = load();
    if (!d.profiles.length) return { name: 'perfis' };
    return d.profiles.length === 1 ? { name: 'inicio' } : { name: 'perfis' };
  });
  const profile = data.profiles.find((p) => p.id === profileId) ?? null;

  useEffect(() => save(data), [data]);
  useEffect(() => {
    setActiveProfile(profile?.id ?? null);
    if (!profile) return;
    configureVoice({ rate: profile.settings.voiceRate, voicePt: profile.settings.voicePt, voiceEn: profile.settings.voiceEn });
    document.body.classList.toggle('calm', profile.settings.calm);
    document.body.classList.toggle('dyslexia', profile.settings.dyslexiaFont);
  }, [profile]);

  const setData = (fn: (d: AppData) => AppData) => setDataState((d) => fn(d));
  const ctx: Ctx = {
    data,
    profile,
    go: (r) => { setRoute(r); window.scrollTo(0, 0); },
    selectProfile: setProfileId,
    setData,
    update: (fn, id) =>
      setDataState((d) => ({
        ...d,
        profiles: d.profiles.map((p) => {
          if (p.id !== (id ?? profileId)) return p;
          const copy: Profile = structuredClone(p);
          fn(copy);
          return copy;
        }),
      })),
  };

  const needsProfile = ['nivelamento', 'inicio', 'sessao', 'biblioteca', 'album'].includes(route.name);
  if (needsProfile && !profile) return <Profiles ctx={ctx} />;

  switch (route.name) {
    case 'perfis': return <Profiles ctx={ctx} />;
    case 'novo': return <Onboarding ctx={ctx} />;
    case 'nivelamento': return <Placement ctx={ctx} />;
    case 'inicio': return <Home ctx={ctx} />;
    case 'sessao': return <Session ctx={ctx} />;
    case 'biblioteca': return <Library ctx={ctx} />;
    case 'album': return <Album ctx={ctx} />;
    case 'adultos': return <Parents ctx={ctx} tab={route.tab} />;
  }
}
