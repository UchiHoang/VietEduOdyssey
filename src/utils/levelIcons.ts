// Level Icon Mapping System
// Maps each grade/game to appropriate level icons from icons/ folder

export const getLevelIcon = (gradeOrGameTitle: string, levelIndex: number): string => {
  const title = gradeOrGameTitle.toLowerCase();
  
  // Grade 2 - Trạng Quỳnh
  // Icons folder: public/assets/grades/grade2/trangquynh/icons/
  if (title.includes('trạng quỳnh') || title.includes('trang quynh')) {
    const grade2Icons = [
      '/assets/grades/grade2/trangquynh/icons/icon_apple.png',
      '/assets/grades/grade2/trangquynh/icons/icon_bridge.png',
      '/assets/grades/grade2/trangquynh/icons/icon_neighborhood.png',
      '/assets/grades/grade2/trangquynh/icons/icon_clock.png',
      '/assets/grades/grade2/trangquynh/icons/icon_puzzle.png', // TODO: Move to grade2/trangquynh/icons/
      '/assets/grades/grade2/trangquynh/icons/icon_aosen.png',  // TODO: Move to grade2/trangquynh/icons/
      '/assets/grades/grade2/trangquynh/icons/icon_duongde.png',
      '/assets/grades/grade2/trangquynh/icons/icon_sack.png',
      '/assets/grades/grade2/trangquynh/icons/icon_market.png',
      '/assets/grades/grade2/trangquynh/icons/icon_apple.png',
      '/assets/grades/grade2/trangquynh/icons/icon_money.png', // fallback
      '/assets/grades/grade2/trangquynh/icons/icon_sack.png',
      '/assets/grades/grade2/trangquynh/icons/icon_badge.png',
      '/assets/grades/grade2/trangquynh/icons/icon_bridge.png',
      '/assets/grades/grade2/trangquynh/icons/icon_puzzle.png',
    ];
    return grade2Icons[levelIndex] || grade2Icons[0];
  }
  
  // Grade 1 - 12 Con Giáp
  // Icons folder: public/assets/grades/grade1/number-adventure/icons/
  // TODO: Cần thiết kế 15 icons con giáp (xem README trong folder)
  if (title.includes('con giáp') || title.includes('con giap') || title.includes('grade 1') || title.includes('lớp 1')) {
    const grade1Icons = [
      // PLACEHOLDER: Dùng tạm characters, cần thay bằng icons/
      '/assets/grades/grade1/number-adventure/icons/mouse.png',
      '/assets/grades/grade1/number-adventure/characters/buffalo_golden.png',
      '/assets/grades/grade1/number-adventure/characters/tiger_idle.png',
      '/assets/grades/grade1/number-adventure/icons/cat.png',
      '/assets/grades/grade1/number-adventure/icons/dragon.png',
      '/assets/grades/grade1/number-adventure/icons/snake.png',
      '/assets/grades/grade1/number-adventure/icons/horse.png',
      '/assets/grades/grade1/number-adventure/icons/conde.png',
      '/assets/grades/grade1/number-adventure/icons/monkey.png',
      '/assets/grades/grade1/number-adventure/icons/conga.png',
      '/assets/grades/grade1/number-adventure/icons/dog.png',
      '/assets/grades/grade1/number-adventure/icons/pig.png',
      '/assets/grades/grade1/number-adventure/icons/goldboard.png',
      '/assets/grades/grade1/number-adventure/icons/party.png',
      '/assets/grades/grade1/number-adventure/characters/ngochoang.png',
    ];
    return grade1Icons[levelIndex] || grade1Icons[0];
  }
  
  // Grade 3 - Sơn Tinh Thủy Tinh
  // Icons folder: public/assets/grades/grade3/fraction-quest/icons/
  // TODO: Cần thiết kế 15 icons theo chủ đề (xem README trong folder)
  if (title.includes('sơn tinh') || title.includes('son tinh') || title.includes('thủy tinh') || title.includes('thuy tinh')) {
    const grade3Icons = [
      // PLACEHOLDER: Dùng tạm characters/questions, cần thay bằng icons/
      '/assets/grades/grade3/fraction-quest/characters/vuahung_idle.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_elephan.jpg',
      '/assets/grades/grade3/fraction-quest/icons/icon_chicken.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_horse.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_levat.png',
      '/assets/grades/grade3/fraction-quest/characters/vuahung_idle.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_tanvien.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_cave.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_levat.png',
      '/assets/grades/grade3/fraction-quest/characters/thuytinh_idle.png',
      '/assets/grades/grade3/fraction-quest/characters/sontinh_idle.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_tanvien.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_giuplang.jpg',
      '/assets/grades/grade3/fraction-quest/characters/sontinh_idle.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_cave.png',
    ];
    return grade3Icons[levelIndex] || grade3Icons[0];
  }
  
  // Preschool - Chú Cuội
  // Icons folder: public/assets/grades/preschool/counting-animals/icons/
  // TODO: Cần thiết kế 15 icons thiên nhiên (xem README trong folder)
  if (title.includes('cuội') || title.includes('cuoi') || title.includes('mầm non') || title.includes('preschool')) {
    const preschoolIcons = [
      // PLACEHOLDER: Dùng tạm questions, cần thay bằng icons/
      '/assets/grades/preschool/counting-animals/questions/firefly_yellow.png',
      '/assets/grades/preschool/counting-animals/questions/water_drop1.png',
      '/assets/grades/preschool/counting-animals/questions/plant_sprout1.png',
      '/assets/grades/preschool/counting-animals/questions/rock_big.png',
      '/assets/grades/preschool/counting-animals/questions/tree_green.png',
      '/assets/grades/preschool/counting-animals/characters/bird_idle.png',
      '/assets/grades/preschool/counting-animals/questions/cloud_pink.png',
      '/assets/grades/preschool/counting-animals/questions/cloud_yellow.png',
      '/assets/grades/preschool/counting-animals/questions/leaf_green.png',
      '/assets/grades/preschool/counting-animals/characters/cuoi_happy.png',
      '/assets/grades/preschool/counting-animals/icons/l11.png',
      '/assets/grades/preschool/counting-animals/characters/cuoi_thinking.png',
      '/assets/grades/preschool/counting-animals/characters/chihang_idle.png',
      '/assets/grades/preschool/counting-animals/questions/lantern_type1.png',
      '/assets/grades/preschool/counting-animals/icons/l15.png',
    ];
    return preschoolIcons[levelIndex] || preschoolIcons[0];
  }
  
  // Grade 5 - Trạng Nguyên
  // Icons folder: public/assets/grades/grade5/math-champion/icons/
  // TODO: Cần thiết kế 15 icons quân đội (xem README trong folder)
  if (title.includes('trạng nguyên') || title.includes('trang nguyen') || title.includes('bảo vệ') || title.includes('bao ve')) {
    const grade5Icons = [
      // PLACEHOLDER: Dùng tạm characters, cần thay bằng icons/
      '/assets/grades/grade5/math-champion/characters/trangnguyen_idle.png',
      '/assets/grades/grade5/math-champion/icons/kiemkho.png',
      '/assets/grades/grade5/math-champion/characters/soldier_support.png',
      '/assets/grades/grade5/math-champion/characters/general_army.png',
      '/assets/grades/grade5/math-champion/characters/captain_ship.png',
      '/assets/grades/grade5/math-champion/icons/doihinh.png',
      '/assets/grades/grade5/math-champion/icons/dapde.png',
      '/assets/grades/grade5/math-champion/icons/kiemkho.png',
      '/assets/grades/grade5/math-champion/characters/trangnguyen_idle.png',
      '/assets/grades/grade5/math-champion/characters/soldier_engineer.png',
      '/assets/grades/grade5/math-champion/icons/doihinh.png',
      '/assets/grades/grade5/math-champion/characters/captain_ship.png',
      '/assets/grades/grade5/math-champion/icons/cuocdua.png',
      '/assets/grades/grade5/math-champion/characters/trangnguyen_idle.png',
      '/assets/grades/grade5/math-champion/icons/khaihoan.png',
    ];
    return grade5Icons[levelIndex] || grade5Icons[0];
  }
  
  // Grade 4 - Geometry World
  // Icons folder: public/assets/grades/grade4/geometry-world/icons/
  // TODO: Cần thiết kế 15 icons hình học (xem README trong folder)
  if (title.includes('hình học') || title.includes('hinh hoc') || title.includes('geometry') || title.includes('lớp 4') || title.includes('grade 4')) {
    const grade4Icons = [
      // PLACEHOLDER: Dùng common icons tạm
      '/assets/grades/grade4/geometry-world/characters/giong.png',
      '/assets/common/qu',
      '/assets/common/icons/icon_ruler.png',
      '/assets/common/questions/counting-dots.png',
      '/assets/common/questions/number-cards.png',
      '/assets/common/icons/icon_bridge.png',
      '/assets/common/icons/icon_sack.png',
      '/assets/common/questions/shapes-basic.png',
      '/assets/common/questions/number-cards.png',
      '/assets/common/icons/icon_ruler.png',
      '/assets/common/questions/counting-dots.png',
      '/assets/common/questions/number-cards.png',
      '/assets/common/icons/icon_bridge.png',
      '/assets/common/icons/icon_sack.png',
      '/assets/common/questions/shapes-basic.png',
    ];
    return grade4Icons[levelIndex] || grade4Icons[0];
  }
  
  // Fallback - Common icons
  const fallbackIcons = [
    '/assets/grades/grade4/geometry-world/icons/sugia.png',
    '/assets/grades/grade4/geometry-world/icons/mother.png',
    '/assets/grades/grade4/geometry-world/icons/vuninh.png',
    '/assets/grades/grade4/geometry-world/icons/king.png',
      '/assets/grades/grade5/math-champion/icons/doihinh.png',
    '/assets/grades/grade4/geometry-world/icons/horse.png',
    '/assets/grades/grade4/geometry-world/icons/giapvang.png',
    '/assets/grades/grade4/geometry-world/icons/gaysat.png',
    '/assets/grades/grade4/geometry-world/icons/giong.png',
      '/assets/grades/grade5/math-champion/icons/cuocdua.png',
    '/assets/grades/grade4/geometry-world/icons/vuninh.png',
    '/assets/grades/grade4/geometry-world/icons/nhotre.png',
    '/assets/grades/grade4/geometry-world/icons/giacan.png',
      '/assets/grades/grade3/fraction-quest/icons/icon_tanvien.png',
    '/assets/grades/grade4/geometry-world/icons/vetroi.png',
  ];
  return fallbackIcons[levelIndex] || fallbackIcons[0];
};
