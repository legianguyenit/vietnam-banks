<div align="center">

# 🇻🇳 vietnam-banks

**Danh sách ngân hàng Việt Nam đầy đủ & chính xác — với API tra cứu mạnh mẽ cho Node.js & TypeScript.**  
**Comprehensive Vietnam Banks dataset with flexible lookup APIs for Node.js & TypeScript.**

[![npm version](https://img.shields.io/npm/v/vietnam-banks?style=flat-square&color=cb3837)](https://www.npmjs.com/package/vietnam-banks)
[![npm downloads](https://img.shields.io/npm/dm/vietnam-banks?style=flat-square&color=cb3837)](https://www.npmjs.com/package/vietnam-banks)
[![license](https://img.shields.io/npm/l/vietnam-banks?style=flat-square&color=22c55e)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![ESM + CJS](https://img.shields.io/badge/Module-ESM%20%2B%20CJS-f59e0b?style=flat-square)](https://nodejs.org/)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-22c55e?style=flat-square)](#)

</div>

---

## 🌐 Ngôn ngữ / Language

- [🇻🇳 Tiếng Việt](#-tiếng-việt)
- [🇬🇧 English](#-english)

---

<a id="-tiếng-việt"></a>

## 🇻🇳 Tiếng Việt

`vietnam-banks` là thư viện **zero-dependency** cung cấp bộ dữ liệu đầy đủ và cập nhật nhất về các ngân hàng đang hoạt động tại Việt Nam, kèm theo các hàm tiện ích tra cứu tốc độ cao.

### ✨ Tính năng nổi bật

| | Tính năng |
|---|---|
| 📋 | **Dữ liệu đầy đủ** — 45+ ngân hàng: TMCP, Nhà nước, 100% vốn nước ngoài, Liên doanh, Hợp tác xã, TNHH MTV, Chính sách |
| 🔎 | **Tra cứu O(1)** — Map precomputed theo `brandName`, `SWIFT`, `type` |
| 🔤 | **Tìm kiếm không dấu** — `searchBanks('ngoai thuong')` → Vietcombank |
| 🧊 | **Bất biến** — Dữ liệu được `Object.freeze`, không thể mutate ngoài ý muốn |
| 📦 | **Dual Module** — ESM + CommonJS + TypeScript `.d.ts` |
| 🪶 | **Siêu nhẹ** — Zero runtime dependencies |

---

### 📦 Cài đặt

```bash
npm install vietnam-banks
# hoặc
yarn add vietnam-banks
# hoặc
pnpm add vietnam-banks
```

---

### 🚀 Hướng dẫn sử dụng

#### 1. Tra cứu ngân hàng

```typescript
import {
  getBankByBrand,
  getBankBySwift,
  getBankByWebsite,
  BankBrand,
} from 'vietnam-banks';

// Tra cứu bằng BankBrand (có autocomplete, tránh typo)
const vcb = getBankByBrand(BankBrand.Vietcombank);
console.log(vcb?.fullName);   // 'Ngân hàng TMCP Ngoại Thương Việt Nam'
console.log(vcb?.swift);      // 'BFTVVNVX'

// Tra cứu theo mã SWIFT/BIC (không phân biệt hoa thường)
const tcb = getBankBySwift('VTCBVNVX');
console.log(tcb?.brandName);  // 'Techcombank'

// Tra cứu theo website (tự động bỏ https://, www., trailing slash)
const acb = getBankByWebsite('https://acb.com.vn/');
console.log(acb?.brandName);  // 'ACB'
```

#### 2. Tìm kiếm & Lọc

```typescript
import { searchBanks, getBanksByType, BANKS_BY_TYPE } from 'vietnam-banks';

// Tìm kiếm KHÔNG DẤU — tính năng mới
searchBanks('ngoai thuong');  // → [Vietcombank]
searchBanks('quan doi');      // → [MBBANK]
searchBanks('sai gon');       // → [Sacombank, SCB, SAIGONBANK, ...]

// Tìm theo từ khoá tiếng Anh
searchBanks('Military');      // → [MBBANK]

// Lọc theo loại hình — O(1) precomputed
const foreignBanks = getBanksByType('100% vốn nước ngoài');
console.log(foreignBanks.map(b => b.brandName));
// ['Woori', 'UOB', 'HSBC', 'PBVN', 'SCBVL', 'SHBVN', 'ANZVL', 'CIMB', 'HLBVN']

// Truy cập trực tiếp map precomputed
const jointStockBanks = BANKS_BY_TYPE['Thương mại Cổ phần'];
```

#### 3. Sắp xếp & Lọc nâng cao

```typescript
import {
  sortBanks,
  getBanksByEstablishedYear,
  groupBanksByType,
  isValidSwift,
} from 'vietnam-banks';

// Sắp xếp theo ngày thành lập (cũ → mới)
const oldest = sortBanks('establishedDate', 'asc');
console.log(oldest[0].brandName); // 'SAIGONBANK' (1987)

// Sắp xếp theo tên thương hiệu (A → Z)
const alphabetical = sortBanks('brandName');

// Ngân hàng thành lập năm 1993
const banks1993 = getBanksByEstablishedYear(1993);
console.log(banks1993.map(b => b.brandName));
// ['VPBank', 'Techcombank', 'ACB', 'SHB', 'ABBANK', 'PGBank', 'GPBank']

// Gom nhóm tất cả ngân hàng theo loại hình
const grouped = groupBanksByType();
console.log(Object.keys(grouped));

// Validate mã SWIFT theo chuẩn ISO 9362
isValidSwift('BFTVVNVX');  // true
isValidSwift('INVALID');   // false
```

#### 4. Sử dụng với CommonJS

```javascript
const { banks, getBankByBrand, BankBrand } = require('vietnam-banks');

const bank = getBankByBrand(BankBrand.MBBANK);
console.log(bank.fullNameEn); // 'Military Commercial Joint Stock Bank'
```

---

### 📐 Cấu trúc dữ liệu

#### `Bank` Interface

```typescript
interface Bank {
  /** Tên thương hiệu ngắn gọn, vd: "Vietcombank" */
  readonly brandName: string;
  /** Tên đầy đủ tiếng Việt */
  readonly fullName: string;
  /** Tên đầy đủ tiếng Anh */
  readonly fullNameEn: string;
  /** Loại hình ngân hàng */
  readonly type: BankType;
  /** Mã SWIFT/BIC (null nếu không có) */
  readonly swift: string | null;
  /** Website chính thức (không bao gồm https://) */
  readonly website: string;
  /** Ngày thành lập — ISO 8601 (YYYY-MM-DD) */
  readonly establishedDate: string;
}
```

#### `BankType`

```typescript
type BankType =
  | 'Thương mại Cổ phần'
  | 'Thương mại Nhà nước'
  | 'Ngân hàng chính sách'
  | '100% vốn nước ngoài'
  | 'Ngân hàng Liên doanh'
  | 'NH Hợp tác xã'
  | 'TNHH MTV';
```

---

### 📚 API Reference

#### Hằng số / Constants

| Export | Kiểu | Mô tả |
| :--- | :--- | :--- |
| `banks` | `readonly Bank[]` | Toàn bộ danh sách ngân hàng |
| `BANKS_BY_BRAND` | `Readonly<Record<string, Bank>>` | Map tra cứu nhanh theo `brandName` — O(1) |
| `BANKS_BY_SWIFT` | `Readonly<Record<string, Bank>>` | Map tra cứu nhanh theo `swift` (uppercase) — O(1) |
| `BANKS_BY_TYPE` | `Readonly<Record<BankType, Bank[]>>` | Map nhóm theo `type` — O(1) |
| `BANK_TYPES` | `readonly BankType[]` | Danh sách các loại hình ngân hàng |
| `BankBrand` | `{ [key]: string }` | Hằng số brand name cho autocomplete |

#### Hàm tra cứu / Lookup Functions

| Hàm | Trả về | Mô tả |
| :--- | :--- | :--- |
| `getBankByBrand(name)` | `Bank \| undefined` | Tìm theo brand name (case-insensitive) |
| `getBankBySwift(swift)` | `Bank \| undefined` | Tìm theo mã SWIFT/BIC |
| `getBankByWebsite(url)` | `Bank \| undefined` | Tìm theo domain / URL website |
| `getBanksByType(type)` | `Bank[]` | Lọc theo loại hình ngân hàng |

#### Hàm tìm kiếm & tổng hợp / Search & Utility Functions

| Hàm | Trả về | Mô tả |
| :--- | :--- | :--- |
| `searchBanks(keyword)` | `Bank[]` | Tìm kiếm đa trường, **hỗ trợ không dấu** |
| `sortBanks(field?, direction?)` | `Bank[]` | Sắp xếp theo `brandName`, `fullName`, hoặc `establishedDate` |
| `getBanksByEstablishedYear(year)` | `Bank[]` | Lọc ngân hàng theo năm thành lập |
| `groupBanksByType()` | `Record<BankType, Bank[]>` | Gom nhóm theo loại hình |
| `getAllBrandNames()` | `string[]` | Danh sách tất cả brand name |
| `getAllSwifts()` | `string[]` | Danh sách tất cả mã SWIFT hiện có |
| `countBanks()` | `number` | Tổng số ngân hàng |
| `isValidSwift(swift)` | `boolean` | Kiểm tra SWIFT/BIC hợp lệ (ISO 9362) |

---

<a id="-english"></a>

## 🇬🇧 English

`vietnam-banks` is a **zero-dependency** Node.js / TypeScript library providing a complete, up-to-date database of banks operating in Vietnam, with high-performance lookup utilities.

### ✨ Features

| | Feature |
|---|---|
| 📋 | **Complete Dataset** — 45+ banks: Joint Stock, State-owned, Foreign, Joint Venture, Cooperative, Single Member LLC, Policy Banks |
| 🔎 | **O(1) Lookups** — Precomputed maps for `brandName`, `SWIFT`, and `type` |
| 🔤 | **Diacritic-insensitive Search** — `searchBanks('ngoai thuong')` → Vietcombank |
| 🧊 | **Immutable Data** — `Object.freeze` prevents accidental mutations |
| 📦 | **Dual Module** — ESM + CommonJS with TypeScript `.d.ts` declarations |
| 🪶 | **Zero Dependencies** — No external runtime overhead |

---

### 📦 Installation

```bash
npm install vietnam-banks
# or
yarn add vietnam-banks
# or
pnpm add vietnam-banks
```

---

### 🚀 Usage

#### 1. Bank Lookups

```typescript
import {
  getBankByBrand,
  getBankBySwift,
  getBankByWebsite,
  BankBrand,
} from 'vietnam-banks';

// Lookup using BankBrand constant (IDE autocomplete, typo-safe)
const vcb = getBankByBrand(BankBrand.Vietcombank);
console.log(vcb?.fullNameEn); // 'Joint Stock Commercial Bank for Foreign Trade of Vietnam'
console.log(vcb?.swift);      // 'BFTVVNVX'

// Lookup by SWIFT/BIC code (case-insensitive)
const tcb = getBankBySwift('VTCBVNVX');
console.log(tcb?.brandName);  // 'Techcombank'

// Lookup by website URL (strips https://, www., trailing slashes)
const acb = getBankByWebsite('https://acb.com.vn/');
console.log(acb?.brandName);  // 'ACB'
```

#### 2. Search & Filter

```typescript
import { searchBanks, getBanksByType, BANKS_BY_TYPE } from 'vietnam-banks';

// Diacritic-insensitive search (Vietnamese without accents)
searchBanks('ngoai thuong'); // → [Vietcombank]
searchBanks('quan doi');     // → [MBBANK]

// English search
searchBanks('Military');     // → [MBBANK]
searchBanks('Foreign Trade');// → [Vietcombank]

// Filter by bank type (uses O(1) precomputed map)
const foreignBanks = getBanksByType('100% vốn nước ngoài');
console.log(foreignBanks.map(b => b.brandName));
// ['Woori', 'UOB', 'HSBC', 'PBVN', 'SCBVL', 'SHBVN', 'ANZVL', 'CIMB', 'HLBVN']

// Direct access to precomputed type map
const jointStockBanks = BANKS_BY_TYPE['Thương mại Cổ phần'];
```

#### 3. Sorting & Advanced Utilities

```typescript
import {
  sortBanks,
  getBanksByEstablishedYear,
  isValidSwift,
} from 'vietnam-banks';

// Sort by establishment date (oldest first)
const oldest = sortBanks('establishedDate', 'asc');
console.log(oldest[0].brandName); // 'SAIGONBANK' (est. 1987)

// Sort alphabetically
const alphabetical = sortBanks('brandName', 'asc');

// Get all banks founded in a specific year
const banks1993 = getBanksByEstablishedYear(1993);
// → [VPBank, Techcombank, ACB, SHB, ABBANK, PGBank, GPBank]

// Validate SWIFT/BIC code per ISO 9362 standard
isValidSwift('BFTVVNVX'); // true
isValidSwift('INVALID');  // false
```

#### 4. CommonJS Usage

```javascript
const { banks, getBankByBrand, BankBrand } = require('vietnam-banks');

const bank = getBankByBrand(BankBrand.MBBANK);
console.log(bank.fullNameEn); // 'Military Commercial Joint Stock Bank'
```

---

### 📐 Data Schema

#### `Bank` Interface

```typescript
interface Bank {
  /** Short brand name, e.g. "Vietcombank" */
  readonly brandName: string;
  /** Full Vietnamese name */
  readonly fullName: string;
  /** Full English name */
  readonly fullNameEn: string;
  /** Bank category type */
  readonly type: BankType;
  /** SWIFT/BIC code (null if not applicable) */
  readonly swift: string | null;
  /** Official website domain (excluding https://) */
  readonly website: string;
  /** Establishment date — ISO 8601 (YYYY-MM-DD) */
  readonly establishedDate: string;
}
```

---

### 📚 Full API Reference

#### Constants

| Export | Type | Description |
| :--- | :--- | :--- |
| `banks` | `readonly Bank[]` | Complete list of all Vietnamese banks |
| `BANKS_BY_BRAND` | `Readonly<Record<string, Bank>>` | Fast O(1) lookup map by `brandName` |
| `BANKS_BY_SWIFT` | `Readonly<Record<string, Bank>>` | Fast O(1) lookup map by SWIFT code |
| `BANKS_BY_TYPE` | `Readonly<Record<BankType, Bank[]>>` | Fast O(1) lookup map by bank type |
| `BANK_TYPES` | `readonly BankType[]` | All available bank type categories |
| `BankBrand` | `{ [key]: string }` | Brand name constants for IDE autocompletion |

#### Lookup Functions

| Function | Returns | Description |
| :--- | :--- | :--- |
| `getBankByBrand(name)` | `Bank \| undefined` | Find by brand name (case-insensitive) |
| `getBankBySwift(swift)` | `Bank \| undefined` | Find by SWIFT/BIC code |
| `getBankByWebsite(url)` | `Bank \| undefined` | Find by website domain or URL |
| `getBanksByType(type)` | `Bank[]` | Filter by bank type category |

#### Search & Utility Functions

| Function | Returns | Description |
| :--- | :--- | :--- |
| `searchBanks(keyword)` | `Bank[]` | Multi-field search with **diacritic-insensitive** support |
| `sortBanks(field?, direction?)` | `Bank[]` | Sort by `brandName`, `fullName`, or `establishedDate` |
| `getBanksByEstablishedYear(year)` | `Bank[]` | Filter banks by founding year |
| `groupBanksByType()` | `Record<BankType, Bank[]>` | Group all banks by type |
| `getAllBrandNames()` | `string[]` | Get all brand name strings |
| `getAllSwifts()` | `string[]` | Get all non-null SWIFT codes |
| `countBanks()` | `number` | Total bank count |
| `isValidSwift(swift)` | `boolean` | Validate SWIFT/BIC per ISO 9362 |

---

## 🛠️ Contributing

```bash
# Clone the repository
git clone https://github.com/legianguyenit/vietnam-banks.git
cd vietnam-banks

# Install dependencies
npm install

# Type checking
npm run typecheck

# Build (ESM + CJS + .d.ts)
npm run build
```

Pull requests are welcome. Please open an issue first to discuss significant changes.

---

## 📄 License

[MIT](./LICENSE) © [Le Gia Nguyen](https://github.com/legianguyenit)
