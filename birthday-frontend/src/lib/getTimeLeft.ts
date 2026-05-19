// 친구 생년월일에서 다음 생일까지 남은 시간 계산. 오늘이 생일이면 isPast=true.

export interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
  target: number;
}

export function getTimeLeft(birthdayISO: string | undefined | null): TimeLeft {
  if (!birthdayISO) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, target: 0 };
  }
  const parts = birthdayISO.split('-').map((n) => parseInt(n, 10));
  if (parts.length !== 3) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, target: 0 };
  }
  const [, m, d] = parts;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const thisYearBday = new Date(now.getFullYear(), m - 1, d).getTime();
  const isToday = todayStart === thisYearBday;

  // 올해 생일이 이미 지났으면 내년으로
  let target = new Date(now.getFullYear(), m - 1, d, 0, 0, 0).getTime();
  if (target < todayStart) {
    target = new Date(now.getFullYear() + 1, m - 1, d, 0, 0, 0).getTime();
  }

  const diff = Math.max(0, target - now.getTime());
  return {
    days:    Math.floor(diff / 86_400_000),
    hours:   Math.floor((diff % 86_400_000) / 3_600_000),
    minutes: Math.floor((diff % 3_600_000) / 60_000),
    seconds: Math.floor((diff % 60_000) / 1000),
    isPast:  isToday,
    target,
  };
}
