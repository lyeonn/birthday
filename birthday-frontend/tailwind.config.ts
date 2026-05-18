import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1B1B1F',
        sub: '#6E6E73',
        line: '#E5E5EA',
        bg: '#F7F6F3',
        surface: '#FFFFFF',
        muted: '#F2F1ED',
        success: { bg: '#F0FDF4', border: '#BBF7D0', ink: '#166534' },
        kakao: { DEFAULT: '#FEE500', ink: '#3C1E1E' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Pretendard', 'sans-serif'],
        body: ['Pretendard', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      borderRadius: {
        field: '14px',
        cta: '16px',
        chip: '999px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'confetti-fall': {
          '0%': { transform: 'translateY(-20px) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0.6' },
        },
      },
      animation: {
        'fade-up': 'fade-up .3s ease-out',
        'spin-slow': 'spin 30s linear infinite',
      },
    },
  },
  plugins: [],
};
export default config;
