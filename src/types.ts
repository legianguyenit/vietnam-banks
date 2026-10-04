/**
 * Các loại hình ngân hàng tại Việt Nam.
 */
export const BANK_TYPES = [
  'Thương mại Cổ phần',
  'Thương mại Nhà nước',
  'Ngân hàng chính sách',
  '100% vốn nước ngoài',
  'Ngân hàng Liên doanh',
  'NH Hợp tác xã',
  'TNHH MTV',
] as const;

export type BankType = (typeof BANK_TYPES)[number];

/**
 * Thông tin một ngân hàng tại Việt Nam.
 */
export interface Bank {
  /** Tên thương hiệu viết ngắn gọn, ví dụ: "Vietcombank" */
  readonly brandName: string;
  /** Tên đầy đủ bằng tiếng Việt */
  readonly fullName: string;
  /** Tên đầy đủ bằng tiếng Anh */
  readonly fullNameEn: string;
  /** Loại hình ngân hàng */
  readonly type: BankType;
  /** Mã SWIFT/BIC (null nếu không có) */
  readonly swift: string | null;
  /** Website chính thức (không bao gồm https://) */
  readonly website: string;
  /** Ngày thành lập theo định dạng ISO 8601 (YYYY-MM-DD) */
  readonly establishedDate: string;
}