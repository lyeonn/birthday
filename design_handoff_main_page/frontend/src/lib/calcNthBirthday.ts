// frontend/src/lib/calcNthBirthday.ts
// 친구의 생년월일(YYYY-MM-DD)에서 다가오는 생일이 N번째인지 자동 계산.
// 너무 최근 연도(=출생연도가 아니라 이번 생일 날짜만 입력한 경우)는 null.

export function calcNthBirthday(birthdayISO: string | undefined | null): number | null {
  if (!birthdayISO) return null;
  const parts = birthdayISO.split('-').map((n) => parseInt(n, 10));
  if (parts.length !== 3) return null;
  const [y, m, d] = parts;
  if (!y || !m || !d) return null;
  if (y > 2015) return null; // 출생연도가 아닐 가능성 — UI에서 안내 비표시

  const today = new Date();
  const ageNow = today.getFullYear() - y;
  const passed =
    today.getMonth() + 1 > m ||
    (today.getMonth() + 1 === m && today.getDate() >= d);
  // 다가오는 생일이 N번째 → 올해 생일 이미 지났으면 +1, 아직이면 그대로
  return passed ? ageNow + 1 : ageNow;
}
