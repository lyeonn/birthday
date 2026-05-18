// 마법사 폼의 zod 스키마 — react-hook-form `resolver`에 직접 사용.

import { z } from 'zod';

export const createPageSchema = z.object({
  friendName: z
    .string()
    .min(1, '이름을 입력해주세요')
    .max(20, '20자 이내로 입력해주세요'),
  birthday: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '올바른 날짜 형식이 아니에요'),
  greeting: z
    .string()
    .min(2, '2자 이상 입력해주세요')
    .max(60, '60자 이내로 입력해주세요'),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, '올바른 색상 코드가 아니에요'),
  // 사진은 클라이언트에서 File로 받고, 업로드 후 photoUrl로 변환해서 백엔드에 전달
  photoUrl: z.string().optional(),
});

export type CreatePageInput = z.infer<typeof createPageSchema>;

// 단계별 검증에 쓸 필드 키 묶음
export const STEP_FIELDS = [
  ['friendName', 'birthday'],
  ['greeting'],
  ['color'],
  [],
] as const satisfies ReadonlyArray<ReadonlyArray<keyof CreatePageInput>>;

// 프리셋 컬러 8종
export const COLOR_OPTIONS = [
  { name: 'Pink',   hex: '#FF6B9D' },
  { name: 'Coral',  hex: '#FF7A59' },
  { name: 'Orange', hex: '#FFB84D' },
  { name: 'Mint',   hex: '#3DD9B0' },
  { name: 'Sky',    hex: '#5AA9FF' },
  { name: 'Purple', hex: '#7C5CFF' },
  { name: 'Cherry', hex: '#FF4760' },
  { name: 'Black',  hex: '#1A1416' },
] as const;
