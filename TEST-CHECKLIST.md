# 🧪 TESTING CHECKLIST

## 🚀 Quick Test Steps:

### 1. Start Dev Server:
```bash
npm run dev
```

### 2. Test từng lớp:

#### ✅ Preschool (Mầm non):
- [ ] Nhân vật Cuội hiển thị (cuoi_idle, cuoi_happy...)
- [ ] Đom đóm, giọt sương, lá cây hiển thị
- [ ] Mây xanh/hồng/vàng hiển thị
- [ ] Lồng đèn, cá hiển thị

#### ✅ Grade 1 (Lớp 1):
- [ ] 12 con giáp hiển thị (zodiac_rat, zodiac_ox, zodiac_tiger)
- [ ] Hổ, trâu vàng hiển thị

#### ✅ Grade 2 - Trạng Quỳnh:
- [ ] Nhân vật Trạng Quỳnh (idle, cheer, portrait)
- [ ] Icons hiển thị (táo, cầu, đồng hồ, tiền...)
- [ ] ⚠️ Background KHÔNG hiển thị (thiếu file - OK)

#### ✅ Grade 3 - Sơn Tinh:
- [ ] Sơn Tinh, Thủy Tinh, Vua Hùng hiển thị
- [ ] Đào, bậc thang hiển thị

#### ✅ Grade 5 - Trạng Nguyên:
- [ ] Trạng Nguyên, lính, tướng hiển thị
- [ ] ⚠️ Background KHÔNG hiển thị (thiếu file - OK)

### 3. Check Console (F12):

**Expected errors (OK):**
- ❌ 404 for `bg_village.png`, `bg_market.png`... (backgrounds chưa có)
- ❌ 404 for `icon_calendar.png`, `icon_scroll.png`... (icons chưa có)

**Unexpected errors (BUG - cần fix):**
- ❌ 404 for character images (trang_idle.png, cuoi_idle.png...)
- ❌ 404 for question images (firefly_yellow.png, cloud_blue.png...)
- ❌ JavaScript errors

### 4. Visual Check:

- [ ] Tất cả nhân vật (characters) hiển thị
- [ ] Tất cả icons (có file) hiển thị
- [ ] Questions có hình ảnh hiển thị
- [ ] Game vẫn chơi được bình thường

---

## ✅ PASS CRITERIA:

### Minimum (Phải có):
- ✅ Không có lỗi 404 cho **characters** (nhân vật)
- ✅ Không có lỗi 404 cho **questions** (có file gốc)
- ✅ Không có lỗi 404 cho **icons** (có file gốc)
- ✅ Game logic vẫn hoạt động (điểm, progress...)

### Expected Issues (OK):
- ⚠️ 404 cho backgrounds (chờ design) - EXPECTED
- ⚠️ 404 cho một số icons thiếu - EXPECTED

---

## 🐛 NẾU CÓ LỖI:

### Lỗi: "Cannot find character image"
→ Check path trong JSON có đúng không
→ Verify file tồn tại trong `public/assets/grades/.../characters/`

### Lỗi: "404 for icon_apple.png"
→ Check JSON đang trỏ đến đúng path chưa
→ Verify file trong `public/assets/grades/.../icons/`

### Lỗi: "Module not found: assetPaths"
→ Check tsconfig.json có alias `@/utils` chưa
→ Restart dev server

---

**Run test ngay:** `npm run dev` và check từng lớp! 🚀
