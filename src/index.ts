import { banks } from './banks';
import type { Bank, BankType } from './types';

export { banks } from './banks';
export { BANK_TYPES } from './types';
export type { Bank, BankType } from './types';

/* -------------------------------------------------------------------------- */
/*                              Hằng số tiện dụng                             */
/* -------------------------------------------------------------------------- */

/**
 * Bản đồ tra cứu nhanh `brandName -> Bank`.
 * @example BANKS_BY_BRAND['Vietcombank'].swift // 'BFTVVNVX'
 */
export const BANKS_BY_BRAND: Readonly<Record<string, Bank>> = Object.freeze(
  banks.reduce<Record<string, Bank>>((acc, bank) => {
    acc[bank.brandName] = bank;
    return acc;
  }, {})
);

/**
 * Bản đồ tra cứu nhanh `swift -> Bank` (chỉ gồm các bank có SWIFT).
 */
export const BANKS_BY_SWIFT: Readonly<Record<string, Bank>> = Object.freeze(
  banks.reduce<Record<string, Bank>>((acc, bank) => {
    if (bank.swift) acc[bank.swift.toUpperCase()] = bank;
    return acc;
  }, {})
);

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

/**
 * Lấy ngân hàng theo tên thương hiệu (không phân biệt hoa thường).
 * @example getBankByBrand('vietcombank')
 */
export function getBankByBrand(brandName: string): Bank | undefined {
  const key = brandName.trim().toLowerCase();
  return banks.find((b) => b.brandName.toLowerCase() === key);
}

/**
 * Lấy ngân hàng theo mã SWIFT/BIC (không phân biệt hoa thường).
 * @example getBankBySwift('BFTVVNVX')
 */
export function getBankBySwift(swift: string): Bank | undefined {
  return BANKS_BY_SWIFT[swift.trim().toUpperCase()];
}

/**
 * Lấy ngân hàng theo website (tự động bỏ `http(s)://`, `/` cuối).
 */
export function getBankByWebsite(website: string): Bank | undefined {
  const normalized = website
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, '')
    .replace(/\/+$/, '');
  return banks.find((b) => b.website.toLowerCase() === normalized);
}

/**
 * Lọc ngân hàng theo loại hình.
 */
export function getBanksByType(type: BankType): Bank[] {
  return banks.filter((b) => b.type === type);
}

/**
 * Tìm kiếm ngân hàng theo từ khoá (brandName, fullName, fullNameEn, swift, website).
 */
export function searchBanks(keyword: string): Bank[] {
  const q = keyword.trim().toLowerCase();
  if (!q) return [...banks];
  return banks.filter(
    (b) =>
      b.brandName.toLowerCase().includes(q) ||
      b.fullName.toLowerCase().includes(q) ||
      b.fullNameEn.toLowerCase().includes(q) ||
      (b.swift ?? '').toLowerCase().includes(q) ||
      b.website.toLowerCase().includes(q)
  );
}

/**
 * Trả về danh sách brand name của tất cả ngân hàng.
 */
export function getAllBrandNames(): string[] {
  return banks.map((b) => b.brandName);
}

/**
 * Trả về danh sách mã SWIFT hiện có.
 */
export function getAllSwifts(): string[] {
  return banks
    .map((b) => b.swift)
    .filter((s): s is string => Boolean(s));
}

/**
 * Nhóm ngân hàng theo loại hình.
 */
export function groupBanksByType(): Record<BankType, Bank[]> {
  return banks.reduce<Record<string, Bank[]>>((acc, bank) => {
    (acc[bank.type] ??= []).push(bank);
    return acc;
  }, {}) as Record<BankType, Bank[]>;
}

/**
 * Đếm số lượng ngân hàng.
 */
export function countBanks(): number {
  return banks.length;
}

/* -------------------------------------------------------------------------- */
/*                             BankBrand autocomplete                          */
/* -------------------------------------------------------------------------- */

/**
 * Hằng số brand name — dùng để code có autocomplete và tránh typo.
 * @example BankBrand.Vietcombank // 'Vietcombank'
 */
export const BankBrand = {
  Vietcombank: 'Vietcombank',
  MBBANK: 'MBBANK',
  VPBank: 'VPBank',
  VietinBank: 'VietinBank',
  Techcombank: 'Techcombank',
  BIDV: 'BIDV',
  Agribank: 'Agribank',
  ACB: 'ACB',
  HDBank: 'HDBank',
  SHB: 'SHB',
  VIB: 'VIB',
  MSB: 'MSB',
  LPBank: 'LPBank',
  SeABank: 'SeABank',
  TPBank: 'TPBank',
  OCB: 'OCB',
  VBSP: 'VBSP',
  NCB: 'NCB',
  Sacombank: 'Sacombank',
  Eximbank: 'Eximbank',
  NamABank: 'Nam A Bank',
  SCB: 'SCB',
  VDB: 'VDB',
  Woori: 'Woori',
  Vietbank: 'Vietbank',
  BacABank: 'Bac A Bank',
  ABBANK: 'ABBANK',
  UOB: 'UOB',
  PVcomBank: 'PVcomBank',
  VietABank: 'VietABank',
  HSBC: 'HSBC',
  PBVN: 'PBVN',
  SCBVL: 'SCBVL',
  PGBank: 'PGBank',
  BVBank: 'BVBank',
  Kienlongbank: 'Kienlongbank',
  SHBVN: 'SHBVN',
  ANZVL: 'ANZVL',
  CIMB: 'CIMB',
  SAIGONBANK: 'SAIGONBANK',
  HLBVN: 'HLBVN',
  IVB: 'IVB',
  BAOVIETBank: 'BAOVIET Bank',
  VRB: 'VRB',
  CoopBank: 'Co-opBank',
  GPBank: 'GPBank',
  VCBNeo: 'VCBNeo',
  VikkiBank: 'Vikki Bank',
  MBV: 'MBV',
} as const;

export type BankBrandName = (typeof BankBrand)[keyof typeof BankBrand];

/* -------------------------------------------------------------------------- */
/*                                Default export                              */
/* -------------------------------------------------------------------------- */

export default banks;