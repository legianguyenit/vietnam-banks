import { banks } from './banks';
import type { Bank, BankType } from './types';

export { banks } from './banks';
export { BANK_TYPES } from './types';
export type { Bank, BankType } from './types';

/* -------------------------------------------------------------------------- */
/*                              Internal helpers                               */
/* -------------------------------------------------------------------------- */

/**
 * Chuẩn hoá chuỗi: lowercase + bỏ dấu tiếng Việt.
 * Ví dụ: "Ngoại Thương" → "ngoai thuong"
 */
function removeDiacritics(str: string): string {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

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

/**
 * Bản đồ tra cứu nhanh `type -> Bank[]` (precomputed).
 * @example BANKS_BY_TYPE['Thương mại Cổ phần'] // [...]
 */
export const BANKS_BY_TYPE: Readonly<Record<BankType, Bank[]>> = Object.freeze(
  banks.reduce<Record<string, Bank[]>>((acc, bank) => {
    (acc[bank.type] ??= []).push(bank);
    return acc;
  }, {}) as Record<BankType, Bank[]>
);

/**
 * Index tìm kiếm không dấu — precomputed một lần khi load module.
 * Mỗi phần tử tương ứng với banks[i].
 */
const _searchIndex: string[] = banks.map((b) =>
  [
    b.brandName,
    b.fullName,
    b.fullNameEn,
    b.swift ?? '',
    b.website,
  ]
    .map(removeDiacritics)
    .join(' ')
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
  return BANKS_BY_TYPE[type] ?? [];
}

/**
 * Tìm kiếm ngân hàng theo từ khoá.
 * Hỗ trợ tìm **không dấu** ("ngoai thuong" → Vietcombank).
 * Tìm trên: brandName, fullName, fullNameEn, swift, website.
 * @example searchBanks('ngoai thuong') // [Vietcombank]
 * @example searchBanks('quan doi')     // [MBBANK]
 */
export function searchBanks(keyword: string): Bank[] {
  const q = removeDiacritics(keyword.trim());
  if (!q) return [...banks];
  return banks.filter((_, i) => _searchIndex[i]?.includes(q) ?? false);
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

/* -------------------------------------------------------------------------- */
/*                              Tiện ích bổ sung                              */
/* -------------------------------------------------------------------------- */

/**
 * Lấy danh sách ngân hàng thành lập trong một năm cụ thể.
 * @example getBanksByEstablishedYear(1993) // [VPBank, Techcombank, ACB, ...]
 */
export function getBanksByEstablishedYear(year: number): Bank[] {
  const prefix = String(year);
  return banks.filter((b) => b.establishedDate.startsWith(prefix));
}

/** Các trường có thể dùng để sắp xếp ngân hàng. */
export type BankSortField = 'brandName' | 'fullName' | 'establishedDate';

/**
 * Trả về bản sao mảng bank đã sắp xếp theo trường chỉ định.
 * @param field  Trường sắp xếp: 'brandName' | 'fullName' | 'establishedDate'
 * @param direction 'asc' (mặc định) hoặc 'desc'
 * @example sortBanks('establishedDate', 'asc') // từ cũ nhất → mới nhất
 */
export function sortBanks(
  field: BankSortField = 'brandName',
  direction: 'asc' | 'desc' = 'asc'
): Bank[] {
  const dir = direction === 'asc' ? 1 : -1;
  return [...banks].sort((a, b) =>
    a[field] < b[field] ? -dir : a[field] > b[field] ? dir : 0
  );
}

/**
 * Kiểm tra mã SWIFT/BIC có hợp lệ theo chuẩn ISO 9362.
 * Format: 4 ký tự bank + 2 ký tự country + 2 ký tự location + (tuỳ chọn) 3 ký tự branch.
 * @example isValidSwift('BFTVVNVX')   // true
 * @example isValidSwift('INVALID')    // false
 */
export function isValidSwift(swift: string): boolean {
  // ISO 9362: [A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?
  return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(
    swift.trim().toUpperCase()
  );
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