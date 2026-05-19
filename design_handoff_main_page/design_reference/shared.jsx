// shared.jsx — 공통 유틸 + 컨텍스트
// 분위기 옵션, 카운트다운 스타일, 메시지 레이아웃 등 모든 토글의 단일 출처.

const VIBES = {
  sweet: {
    label: 'Sweet Pop',
    desc: '귀엽고 발랄',
    bg: 'linear-gradient(180deg, #FFF1F6 0%, #FFE8D9 100%)',
    surface: '#FFFFFF',
    ink: '#3D1F2C',
    accent: '#FF6B9D',
    cardRadius: 28,
    cardShadow: '0 14px 40px -18px rgba(255,107,157,0.5)',
    fontDisplay: "'Bricolage Grotesque', 'Pretendard', sans-serif",
    chip: '#FFD6E5',
    chipInk: '#9C2A55',
  },
  minimal: {
    label: 'Modern Minimal',
    desc: '모던 · 미니멀',
    bg: '#FAFAF7',
    surface: '#FFFFFF',
    ink: '#0F0F0F',
    accent: '#FF6B9D',
    cardRadius: 12,
    cardShadow: '0 1px 0 rgba(0,0,0,0.04)',
    fontDisplay: "'Bricolage Grotesque', 'Pretendard', sans-serif",
    chip: '#F0EFEC',
    chipInk: '#0F0F0F',
  },
  y2k: {
    label: 'Y2K Retro',
    desc: '90~00년대 감성',
    bg: 'linear-gradient(135deg, #FFE0F5 0%, #DFE9FF 50%, #FFF6CC 100%)',
    surface: '#FFFFFF',
    ink: '#1B0A47',
    accent: '#FF3DAA',
    cardRadius: 18,
    cardShadow: '4px 4px 0 #1B0A47',
    fontDisplay: "'Bricolage Grotesque', 'Pretendard', sans-serif",
    chip: '#A78BFA',
    chipInk: '#1B0A47',
    border: '2px solid #1B0A47',
  },
  film: {
    label: 'Film / Polaroid',
    desc: '빈티지 · 필름',
    bg: '#EDE6DA',
    surface: '#FBF5E9',
    ink: '#2A211A',
    accent: '#C9514E',
    cardRadius: 4,
    cardShadow: '0 6px 18px rgba(42,33,26,0.18)',
    fontDisplay: "'Caveat', 'Pretendard', cursive",
    chip: '#E0D3B8',
    chipInk: '#2A211A',
  },
};

// 색상 옵션 (생성 페이지에서 선택)
const COLOR_OPTIONS = [
  { name: 'Pink', hex: '#FF6B9D', soft: '#FFD6E5' },
  { name: 'Coral', hex: '#FF7A59', soft: '#FFD9CB' },
  { name: 'Orange', hex: '#FFB84D', soft: '#FFE7C2' },
  { name: 'Mint', hex: '#3DD9B0', soft: '#C2F1E2' },
  { name: 'Sky', hex: '#5AA9FF', soft: '#CFE3FF' },
  { name: 'Purple', hex: '#7C5CFF', soft: '#DCD2FF' },
  { name: 'Cherry', hex: '#FF4760', soft: '#FFD0D6' },
  { name: 'Black', hex: '#1A1416', soft: '#E5E2E2' },
];

// 카운트다운 스타일
const COUNTDOWN_STYLES = ['digital', 'flip', 'morph'];

// 메시지 보기 레이아웃
const MESSAGE_LAYOUTS = ['cards', 'rolling', 'stack', 'timeline'];

// 친구 정보 (모킹 데이터) — birthday는 출생연도 기반 (N번째 자동계산용)
const DEFAULT_FRIEND = {
  name: '지수',
  birthday: '2001-05-08', // 25번째 생일 자동 계산
  photoLabel: '대표사진',
  greeting: '지수의 25번째 생일을\n다 같이 축하해요',
  hostName: '민지',
};

// 모킹 메시지
const SAMPLE_MESSAGES = [
  { id: 1, name: '민지', cardColor: '#FFD6E5', text: '지수야 생일 진짜 진짜 축하해!! 우리 만난지 벌써 7년째라니… 매년 너랑 케이크 자르는 게 너무 행복해. 올해도 좋은 일만 가득하길 ☺️', time: '2시간 전' },
  { id: 2, name: '준호', cardColor: '#CFE3FF', text: '생일 축하한다 친구야. 항상 응원해!', time: '5시간 전', hasPhoto: true },
  { id: 3, name: '서연', cardColor: '#FFE7C2', text: '지수야 생일축하해!!!!! 너 만나서 진짜 행운이야. 이번 주말에 케이크 사줄게 🎂', time: '어제' },
  { id: 4, name: '하늘', cardColor: '#DCD2FF', text: '지수쓰 생일축하 🎉 올해도 건강하고 행복하자~ 같이 먹은 떡볶이 또 먹으러 가자', time: '어제' },
  { id: 5, name: '도윤', cardColor: '#C2F1E2', text: '생일 축하해 😎', time: '2일 전' },
  { id: 6, name: '예린', cardColor: '#FFD0D6', text: '내 가장 친한 친구 지수야. 생일 너무너무 축하해! 너랑 같이 보내는 모든 순간이 소중해. 사랑해 ❤️', time: '2일 전', hasPhoto: true },
  { id: 7, name: '수아', cardColor: '#FFD6E5', text: '지수야 생축~ 🥳 올해 회사에서 너 만난 게 베스트 ㅋㅋ', time: '3일 전' },
  { id: 8, name: '재현', cardColor: '#E5E2E2', text: '생일 축하해 누나 🙇‍♂️ 항상 챙겨줘서 고마워요', time: '3일 전' },
];

// 타임 유틸 — birthday(출생연도)에서 가장 가까운 다음 생일 시점까지 카운트
function getTimeLeft(birthdayISO) {
  if (!birthdayISO) return { days:0, hours:0, minutes:0, seconds:0, isPast:false, target:0 };
  const [, m, d] = birthdayISO.split('-').map(n => parseInt(n, 10));
  const now = new Date();
  // 올해 생일
  let target = new Date(now.getFullYear(), m - 1, d, 0, 0, 0).getTime();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  // isPast: 오늘이 생일 당일인 경우만 true
  const isToday = todayStart === new Date(now.getFullYear(), m - 1, d).getTime();
  if (target < todayStart) {
    // 이미 지났으면 내년 생일
    target = new Date(now.getFullYear() + 1, m - 1, d, 0, 0, 0).getTime();
  }
  const diff = Math.max(0, target - now.getTime());
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  return { days, hours, minutes, seconds, isPast: isToday, target };
}

function pad2(n) { return String(n).padStart(2, '0'); }

// 생일 날짜에서 "N번째 생일" 자동 계산. 출생연도 입력이 있을 때만.
// 생일 ISO가 'YYYY-MM-DD'이고 YYYY가 출생연도면 만나이로 N번째 산출.
function getNthBirthday(birthdayISO) {
  if (!birthdayISO) return null;
  const [y, m, d] = birthdayISO.split('-').map(n => parseInt(n, 10));
  if (!y || y > 2010 + 5) return null; // 너무 최근이면 출생연도 아님 (이번 생일 날짜 입력)
  const today = new Date();
  let age = today.getFullYear() - y;
  const hasPassed = (today.getMonth() + 1 > m) || (today.getMonth() + 1 === m && today.getDate() >= d);
  // 다가오는 생일이 N번째 → 이미 지났으면 +1, 안지났으면 그대로
  return hasPassed ? age + 1 : age;
}

// 색상 → 자동 파생 팔레트 (OKLCH 기반, A안)
// 입력: hex (#RRGGBB). 출력: 배경/카드/액센트/보더/잉크/소프트
function derivePalette(hex) {
  const { r, g, b } = hexToRgb(hex);
  const { L, C, h } = rgbToOklch(r, g, b);
  // 색의 채도가 낮으면(중성) 무채색 톤으로 fallback
  const isMono = C < 0.04;
  return {
    accent: hex,
    softBg: oklchToCss(0.97, isMono ? 0.005 : Math.min(C * 0.18, 0.025), h), // 페이지 배경 (오프화이트 + 살짝 색조)
    surface: oklchToCss(0.99, isMono ? 0.003 : Math.min(C * 0.08, 0.012), h), // 카드
    soft: oklchToCss(0.92, isMono ? 0.01 : Math.min(C * 0.4, 0.06), h),     // 칩/태그 배경
    border: oklchToCss(0.88, isMono ? 0.01 : Math.min(C * 0.3, 0.04), h),
    ink: oklchToCss(0.18, isMono ? 0 : 0.02, h),
    accentDark: oklchToCss(Math.max(L - 0.18, 0.35), C, h), // 진한 액센트 (호버/active)
    chip: oklchToCss(0.95, isMono ? 0.01 : Math.min(C * 0.3, 0.05), h),
    chipInk: oklchToCss(0.32, isMono ? 0.01 : C * 0.7, h),
  };
}

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const v = h.length === 3
    ? h.split('').map(c => parseInt(c + c, 16))
    : [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
  return { r: v[0]/255, g: v[1]/255, b: v[2]/255 };
}

// sRGB → Linear → OKLab → OKLCH (간단 버전)
function rgbToOklch(r, g, b) {
  const lin = c => c <= 0.04045 ? c/12.92 : Math.pow((c + 0.055)/1.055, 2.4);
  const lr = lin(r), lg = lin(g), lb = lin(b);
  const l = Math.cbrt(0.4122214708*lr + 0.5363325363*lg + 0.0514459929*lb);
  const m = Math.cbrt(0.2119034982*lr + 0.6806995451*lg + 0.1073969566*lb);
  const s = Math.cbrt(0.0883024619*lr + 0.2817188376*lg + 0.6299787005*lb);
  const L = 0.2104542553*l + 0.7936177850*m - 0.0040720468*s;
  const a = 1.9779984951*l - 2.4285922050*m + 0.4505937099*s;
  const b2 = 0.0259040371*l + 0.7827717662*m - 0.8086757660*s;
  const C = Math.sqrt(a*a + b2*b2);
  let h = Math.atan2(b2, a) * 180 / Math.PI;
  if (h < 0) h += 360;
  return { L, C, h };
}
function oklchToCss(L, C, h) {
  return `oklch(${(L*100).toFixed(2)}% ${C.toFixed(4)} ${h.toFixed(2)})`;
}

// Unique 4-letter+digit 코드 생성 (B + 5자리)
function generateInviteCode(seed) {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 0/O/1/I 제외
  let s = '';
  let n = (seed || Date.now()) >>> 0;
  for (let i = 0; i < 6; i++) {
    s += chars[n % chars.length];
    n = Math.floor(n / chars.length) + (i+1) * 17;
  }
  return s;
}

// 픽셀 사진 플레이스홀더 (실제 사진 대신)
function PhotoPlaceholder({ label = '사진', size = '100%', radius = 16, vibe = 'sweet', tint }) {
  const v = VIBES[vibe];
  const color = tint || v.accent;
  return (
    <div style={{
      width: size, height: size, borderRadius: radius,
      background: `repeating-linear-gradient(45deg, ${color}22, ${color}22 8px, ${color}11 8px, ${color}11 16px)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: v.ink, fontFamily: 'var(--font-mono)', fontSize: 11,
      letterSpacing: '0.05em', textTransform: 'uppercase',
      border: `1px dashed ${color}66`,
      flexShrink: 0,
    }}>
      {label}
    </div>
  );
}

// 작은 아이콘들
const Icons = {
  Lock: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><rect x="4" y="11" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M8 11V8a4 4 0 018 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>,
  Heart: (p) => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M12 21s-7-4.5-9-9.5C1.5 7 5 4 8 4c2 0 3.5 1 4 2.5C12.5 5 14 4 16 4c3 0 6.5 3 5 7.5-2 5-9 9.5-9 9.5z" fill="currentColor"/></svg>,
  Photo: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.8"/><circle cx="9" cy="11" r="2" stroke="currentColor" strokeWidth="1.8"/><path d="M3 17l5-5 5 5 3-3 5 5" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Pen: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M14 4l6 6L8 22H2v-6L14 4z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/></svg>,
  Music: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 18V5l11-2v13" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/><circle cx="17" cy="16" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  MusicOff: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M9 18V5l11-2v13M3 3l18 18" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  Share: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><circle cx="6" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="6" r="2.5" stroke="currentColor" strokeWidth="1.8"/><circle cx="18" cy="18" r="2.5" stroke="currentColor" strokeWidth="1.8"/><path d="M8 11l8-4M8 13l8 4" stroke="currentColor" strokeWidth="1.8"/></svg>,
  Back: (p) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" {...p}><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Plus: (p) => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
  Check: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  More: (p) => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/></svg>,
  Trash: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  Eye: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>,
  Copy: (p) => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" {...p}><rect x="8" y="8" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.8"/><path d="M16 8V6a2 2 0 00-2-2H6a2 2 0 00-2 2v8a2 2 0 002 2h2" stroke="currentColor" strokeWidth="1.8"/></svg>,
};

// 컨페티 (CSS-only)
function Confetti({ count = 60, palette }) {
  const colors = palette || ['#FF6B9D','#FFB84D','#5AA9FF','#7C5CFF','#3DD9B0','#FF4760'];
  const pieces = React.useMemo(() => Array.from({length: count}, (_,i) => ({
    left: Math.random()*100,
    delay: Math.random()*2,
    duration: 2.5 + Math.random()*2.5,
    color: colors[i % colors.length],
    rot: Math.random()*360,
    size: 6 + Math.random()*8,
  })), [count]);
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {pieces.map((p,i)=>(
        <span key={i} className="confetti-piece" style={{
          left: p.left+'%',
          background: p.color,
          width: p.size, height: p.size*1.4,
          animationDuration: p.duration+'s',
          animationDelay: p.delay+'s',
          transform: `rotate(${p.rot}deg)`,
        }}/>
      ))}
    </div>
  );
}

Object.assign(window, {
  VIBES, COLOR_OPTIONS, COUNTDOWN_STYLES, MESSAGE_LAYOUTS,
  DEFAULT_FRIEND, SAMPLE_MESSAGES,
  getTimeLeft, pad2, getNthBirthday, derivePalette, generateInviteCode,
  PhotoPlaceholder, Icons, Confetti,
});
