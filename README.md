# 🇻🇳 vietnam-banks

Danh sách **đầy đủ và cập nhật** các ngân hàng đang hoạt động tại Việt Nam — hỗ trợ TypeScript, tìm kiếm linh hoạt, không phụ thuộc runtime.

## ✨ Tính năng

- 📋 Danh sách ~50 ngân hàng: TMCP, Nhà nước, Chính sách, 100% vốn nước ngoài, Liên doanh, Hợp tác xã, TNHH MTV
- 🔎 Tra cứu theo `brandName`, `swift`, `website`, `type`
- 🔤 Tìm kiếm full-text (Việt + Anh)
- 🧊 Dữ liệu `readonly` — không bị mutate
- 🌳 Hỗ trợ ESM + CJS + TypeScript types
- 🪶 Zero runtime dependencies

## 📦 Cài đặt

```bash
npm install vietnam-banks
# hoặc
yarn add vietnam-banks
# hoặc
pnpm add vietnam-banks
```

## 🚀 Sử dụng

### Import cơ bản

```ts
import { banks, BankBrand, getBankByBrand, getBankBySwift } from 'vietnam-banks';

// Tra cứu theo brand
const vcb = getBankByBrand(BankBrand.Vietcombank);
console.log(vcb?.swift); // 'BFTVVNVX'

// Tra cứu theo SWIFT
const tech = getBankBySwift('VTCBVNVX');
console.log(tech?.fullName);
// 'Ngân hàng TMCP Kỹ Thương'

// Lấy toàn bộ
console.log(banks.length);
```

### Tìm kiếm

```ts
import { searchBanks, getBanksByType } from 'vietnam-banks';

searchBanks('sài gòn'); // [Sacombank, SCB, SAIGONBANK, ...]
searchBanks('SCB');     // [SCB, SCBVL, ...]

getBanksByType('100% vốn nước ngoài');
// [Woori, UOB, HSBC, PBVN, SCBVL, SHBVN, ANZVL, CIMB, HLBVN]
```

### Nhóm theo loại hình

```ts
import { groupBanksByType } from 'vietnam-banks';

const grouped = groupBanksByType();
console.log(grouped['Thương mại Cổ phần'].map(b => b.brandName));
```

### CommonJS

```js
const { banks, getBankBySwift } = require('vietnam-banks');
```

## 📐 Kiểu dữ liệu

```ts
interface Bank {
  brandName: string;        // "Vietcombank"
  fullName: string;         // "Ngân hàng TMCP Ngoại Thương Việt Nam"
  fullNameEn: string;       // "Joint Stock Commercial Bank for..."
  type: BankType;           // "Thương mại Cổ phần"
  swift: string | null;     // "BFTVVNVX"
  website: string;          // "vietcombank.com.vn"
  establishedDate: string;  // "1963-04-01"
}
```

## 🧩 API

| Hàm | Mô tả |
|-----|-------|
| `getBankByBrand(name)` | Tìm theo brand name |
| `getBankBySwift(code)` | Tìm theo mã SWIFT/BIC |
| `getBankByWebsite(url)` | Tìm theo website |
| `getBanksByType(type)` | Lọc theo loại hình |
| `searchBanks(keyword)` | Tìm kiếm đa trường |
| `groupBanksByType()` | Nhóm theo loại hình |
| `getAllBrandNames()` | Danh sách brand name |
| `getAllSwifts()` | Danh sách SWIFT |
| `countBanks()` | Tổng số ngân hàng |

| Hằng số | Mô tả |
|---------|-------|
| `banks` | Mảng readonly toàn bộ ngân hàng |
| `BANKS_BY_BRAND` | Map `brandName → Bank` |
| `BANKS_BY_SWIFT` | Map `swift → Bank` |
| `BankBrand` | Enum brand name (autocomplete) |
| `BANK_TYPES` | Danh sách loại hình |

## 🤝 Đóng góp

Pull request thêm/sửa ngân hàng luôn được chào đón. Vui lòng tuân theo format trong `src/banks.ts`.

## 📜 License

MIT