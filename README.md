# 🇻🇳 vietnam-banks

> **Danh sách ngân hàng Việt Nam đầy đủ, chính xác kèm API tra cứu mạnh mẽ cho Node.js & TypeScript.**  
> **Comprehensive & accurate Vietnam Banks database with flexible lookup APIs for Node.js & TypeScript.**

[![npm version](https://img.shields.io/npm/v/vietnam-banks.svg?style=flat-square)](https://www.npmjs.com/package/vietnam-banks)
[![license](https://img.shields.io/npm/l/vietnam-banks.svg?style=flat-square)](./LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

---

## 🌐 Ngôn ngữ / Languages

- [🇻🇳 Tiếng Việt](#-tiếng-việt)
- [🇬🇧 English](#-english)

---

<a id="-tiếng-việt"></a>
# 🇻🇳 Tiếng Việt

`vietnam-banks` là thư viện mã nguồn mở nhẹ (zero-dependency) cung cấp danh sách đầy đủ và cập nhật nhất về các ngân hàng đang hoạt động tại Việt Nam. Thư viện tích hợp sẵn các hàm tra cứu theo **Brand Name**, **mã SWIFT/BIC**, **Website**, **Loại hình ngân hàng**, và **Tìm kiếm full-text đa trường**.

### ✨ Tính năng nổi bật

- 📋 **Dữ liệu đầy đủ & chính xác**: Hơn 45+ ngân hàng thuộc các nhóm Thương mại Cổ phần, Thương mại Nhà nước, 100% Vốn nước ngoài, Liên doanh, Hợp tác xã, TNHH MTV, Ngân hàng Chính sách.
- 🔎 **Tra cứu linh hoạt**: Theo `brandName`, `swift`, `website`, `type`.
- 🔤 **Tìm kiếm thông minh**: Hỗ trợ tìm kiếm theo từ khoá tiếng Việt và tiếng Anh.
- 🧊 **Dữ liệu an toàn**: Dữ liệu được đóng băng (`Object.freeze`), đảm bảo không bị tác động mutate ngẫu nhiên.
- 🌳 **Hỗ trợ tối đa**: ESM + CommonJS (CJS) + TypeScript declaration files (`.d.ts`).
- 🪶 **Siêu nhẹ**: Zero runtime dependencies.

---

### 📦 Cài đặt

```bash
npm install vietnam-banks
# hoặc với yarn
yarn add vietnam-banks
# hoặc với pnpm
pnpm add vietnam-banks
# hoặc với bun
bun add vietnam-banks
```

---

### 🚀 Hướng dẫn sử dụng

#### 1. Tra cứu ngân hàng cơ bản

```typescript
import { 
  getBankByBrand, 
  getBankBySwift, 
  getBankByWebsite, 
  BankBrand 
} from 'vietnam-banks';

// Tra cứu bằng BankBrand (Autocompleted)
const vcb = getBankByBrand(BankBrand.Vietcombank);
console.log(vcb?.fullName); 
// Output: "Ngân hàng TMCP Ngoại Thương Việt Nam"
console.log(vcb?.swift); 
// Output: "BFTVVNVX"

// Tra cứu theo mã SWIFT / BIC (không phân biệt hoa thường)
const techcombank = getBankBySwift('VTCBVNVX');
console.log(techcombank?.brandName); 
// Output: "Techcombank"

// Tra cứu theo URL website (tự động loại bỏ http://, https://, trailing slash)
const acb = getBankByWebsite('https://acb.com.vn/');
console.log(acb?.brandName); 
// Output: "ACB"
```

#### 2. Tìm kiếm & Lọc ngân hàng

```typescript
import { searchBanks, getBanksByType, groupBanksByType } from 'vietnam-banks';

// Tìm kiếm full-text (tìm trong brandName, fullName, fullNameEn, swift, website)
const searchResult = searchBanks('Sài Gòn');
// Kết quả trả về các ngân hàng liên quan: Sacombank, SCB, SAIGONBANK...

// Lọc danh sách ngân hàng theo loại hình
const foreignBanks = getBanksByType('100% vốn nước ngoài');
console.log(foreignBanks.map(b => b.brandName));
// Output: ['Woori', 'UOB', 'HSBC', 'PBVN', 'SCBVL', 'SHBVN', 'ANZVL', 'CIMB', 'HLBVN']

// Nhóm tất cả ngân hàng theo loại hình
const groupedBanks = groupBanksByType();
console.log(groupedBanks['Thương mại Cổ phần'].length);
```

#### 3. Sử dụng với CommonJS (Node.js legacy)

```javascript
const { banks, getBankByBrand, BankBrand } = require('vietnam-banks');

const bank = getBankByBrand(BankBrand.MBBANK);
console.log(bank.fullNameEn);
// Output: "Military Commercial Joint Stock Bank"
```

---

### 📐 Cấu trúc dữ liệu & Type Definitions

#### `Bank` Interface

```typescript
export interface Bank {
  /** Tên thương hiệu viết ngắn gọn, ví dụ: "Vietcombank" */
  readonly brandName: string;
  /** Tên đầy đủ bằng tiếng Việt */
  readonly fullName: string;
  /** Tên đầy đủ bằng tiếng Anh */
  readonly fullNameEn: string;
  /** Loại hình ngân hàng */
  readonly type: BankType;
  /** Mã SWIFT/BIC (null nếu ngân hàng không có/không dùng mã SWIFT) */
  readonly swift: string | null;
  /** Website chính thức (không bao gồm https://) */
  readonly website: string;
  /** Ngày thành lập theo định dạng ISO 8601 (YYYY-MM-DD) */
  readonly establishedDate: string;
}
```

#### `BankType`

Các loại hình ngân hàng được phân loại sẵn:
- `'Thương mại Cổ phần'`
- `'Thương mại Nhà nước'`
- `'Ngân hàng chính sách'`
- `'100% vốn nước ngoài'`
- `'Ngân hàng Liên doanh'`
- `'NH Hợp tác xã'`
- `'TNHH MTV'`

---

### 📚 Danh sách API đầy đủ

| Tên hàm / Hằng số | Kiểu trả về | Mô tả chi tiết |
| :--- | :--- | :--- |
| `banks` | `readonly Bank[]` | Mảng chứa toàn bộ danh sách ngân hàng Việt Nam. |
| `BANKS_BY_BRAND` | `Readonly<Record<string, Bank>>` | Map tra cứu nhanh `brandName -> Bank`. |
| `BANKS_BY_SWIFT` | `Readonly<Record<string, Bank>>` | Map tra cứu nhanh `swift -> Bank` (chỉ ngân hàng có SWIFT). |
| `BankBrand` | `Object` | Hằng số autocomplete brand name (tránh gõ sai tên). |
| `getBankByBrand(brandName)` | `Bank \| undefined` | Tìm ngân hàng theo tên thương hiệu (case-insensitive). |
| `getBankBySwift(swift)` | `Bank \| undefined` | Tìm ngân hàng theo mã SWIFT/BIC (case-insensitive). |
| `getBankByWebsite(website)` | `Bank \| undefined` | Tìm ngân hàng theo domain / URL website. |
| `getBanksByType(type)` | `Bank[]` | Trả về danh sách ngân hàng thuộc loại hình tương ứng. |
| `searchBanks(keyword)` | `Bank[]` | Tìm kiếm đa trường theo từ khóa. |
| `groupBanksByType()` | `Record<BankType, Bank[]>` | Gom nhóm các ngân hàng theo loại hình. |
| `getAllBrandNames()` | `string[]` | Trả về mảng chứa danh sách tất cả Brand Name. |
| `getAllSwifts()` | `string[]` | Trả về mảng chứa tất cả mã SWIFT hiện có. |
| `countBanks()` | `number` | Trả về tổng số lượng ngân hàng. |

---

<a id="-english"></a>
# 🇬🇧 English

`vietnam-banks` is a lightweight, zero-dependency Node.js and TypeScript library providing a complete and accurate database of banks operating in Vietnam, alongside convenient search utilities for **Brand Name**, **SWIFT/BIC Code**, **Website**, **Bank Type**, and **Multi-field Full-text Search**.

### ✨ Features

- 📋 **Comprehensive Dataset**: 45+ banks across Joint Stock Commercial, State-owned, 100% Foreign Owned, Joint Venture, Cooperative, Single Member LLC, and Policy Banks.
- 🔎 **Flexible Lookups**: By `brandName`, `swift` code, `website` URL, or bank `type`.
- 🔤 **Smart Full-Text Search**: Supports searching in both Vietnamese and English fields.
- 🧊 **Immutability**: Readonly frozen dataset (`Object.freeze`) preventing accidental mutations.
- 🌳 **Universal Exports**: ESM + CommonJS (CJS) with first-class TypeScript types (`.d.ts`).
- 🪶 **Zero Dependencies**: Zero external runtime overhead.

---

### 📦 Installation

```bash
npm install vietnam-banks
# or using yarn
yarn add vietnam-banks
# or using pnpm
pnpm add vietnam-banks
# or using bun
bun add vietnam-banks
```

---

### 🚀 Usage Guide

#### 1. Basic Bank Lookups

```typescript
import { 
  getBankByBrand, 
  getBankBySwift, 
  getBankByWebsite, 
  BankBrand 
} from 'vietnam-banks';

// Lookup using BankBrand enum (Autocomplete enabled)
const vcb = getBankByBrand(BankBrand.Vietcombank);
console.log(vcb?.fullNameEn); 
// Output: "Joint Stock Commercial Bank for Foreign Trade of Vietnam"
console.log(vcb?.swift); 
// Output: "BFTVVNVX"

// Lookup by SWIFT / BIC Code (case-insensitive)
const techcombank = getBankBySwift('VTCBVNVX');
console.log(techcombank?.brandName); 
// Output: "Techcombank"

// Lookup by website URL (automatically normalizes protocols & trailing slashes)
const acb = getBankByWebsite('https://acb.com.vn/');
console.log(acb?.brandName); 
// Output: "ACB"
```

#### 2. Search & Filter

```typescript
import { searchBanks, getBanksByType, groupBanksByType } from 'vietnam-banks';

// Multi-field full-text search (matches brandName, fullName, fullNameEn, swift, website)
const results = searchBanks('Military');
// Returns banks matching "Military": MBBANK...

// Filter banks by category type
const foreignBanks = getBanksByType('100% vốn nước ngoài');
console.log(foreignBanks.map(b => b.brandName));
// Output: ['Woori', 'UOB', 'HSBC', 'PBVN', 'SCBVL', 'SHBVN', 'ANZVL', 'CIMB', 'HLBVN']

// Group all banks by bank type category
const grouped = groupBanksByType();
console.log(grouped['Thương mại Cổ phần'].length);
```

#### 3. CommonJS Usage (Legacy Node.js)

```javascript
const { banks, getBankByBrand, BankBrand } = require('vietnam-banks');

const bank = getBankByBrand(BankBrand.MBBANK);
console.log(bank.fullNameEn);
// Output: "Military Commercial Joint Stock Bank"
```

---

### 📐 Data Schemas & Types

#### `Bank` Interface

```typescript
export interface Bank {
  /** Short brand name, e.g. "Vietcombank" */
  readonly brandName: string;
  /** Full Vietnamese name */
  readonly fullName: string;
  /** Full English name */
  readonly fullNameEn: string;
  /** Bank category type */
  readonly type: BankType;
  /** SWIFT / BIC code (or null if not applicable) */
  readonly swift: string | null;
  /** Official website domain (excluding https://) */
  readonly website: string;
  /** Establishment date in ISO 8601 format (YYYY-MM-DD) */
  readonly establishedDate: string;
}
```

---

### 📚 Full API Reference

| Export / Method | Return Type | Description |
| :--- | :--- | :--- |
| `banks` | `readonly Bank[]` | Readonly list of all Vietnamese banks. |
| `BANKS_BY_BRAND` | `Readonly<Record<string, Bank>>` | Fast lookup map by `brandName`. |
| `BANKS_BY_SWIFT` | `Readonly<Record<string, Bank>>` | Fast lookup map by uppercase `swift` code. |
| `BankBrand` | `Object` | Constant object for brand name autocompletion. |
| `getBankByBrand(brandName)` | `Bank \| undefined` | Lookup bank by brand name (case-insensitive). |
| `getBankBySwift(swift)` | `Bank \| undefined` | Lookup bank by SWIFT code (case-insensitive). |
| `getBankByWebsite(website)` | `Bank \| undefined` | Lookup bank by website URL/domain. |
| `getBanksByType(type)` | `Bank[]` | Filter banks by exact `BankType`. |
| `searchBanks(keyword)` | `Bank[]` | Multi-field search by keyword. |
| `groupBanksByType()` | `Record<BankType, Bank[]>` | Group all banks by `BankType`. |
| `getAllBrandNames()` | `string[]` | Return array of all brand names. |
| `getAllSwifts()` | `string[]` | Return array of all non-null SWIFT codes. |
| `countBanks()` | `number` | Return total bank count. |

---

## 🛠️ Development & Building

To contribute or build the package locally:

```bash
# Clone repository
git clone https://github.com/legianguyenit/vietnam-banks.git

# Install dependencies
npm install

# Check TypeScript types
npm run typecheck

# Build bundle (ESM + CJS)
npm run build
```

---

## 📄 License

[MIT](./LICENSE) © Le Gia Nguyen

