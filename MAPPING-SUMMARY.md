# 📊 TÓM TẮT BẢN ĐỒ MAPPING ASSETS

## 🎯 Tổng quan

| Lớp | Số file | Trạng thái |
|-----|---------|------------|
| **Mầm non (Preschool)** | 30 files | ✅ Đã mapping |
| **Lớp 1 (Grade 1)** | 5 files | ✅ Đã mapping |
| **Lớp 2 (Grade 2)** | 15 files | ✅ Đã mapping |
| **Lớp 3 (Grade 3)** | 9 files | ✅ Đã mapping |
| **Lớp 5 (Grade 5)** | 5 files | ✅ Đã mapping |
| **Common/Duplicate** | ~15 files | ⚠️ Cần review |

**Tổng cộng:** ~79 files cần xử lý

---

## ⚠️ VẤN ĐỀ CẦN XÁC NHẬN

### 1. Icon trùng lặp giữa `public/assets/user/` và `src/assets/icons/`

Các file icon sau xuất hiện ở cả 2 nơi:

| Icon | Vị trí 1 | Vị trí 2 | Đề xuất |
|------|----------|----------|---------|
| `icon_apple.png` | `public/assets/user/` | `src/assets/icons/` | ⚠️ Cần so sánh file |
| `icon_badge.png` | `public/assets/user/` | `src/assets/icons/` | ⚠️ Cần so sánh file |
| `icon_bridge.png` | ❌ Không có | `src/assets/icons/` | ✅ Giữ src |
| `icon_bunch.png` | `public/assets/user/` | `src/assets/icons/` | ⚠️ Cần so sánh file |
| `icon_clock.png` | `public/assets/user/` | `src/assets/icons/` | ⚠️ Cần so sánh file |
| `icon_money.png` | `public/assets/user/` | `src/assets/icons/` | ⚠️ Cần so sánh file |
| `icon_puzzle.png` | `public/assets/user/` | `src/assets/icons/` | ⚠️ Cần so sánh file |

**❓ CÂU HỎI:** Bạn muốn tôi:
- A) Giữ bản `src/assets/icons/` (đã được import trong code)
- B) Giữ bản `public/assets/user/` (dùng trong JSON)
- C) So sánh và merge nếu khác nhau

---

### 2. File trong `src/assets/game/` (Common questions)

Các file này hiện đang nằm trong `src/` nhưng theo cấu trúc mới nên ở `public/`:

```
src/assets/game/counting-apple.png      → public/assets/common/questions/counting-apple.png
src/assets/game/counting-banana.png     → public/assets/common/questions/counting-banana.png
src/assets/game/counting-dots.png       → public/assets/common/questions/counting-dots.png
src/assets/game/counting-flower.png     → public/assets/common/questions/counting-flower.png
src/assets/game/counting-star.png       → public/assets/common/questions/counting-star.png
src/assets/game/measurement-tools.png   → public/assets/common/questions/measurement-tools.png
src/assets/game/number-cards.png        → public/assets/common/questions/number-cards.png
src/assets/game/shapes-basic.png        → public/assets/common/questions/shapes-basic.png
```

**❓ CÂU HỎI:** Di chuyển các file này sang `public/`?

---

### 3. File thiếu được tham chiếu trong JSON

Các icon sau được dùng trong story JSON nhưng **không tồn tại** trong thư mục hiện tại:

- `icon_ruler.png` ✅ (Tồn tại trong `src/assets/icons/`)
- `icon_sack.png` ✅ (Tồn tại trong `src/assets/icons/`)
- `icon_calendar.png` ❌ **THIẾU**
- `icon_scroll.png` ❌ **THIẾU**
- `icon_brick.png` ❌ **THIẾU**
- `icon_candy.png` ❌ **THIẾU**
- `icon_shape.png` ❌ **THIẾU**

**❓ CÂU HỎI:** Có cần tạo/tìm các icon này không?

---

### 4. Background images không tìm thấy

Story JSON có reference đến nhiều background:
- `bg_village.png`
- `bg_market.png`
- `bg_bridge.png`
- `bg_areca_garden.png`
- `bg_classroom.png`
- ... và nhiều bg khác

**❌ KHÔNG tìm thấy** trong `public/assets/user/`

**❓ CÂU HỎI:** 
- Các background này có tồn tại ở đâu không?
- Hoặc chúng sẽ được tạo sau?

---

### 5. Tên file đoán nghĩa (cần xác nhận)

Một số file có tên mã hóa, tôi đã đoán nghĩa dựa vào context trong JSON:

| File cũ | Tên mới đề xuất | Nguồn đoán |
|---------|-----------------|-----------|
| `g0l5q3y.png` | `tree_yellow.png` | story.grade0.trangquynh.json - "Cây đa vàng" |
| `g0l5q3g.png` | `tree_green.png` | story.grade0.trangquynh.json - "Cây đa xanh" |
| `g0l7q3b.png` | `cloud_blue.png` | grade0-lesson7-question3 - "Mây xanh" |
| `g0l7q3p.png` | `cloud_pink.png` | grade0-lesson7-question3 - "Mây hồng" |
| `g0l7q3y.png` | `cloud_yellow.png` | grade0-lesson7-question3 - "Mây vàng" |
| `l1q61.png` | `lantern_type1.png` | grade0-lesson1-question6 - "Lồng đèn" |
| `l1q62.png` | `lantern_type2.png` | grade0-lesson1-question6 - "Lồng đèn" |

**❓ CÂU HỎI:** Tên này có chính xác không? Cần xem hình để chắc chắn không?

---

## 📋 CHECKLIST TRƯỚC KHI TIẾP TỤC

Trước khi thực hiện **Bước 2 (Di chuyển file)**, hãy xác nhận:

- [ ] **1. Icon trùng lặp:** Chọn bản nào giữ lại (A/B/C)?
- [ ] **2. src/assets/game:** Có di chuyển sang public/ không?
- [ ] **3. Icon thiếu:** Cần tạo/tìm các icon còn thiếu không?
- [ ] **4. Background:** Có cần xử lý background không?
- [ ] **5. Tên file mã hóa:** Xác nhận tên đã đúng chưa?

---

## 🚀 SAU KHI XÁC NHẬN

Sau khi bạn trả lời các câu hỏi trên, tôi sẽ:

1. **Tạo thư mục cấu trúc mới**
2. **Copy/Move file từ cũ sang mới**
3. **Tạo file `src/utils/assetPaths.ts`**
4. **Tìm và thay thế tất cả đường dẫn cũ trong:**
   - `src/data/*.json`
   - `src/components/*.tsx`
   - `src/pages/*.tsx`
5. **Xóa file cũ trong `public/assets/user/`**
6. **Test và verify**

---

## 📁 XEM CHI TIẾT

File mapping chi tiết: `asset-mapping.json`

---

**Tạo bởi:** Asset Refactoring Assistant  
**Ngày:** 2026-01-21
