# 🎨 BÁO CÁO REFACTOR ICONS STRUCTURE

**Ngày hoàn thành:** 2026-01-21  
**Trạng thái:** ✅ **CẤU TRÚC ĐÃ HOÀN THIỆN**

---

## 📋 TÓM TẮT THAY ĐỔI

### ✅ **Đã thực hiện:**

1. **Tạo folders `icons/` cho tất cả games:**
   - ✅ `public/assets/grades/preschool/counting-animals/icons/`
   - ✅ `public/assets/grades/grade1/number-adventure/icons/`
   - ✅ `public/assets/grades/grade2/trangquynh/icons/` (đã có sẵn)
   - ✅ `public/assets/grades/grade3/fraction-quest/icons/`
   - ✅ `public/assets/grades/grade4/geometry-world/icons/` ⭐ MỚI
   - ✅ `public/assets/grades/grade5/math-champion/icons/`

2. **Tạo cấu trúc hoàn chỉnh cho Grade 4:**
   ```
   public/assets/grades/grade4/geometry-world/
   ├── icons/          ✅ Created
   ├── characters/     ✅ Created  
   ├── questions/      ✅ Created
   ├── backgrounds/    ✅ Created
   └── README.md       ✅ Created (hướng dẫn thiết kế)
   ```

3. **Tạo README.md cho từng icons folder:**
   - ✅ Grade 1 - README với 15 icons Con Giáp
   - ✅ Grade 3 - README với 15 icons Phân số/Truyện
   - ✅ Grade 5 - README với 15 icons Quân đội
   - ✅ Preschool - README với 15 icons Thiên nhiên
   - ✅ Grade 4 - README tổng hợp (characters, icons, questions, backgrounds)

4. **Update code:**
   - ✅ `src/utils/levelIcons.ts` - Thêm Grade 4, document structure
   - ✅ `src/utils/assetPaths.ts` - Thêm `grade4Characters` exports
   - ✅ Xóa 27 duplicate files trong `src/assets/` (icons, game, trang_*)

---

## 📂 CẤU TRÚC MỚI

### **Preschool - Mầm Non**
```
preschool/counting-animals/
├── characters/     ✅ 7 files
├── icons/          📝 README (cần 15 icons)
├── questions/      ✅ 24 files
└── backgrounds/    📁 Empty
```

### **Grade 1 - Cuộc đua 12 Con Giáp**
```
grade1/number-adventure/
├── characters/     ✅ 5 files (zodiac animals)
├── icons/          📝 README (cần 15 icons con giáp)
├── questions/      📁 Chưa tạo
└── backgrounds/    📁 Chưa tạo
```

### **Grade 2 - Trạng Quỳnh**
```
grade2/trangquynh/
├── characters/     ✅ 3 files
├── icons/          ✅ 9 files (HOÀN CHỈNH!)
├── questions/      ✅ 4 files
└── backgrounds/    📁 Empty
```

### **Grade 3 - Sơn Tinh Thủy Tinh**
```
grade3/fraction-quest/
├── characters/     ✅ 5 files
├── icons/          📝 README (cần 15 icons phân số)
├── questions/      ✅ 4 files
└── backgrounds/    📁 Chưa tạo
```

### **Grade 4 - Geometry World** ⭐ **MỚI**
```
grade4/geometry-world/
├── characters/     📁 Empty (README hướng dẫn)
├── icons/          📁 Empty (README hướng dẫn)
├── questions/      📁 Empty (README hướng dẫn)
├── backgrounds/    📁 Empty (README hướng dẫn)
└── README.md       ✅ Complete guide
```

### **Grade 5 - Bảo Vệ Triều Đình**
```
grade5/math-champion/
├── characters/     ✅ 5 files
├── icons/          📝 README (cần 15 icons quân đội)
├── questions/      📁 Chưa tạo
└── backgrounds/    📁 Empty
```

---

## 📝 HƯỚNG DẪN SỬ DỤNG

### **1. Thêm icons cho màn game:**

**Đường dẫn đúng:**
```
public/assets/grades/{grade}/{game-id}/icons/icon_{name}.png
```

**Ví dụ:**
```
Grade 1: public/assets/grades/grade1/number-adventure/icons/icon_rat.png
Grade 3: public/assets/grades/grade3/fraction-quest/icons/icon_mountain.png
Grade 4: public/assets/grades/grade4/geometry-world/icons/icon_square.png
```

### **2. Quy tắc đặt tên:**

| Loại | Format | Ví dụ |
|------|--------|-------|
| Icons | `icon_{name}.png` | `icon_rat.png`, `icon_mountain.png` |
| Characters | `{name}_{state}.png` | `hero_idle.png`, `hero_happy.png` |
| Questions | `{name}.png` | `peach.png`, `cloud_blue.png` |
| Backgrounds | `bg_{name}.png` | `bg_village.png`, `bg_classroom.png` |

### **3. Kích thước chuẩn:**

| Asset Type | Kích thước | Format |
|------------|-----------|--------|
| Icons | 128x128px | PNG transparent |
| Characters | 512x512px | PNG transparent |
| Questions | 400x400px | PNG transparent |
| Backgrounds | 1920x1080px | PNG/JPG |

---

## 🔧 CODE EXAMPLES

### **Sử dụng trong levelIcons.ts:**
```typescript
// Đúng - từ icons/ folder
'/assets/grades/grade1/number-adventure/icons/icon_rat.png'

// Sai - từ characters/ (cũ)
'/assets/grades/grade1/number-adventure/characters/zodiac_rat.png'
```

### **Sử dụng trong assetPaths.ts:**
```typescript
// Grade 4 characters
import { grade4Characters } from '@/utils/assetPaths';

<img src={grade4Characters.hero.idle} />
// → /assets/grades/grade4/geometry-world/characters/hero_idle.png

// Grade 4 icons
import { grade4Games } from '@/utils/assetPaths';

grade4Games.geometryWorld.icon('square')
// → /assets/grades/grade4/geometry-world/icons/icon_square.png
```

---

## 📊 THỐNG KÊ ASSETS

### **Hiện có:**
| Grade | Characters | Icons | Questions | Backgrounds |
|-------|-----------|-------|-----------|-------------|
| **Preschool** | 7 ✅ | 0 📝 | 24 ✅ | 0 📁 |
| **Grade 1** | 5 ✅ | 0 📝 | 0 📁 | 0 📁 |
| **Grade 2** | 3 ✅ | 9 ✅ | 4 ✅ | 0 📁 |
| **Grade 3** | 5 ✅ | 0 📝 | 4 ✅ | 0 📁 |
| **Grade 4** | 0 📝 | 0 📝 | 0 📝 | 0 📝 |
| **Grade 5** | 5 ✅ | 0 📝 | 0 📁 | 0 📁 |
| **Total** | 25 | 9 | 32 | 0 |

**Legend:**
- ✅ = Có files
- 📝 = Có README (chờ thiết kế)
- 📁 = Folder trống

### **Cần thiết kế:**
- 📝 **Icons:** 75 files (15 mỗi grade × 5 grades)
- 📝 **Grade 4:** Full set (characters, icons, questions, backgrounds)
- 📝 **Backgrounds:** ~30 files (cho tất cả grades)

---

## ✨ ƯU ĐIỂM CẤU TRÚC MỚI

### **Trước:**
```
❌ Icons nằm lộn xộn trong characters/ hoặc questions/
❌ Không có cấu trúc rõ ràng cho từng loại asset
❌ Khó tìm và maintain
```

### **Sau:**
```
✅ Mỗi game có folder icons/ riêng
✅ Cấu trúc nhất quán cho tất cả grades
✅ Dễ thêm assets mới
✅ README hướng dẫn rõ ràng cho team design
✅ Grade 4 sẵn sàng để thêm content
```

---

## 🎯 NEXT STEPS

### **Cho Team Design:**
1. Đọc README trong từng folder `icons/`
2. Thiết kế icons theo yêu cầu (128x128px, PNG transparent)
3. Đặt tên đúng format: `icon_{name}.png`
4. Upload vào đúng folder grade

### **Cho Team Dev:**
1. Khi có icons mới, update `levelIcons.ts`:
   - Thay đổi từ placeholder (characters/questions) sang icons/
   - Xóa comment `// PLACEHOLDER`
2. Test từng grade sau khi thêm icons
3. Verify hiển thị đúng trên màn hình chọn level

### **Cho Grade 4:**
1. Đọc `public/assets/grades/grade4/geometry-world/README.md`
2. Chuẩn bị story JSON (`story.grade4.*.json`)
3. Thiết kế full assets theo hướng dẫn
4. Update `levelIcons.ts` khi có icons

---

## 📞 REFERENCE FILES

- 📄 `README_assets.md` - Tổng quan cấu trúc assets
- 📄 `src/utils/levelIcons.ts` - Logic mapping icons
- 📄 `src/utils/assetPaths.ts` - Helper functions
- 📄 `public/assets/grades/grade4/geometry-world/README.md` - Grade 4 guide
- 📄 `public/assets/grades/{grade}/{game}/icons/README.md` - Icons requirements

---

**✅ CẤU TRÚC HOÀN CHỈNH - SẴN SÀNG NHẬN ASSETS MỚI! 🎉**
