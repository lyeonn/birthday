// 입력: hex (#RRGGBB). 출력: 배경/카드/액센트/보더/잉크/소프트 — 모두 oklch() CSS 함수 문자열.

export interface Palette {
  accent: string;
  softBg: string;
  surface: string;
  soft: string;
  border: string;
  ink: string;
  accentDark: string;
  chip: string;
  chipInk: string;
}

export function derivePalette(hex: string): Palette {
  const { r, g, b } = hexToRgb(hex);
  const { L, C, h } = rgbToOklch(r, g, b);
  const isMono = C < 0.04;

  return {
    accent: hex,
    softBg:     oklchToCss(0.97, isMono ? 0.005 : Math.min(C * 0.18, 0.025), h),
    surface:    oklchToCss(0.99, isMono ? 0.003 : Math.min(C * 0.08, 0.012), h),
    soft:       oklchToCss(0.92, isMono ? 0.01  : Math.min(C * 0.4, 0.06),  h),
    border:     oklchToCss(0.88, isMono ? 0.01  : Math.min(C * 0.3, 0.04),  h),
    ink:        oklchToCss(0.18, isMono ? 0     : 0.02,                     h),
    accentDark: oklchToCss(Math.max(L - 0.18, 0.35), C,                     h),
    chip:       oklchToCss(0.95, isMono ? 0.01  : Math.min(C * 0.3, 0.05),  h),
    chipInk:    oklchToCss(0.32, isMono ? 0.01  : C * 0.7,                  h),
  };
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const h = hex.replace('#', '');
  const v = h.length === 3
    ? h.split('').map((c) => parseInt(c + c, 16))
    : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  return { r: v[0] / 255, g: v[1] / 255, b: v[2] / 255 };
}

// sRGB → Linear → OKLab → OKLCH
function rgbToOklch(r: number, g: number, b: number): { L: number; C: number; h: number } {
  const lin = (c: number) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
  const lr = lin(r), lg = lin(g), lb = lin(b);
  const l = Math.cbrt(0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb);
  const m = Math.cbrt(0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb);
  const s = Math.cbrt(0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb);
  const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
  const b2 = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
  const C = Math.sqrt(a * a + b2 * b2);
  let h = (Math.atan2(b2, a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}

function oklchToCss(L: number, C: number, h: number): string {
  return `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${h.toFixed(2)})`;
}
