// 페이지 디자인 테마 레지스트리.
// - `minimal`은 사용자가 고른 대표색(color)에서 파스텔 톤을 파생(derivePalette).
// - 나머지 팝/컬러풀 테마는 배경 그라데이션 · 액센트 · 컨페티 색을 통째로 정의.
// 생성 마법사(StepColor/Review/CreatedView)와 실제 생일 페이지가 동일하게 이 값을 사용한다.

import { derivePalette } from './derivePalette';

// 실제 렌더에 필요한, 해석이 끝난 테마 값.
export interface PageTheme {
  id: string;
  pageBg: string; // <main> 배경 (그라데이션 가능)
  accent: string; // 대표 액센트 (키커/버튼/링)
  accentSoft: string; // 사진 placeholder 등 옅은 톤
  onAccent: string; // 액센트 버튼 위 글자색
  heroInk: string; // 축하 문구/제목 글자색
  ringColor: string; // 사진 회전 점선 링
  cardBg: string; // 카드 표면
  cardBorder: string; // 카드 테두리
  ctaShadow: string; // CTA 버튼 그림자
  confetti: string[]; // 컨페티 색 세트
}

// 마법사 갤러리에 노출할 테마 정의(프리셋).
export interface ThemeDef {
  id: string;
  name: string; // 한글 이름
  emoji: string;
  tag: string; // 짧은 설명
  cardBg: string; // 갤러리 카드 미리보기 배경
  dot: string; // 갤러리 카드 액센트 점 색
  custom?: boolean; // true면 사용자가 대표색을 직접 고름(미니멀)
}

export const DEFAULT_MINIMAL_COLOR = '#FF6B9D';

// 갤러리에 보여줄 순서대로.
export const THEME_OPTIONS: ThemeDef[] = [
  {
    id: 'minimal',
    name: '미니멀',
    emoji: '🤍',
    tag: '내 색으로 깔끔하게',
    cardBg: '#F7F6F3',
    dot: DEFAULT_MINIMAL_COLOR,
    custom: true,
  },
  {
    id: 'candy',
    name: '캔디 팝',
    emoji: '🍭',
    tag: '핑크 × 퍼플 그라데이션',
    cardBg: 'linear-gradient(150deg, #FFE1EF 0%, #FBDDFF 52%, #ECE0FF 100%)',
    dot: '#EC1E79',
  },
  {
    id: 'sunset',
    name: '선셋',
    emoji: '🌅',
    tag: '노을빛 따뜻한 톤',
    cardBg: 'linear-gradient(150deg, #FFE9D3 0%, #FFDADF 55%, #FFDCF1 100%)',
    dot: '#F03E5C',
  },
  {
    id: 'ocean',
    name: '오션 팝',
    emoji: '🌊',
    tag: '스카이 × 민트 청량함',
    cardBg: 'linear-gradient(150deg, #D6F1FF 0%, #DBF6EE 100%)',
    dot: '#0286C7',
  },
  {
    id: 'grape',
    name: '그레이프',
    emoji: '🍇',
    tag: '라일락 × 퍼플 무드',
    cardBg: 'linear-gradient(150deg, #ECE4FF 0%, #F4E1FF 100%)',
    dot: '#7C3AED',
  },
  {
    id: 'tangerine',
    name: '탠저린 팝',
    emoji: '🍊',
    tag: '탱글한 오렌지 에너지',
    cardBg: 'linear-gradient(150deg, #FFEAC9 0%, #FFD9C2 100%)',
    dot: '#E8590C',
  },
];

export const THEME_MAP: Record<string, ThemeDef> = Object.fromEntries(
  THEME_OPTIONS.map((t) => [t.id, t]),
);

// 프리셋(minimal 제외) 각각의 해석된 PageTheme.
const PRESET_THEMES: Record<string, PageTheme> = {
  candy: {
    id: 'candy',
    pageBg: 'linear-gradient(160deg, #FFEAF4 0%, #FCE6FF 50%, #F0E7FF 100%)',
    accent: '#EC1E79',
    accentSoft: '#FFCEE4',
    onAccent: '#FFFFFF',
    heroInk: '#3A0F2B',
    ringColor: '#F368A9',
    cardBg: 'rgba(255,255,255,0.82)',
    cardBorder: 'rgba(236,30,121,0.16)',
    ctaShadow: '0 14px 30px -12px rgba(236,30,121,0.65)',
    confetti: ['#EC1E79', '#F368A9', '#B15CFF', '#FFC64D', '#FFFFFF'],
  },
  sunset: {
    id: 'sunset',
    pageBg: 'linear-gradient(160deg, #FFEFDD 0%, #FFDCE1 52%, #FFDDF0 100%)',
    accent: '#F03E5C',
    accentSoft: '#FFD1CE',
    onAccent: '#FFFFFF',
    heroInk: '#41161C',
    ringColor: '#FF7A6B',
    cardBg: 'rgba(255,255,255,0.84)',
    cardBorder: 'rgba(240,62,92,0.16)',
    ctaShadow: '0 14px 30px -12px rgba(240,62,92,0.6)',
    confetti: ['#F03E5C', '#FF8A3D', '#FFC24D', '#FF6FA0', '#FFFFFF'],
  },
  ocean: {
    id: 'ocean',
    pageBg: 'linear-gradient(160deg, #DFF4FF 0%, #E1F7EF 100%)',
    accent: '#0286C7',
    accentSoft: '#BFE7F7',
    onAccent: '#FFFFFF',
    heroInk: '#0B2C3A',
    ringColor: '#33B3E6',
    cardBg: 'rgba(255,255,255,0.86)',
    cardBorder: 'rgba(2,134,199,0.16)',
    ctaShadow: '0 14px 30px -12px rgba(2,134,199,0.55)',
    confetti: ['#0286C7', '#33B3E6', '#22C79E', '#8ED9FF', '#FFFFFF'],
  },
  grape: {
    id: 'grape',
    pageBg: 'linear-gradient(160deg, #F0E9FF 0%, #F6E4FF 100%)',
    accent: '#7C3AED',
    accentSoft: '#DDCEFF',
    onAccent: '#FFFFFF',
    heroInk: '#2C1150',
    ringColor: '#A56BFF',
    cardBg: 'rgba(255,255,255,0.85)',
    cardBorder: 'rgba(124,58,237,0.16)',
    ctaShadow: '0 14px 30px -12px rgba(124,58,237,0.6)',
    confetti: ['#7C3AED', '#A56BFF', '#EC4899', '#38BDF8', '#FFFFFF'],
  },
  tangerine: {
    id: 'tangerine',
    pageBg: 'linear-gradient(160deg, #FFEFD8 0%, #FFDEC8 100%)',
    accent: '#E8590C',
    accentSoft: '#FFD6BB',
    onAccent: '#FFFFFF',
    heroInk: '#40200A',
    ringColor: '#FF8A3D',
    cardBg: 'rgba(255,255,255,0.86)',
    cardBorder: 'rgba(232,89,12,0.16)',
    ctaShadow: '0 14px 30px -12px rgba(232,89,12,0.6)',
    confetti: ['#E8590C', '#FF8A3D', '#FFC24D', '#FF5A87', '#FFFFFF'],
  },
};

// 테마 id + 대표색 → 렌더에 쓸 PageTheme.
// minimal은 대표색에서 파스텔을 파생(기존 동작 유지), 프리셋은 고정 팔레트.
export function getPageTheme(themeId: string | null | undefined, color: string): PageTheme {
  const id = themeId && THEME_MAP[themeId] ? themeId : 'minimal';
  if (id !== 'minimal') return PRESET_THEMES[id];

  const p = derivePalette(color || DEFAULT_MINIMAL_COLOR);
  return {
    id: 'minimal',
    pageBg: '#F7F6F3',
    accent: color || DEFAULT_MINIMAL_COLOR,
    accentSoft: p.soft,
    onAccent: '#FFFFFF',
    heroInk: '#1B1B1F',
    ringColor: `${color || DEFAULT_MINIMAL_COLOR}77`,
    cardBg: '#FFFFFF',
    cardBorder: '#E5E5EA',
    ctaShadow: `0 10px 24px -10px ${color || DEFAULT_MINIMAL_COLOR}`,
    confetti: [color || DEFAULT_MINIMAL_COLOR, '#FFB84D', '#5AA9FF', '#1B1B1F'],
  };
}
