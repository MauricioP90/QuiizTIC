import navidadBg from '../../assets/navidad.jpeg';
import cyberBg from '../../assets/cyber.jpg';
import veranoBg from '../../assets/verano.jpg';
import halloweenBg from '../../assets/halloween.jpg';

export type ThemeId = 'cyber' | 'navidad' | 'halloween' | 'macarena';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  description: string;
  bgClass: string;
  bodyStyle: {
    backgroundColor: string;
    backgroundImage: string;
    backgroundSize?: string;
    backgroundPosition?: string;
    backgroundRepeat?: string;
    backgroundAttachment?: string;
  };
  titleGradient: string;
  primaryButton: string;
  accentText: string;
  accentBorder: string;
  glowTopLeft: string;
  glowBottomRight: string;
  badgeBg: string;
  pointsBadgeClass: string;
  previewColor: string;
  previewSecondary: string;
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  macarena: {
    id: 'macarena',
    name: 'Corporativo Flota La Macarena',
    description: 'Identidad corporativa con fondo de verano cálido: Naranja vibrante, Amarillo dorado solar y Blanco puro.',
    bgClass: 'bg-transparent',
    bodyStyle: {
      backgroundColor: '#0c0a07',
      backgroundImage: `
        radial-gradient(circle at 50% 30%, rgba(12, 10, 7, 0.32) 0%, rgba(10, 8, 5, 0.58) 100%),
        url("${veranoBg}")
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    },
    titleGradient: 'from-white via-amber-200 to-orange-400',
    primaryButton: 'bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 hover:from-orange-400 hover:to-yellow-300 text-slate-950 font-black shadow-lg shadow-orange-500/30 ring-1 ring-yellow-400/50 hover:shadow-orange-500/50 hover:brightness-105 active:scale-[0.98]',
    accentText: 'text-amber-400',
    accentBorder: 'border-orange-500/40',
    glowTopLeft: 'bg-orange-600/25',
    glowBottomRight: 'bg-amber-500/20',
    badgeBg: 'bg-orange-500/15 text-amber-200 border border-orange-500/40 shadow-sm shadow-orange-500/20',
    pointsBadgeClass: 'bg-amber-950/70 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20',
    previewColor: '#ea580c',
    previewSecondary: '#facc15'
  },
  cyber: {
    id: 'cyber',
    name: 'Ciberseguridad / Cyber',
    description: 'Ambiente futurista con fondo de ciberseguridad, matriz digital, tonos violetas y cian eléctrico.',
    bgClass: 'bg-transparent',
    bodyStyle: {
      backgroundColor: '#080c16',
      backgroundImage: `
        radial-gradient(circle at 50% 30%, rgba(8, 12, 22, 0.35) 0%, rgba(6, 9, 17, 0.62) 100%),
        url("${cyberBg}")
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    },
    titleGradient: 'from-violet-400 via-indigo-200 to-cyan-400',
    primaryButton: 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-indigo-600/25',
    accentText: 'text-indigo-400',
    accentBorder: 'border-indigo-500/30',
    glowTopLeft: 'bg-indigo-600/20',
    glowBottomRight: 'bg-cyan-600/20',
    badgeBg: 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/30',
    pointsBadgeClass: 'bg-indigo-950/70 text-cyan-300 border border-indigo-500/40 shadow-sm shadow-cyan-500/20',
    previewColor: '#6366f1',
    previewSecondary: '#06b6d4'
  },
  halloween: {
    id: 'halloween',
    name: 'Halloween / Noche de Brujas',
    description: 'Atmósfera gótica y misteriosa con fondo temático, violeta nocturno, resplandores morados y acentos electrizantes.',
    bgClass: 'bg-transparent',
    bodyStyle: {
      backgroundColor: '#0a0512',
      backgroundImage: `
        radial-gradient(circle at 50% 30%, rgba(14, 7, 24, 0.32) 0%, rgba(8, 4, 14, 0.60) 100%),
        url("${halloweenBg}")
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    },
    titleGradient: 'from-purple-200 via-fuchsia-200 to-violet-400',
    primaryButton: 'bg-gradient-to-r from-purple-600 via-violet-600 to-fuchsia-500 hover:from-purple-500 hover:to-fuchsia-400 text-white font-black shadow-lg shadow-purple-600/35 ring-1 ring-purple-400/50 hover:shadow-purple-500/50 hover:brightness-105 active:scale-[0.98]',
    accentText: 'text-purple-300',
    accentBorder: 'border-purple-500/40',
    glowTopLeft: 'bg-purple-600/30',
    glowBottomRight: 'bg-fuchsia-600/25',
    badgeBg: 'bg-purple-950/70 text-purple-200 border border-purple-500/40 shadow-sm shadow-purple-500/20',
    pointsBadgeClass: 'bg-purple-950/80 text-fuchsia-300 border border-purple-400/40 shadow-sm shadow-purple-400/20',
    previewColor: '#9333ea',
    previewSecondary: '#c084fc'
  },
  navidad: {
    id: 'navidad',
    name: 'Navidad / Fin de Año',
    description: 'Mágica atmósfera festiva con fondo navideño oficial, verde pino escarchado, rojo rubí y destellos dorados.',
    bgClass: 'bg-transparent',
    bodyStyle: {
      backgroundColor: '#071618',
      backgroundImage: `
        radial-gradient(circle at 50% 30%, rgba(7, 24, 25, 0.32) 0%, rgba(4, 15, 16, 0.58) 100%),
        url("${navidadBg}")
      `,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    },
    titleGradient: 'from-white via-amber-200 to-rose-400',
    primaryButton: 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black shadow-lg shadow-red-600/35 ring-1 ring-amber-400/50 hover:shadow-red-500/50 hover:brightness-105 active:scale-[0.98]',
    accentText: 'text-amber-300',
    accentBorder: 'border-emerald-500/40',
    glowTopLeft: 'bg-rose-600/30',
    glowBottomRight: 'bg-emerald-600/25',
    badgeBg: 'bg-emerald-950/70 text-emerald-200 border border-emerald-500/40 shadow-sm shadow-emerald-500/20',
    pointsBadgeClass: 'bg-emerald-950/80 text-amber-300 border border-amber-400/40 shadow-sm shadow-amber-400/20',
    previewColor: '#e11d48',
    previewSecondary: '#10b981'
  }
};

export function getTheme(id?: string): ThemeConfig {
  if (id && id in THEMES) {
    return THEMES[id as ThemeId];
  }
  if (id === 'seguridad_vial') {
    return THEMES.halloween;
  }
  return THEMES.macarena;
}
