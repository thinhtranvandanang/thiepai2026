export type CardTemplateId =
  | 'classic-heritage'
  | 'editorial-postcard'
  | 'chalkboard-memory'
  | 'modern-minimal'
  | 'autumn-reverie'
  | 'scholar-folio';

export type FlowerType =
  | 'none'
  | 'rose'
  | 'chrysanthemum'
  | 'lotus'
  | 'sunflower'
  | 'orchid';

export type BackgroundType =
  | 'plain'
  | 'school'
  | 'blackboard'
  | 'chalk'
  | 'autumn'
  | 'pattern';

export type WishStyle = 'formal' | 'warm' | 'humorous' | 'concise';

export interface ColorPalette {
  id: string;
  name: string;
  primary: string;
  accent: string;
  paper: string;
  textMain: string;
  textMuted: string;
  border: string;
}

export interface CardState {
  templateId: CardTemplateId;
  paletteId: string;
  customColor: string | null;
  flower: FlowerType;
  background: BackgroundType;
  teacherName: string;
  senderName: string;
  wishStyle: WishStyle;
  wishText: string;
}

export interface CardTemplateMeta {
  id: CardTemplateId;
  name: string;
  subtitle: string;
}

export const CARD_TEMPLATES: CardTemplateMeta[] = [
  {
    id: 'classic-heritage',
    name: 'Cổ điển Trang trọng',
    subtitle: 'Viền chỉ đôi, dấu ấn 20/11',
  },
  {
    id: 'editorial-postcard',
    name: 'Bưu thiếp Tri ân',
    subtitle: 'Bố cục thư tay thanh lịch',
  },
  {
    id: 'chalkboard-memory',
    name: 'Kỷ niệm Phấn bảng',
    subtitle: 'Đậm chất lớp học thân thương',
  },
  {
    id: 'modern-minimal',
    name: 'Tối giản Đương đại',
    subtitle: 'Khoảng trắng thoáng, tinh gọn',
  },
  {
    id: 'autumn-reverie',
    name: 'Sắc thu Nhớ ơn',
    subtitle: 'Khung vòm mềm mại, ấm áp',
  },
  {
    id: 'scholar-folio',
    name: 'Lưu bút Học trò',
    subtitle: 'Trang sách mở, họa tiết góc',
  },
];

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'crimson-gold',
    name: 'Đỏ đô & Vàng đồng',
    primary: '#8B1E24',
    accent: '#B68938',
    paper: '#FCF8F1',
    textMain: '#261A16',
    textMuted: '#6A5B53',
    border: '#D7C5AA',
  },
  {
    id: 'sage-cream',
    name: 'Xanh bảng & Kem ngà',
    primary: '#1E4D3B',
    accent: '#C19648',
    paper: '#F8F7F0',
    textMain: '#182821',
    textMuted: '#53675E',
    border: '#C6D1C6',
  },
  {
    id: 'sepia-amber',
    name: 'Nâu trầm & Hổ phách',
    primary: '#5C3820',
    accent: '#C27832',
    paper: '#FDF8F1',
    textMain: '#2B1B11',
    textMuted: '#735B4A',
    border: '#DFCBB5',
  },
  {
    id: 'lapis-ivory',
    name: 'Xanh lam & Bạch kim',
    primary: '#1B3B66',
    accent: '#B58D40',
    paper: '#F7F9FC',
    textMain: '#142238',
    textMuted: '#55657D',
    border: '#C7D3E3',
  },
  {
    id: 'olive-moss',
    name: 'Xanh lá nhạt & Đồng',
    primary: '#426046',
    accent: '#B5893F',
    paper: '#F9FAF5',
    textMain: '#1E2A20',
    textMuted: '#5C6C5D',
    border: '#CCD5C7',
  },
  {
    id: 'lotus-rose',
    name: 'Hồng sen & Gỗ trầm',
    primary: '#98364E',
    accent: '#BE8B55',
    paper: '#FDF6F7',
    textMain: '#2B171D',
    textMuted: '#74565E',
    border: '#E4C8CE',
  },
  {
    id: 'hue-violet',
    name: 'Tím Huế & Vàng cổ',
    primary: '#5B2B5E',
    accent: '#C19744',
    paper: '#FAF6FB',
    textMain: '#271729',
    textMuted: '#6A576D',
    border: '#D9C8DD',
  },
  {
    id: 'charcoal-vermilion',
    name: 'Than chì & Đỏ son',
    primary: '#2B2B2B',
    accent: '#B8392B',
    paper: '#FAF8F4',
    textMain: '#1B1B1B',
    textMuted: '#5F5B56',
    border: '#D5CFC5',
  },
];

export const FLOWER_OPTIONS: { id: FlowerType; label: string; description: string }[] = [
  { id: 'lotus', label: 'Hoa sen', description: 'Thuần khiết, cao quý' },
  { id: 'rose', label: 'Hoa hồng', description: 'Yêu thương, kính trọng' },
  { id: 'chrysanthemum', label: 'Hoa cúc', description: 'Bền bỉ, tri ân sâu sắc' },
  { id: 'sunflower', label: 'Hoa hướng dương', description: 'Rạng rỡ, dẫn lối tương lai' },
  { id: 'orchid', label: 'Hoa lan', description: 'Thanh cao, tinh tế' },
  { id: 'none', label: 'Không có hoa', description: 'Tập trung vào con chữ' },
];

export const BACKGROUND_OPTIONS: { id: BackgroundType; label: string; description: string }[] = [
  { id: 'plain', label: 'Trơn', description: 'Giấy mỹ thuật mịn nhẹ' },
  { id: 'school', label: 'Trường học', description: 'Mái trường và hàng cây' },
  { id: 'blackboard', label: 'Bảng đen', description: 'Nền bảng xanh đen cổ điển' },
  { id: 'chalk', label: 'Phấn', description: 'Nét phấn vẽ bảng tinh tế' },
  { id: 'autumn', label: 'Mùa thu', description: 'Lá vàng bay trong gió thu' },
  { id: 'pattern', label: 'Hoa văn', description: 'Họa tiết truyền thống dịu nhẹ' },
];

export const WISH_STYLES: { id: WishStyle; label: string; hint: string }[] = [
  { id: 'formal', label: 'Trang trọng', hint: 'Kính cẩn, chuẩn mực' },
  { id: 'warm', label: 'Thân mật', hint: 'Gần gũi, chân thành' },
  { id: 'humorous', label: 'Hài hước', hint: 'Vui tươi, dí dỏm' },
  { id: 'concise', label: 'Ngắn gọn', hint: 'Súc tích, cô đọng' },
];

export const DEFAULT_CARD_STATE: CardState = {
  templateId: 'classic-heritage',
  paletteId: 'crimson-gold',
  customColor: null,
  flower: 'lotus',
  background: 'autumn',
  teacherName: '',
  senderName: '',
  wishStyle: 'warm',
  wishText:
    'Nhân ngày Nhà giáo Việt Nam 20/11, em xin kính chúc thầy/cô luôn mạnh khỏe, giữ mãi ngọn lửa nhiệt huyết và tiếp tục dìu dắt nhiều thế hệ học trò trưởng thành.',
};

export const MAX_NAME_LENGTH = 60;
export const MAX_WISH_LENGTH = 300;

export const STORAGE_KEYS = {
  DRAFT: 'xuong_thiep_2011_draft_v1',
  API_KEY: 'xuong_thiep_2011_gemini_api_key',
};

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function mixHex(hex1: string, hex2: string, weight1: number): string {
  const c1 = hexToRgb(hex1);
  const c2 = hexToRgb(hex2);
  if (!c1 || !c2) return hex1;
  const w = Math.max(0, Math.min(1, weight1));
  const r = Math.round(c1.r * w + c2.r * (1 - w));
  const g = Math.round(c1.g * w + c2.g * (1 - w));
  const b = Math.round(c1.b * w + c2.b * (1 - w));
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

function getLuminance(hex: string): number {
  const c = hexToRgb(hex);
  if (!c) return 0.5;
  const [r, g, b] = [c.r, c.g, c.b].map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export interface ResolvedCardTheme {
  primary: string;
  accent: string;
  paper: string;
  textMain: string;
  textMuted: string;
  border: string;
  isDarkCanvas: boolean;
  softTint: string;
}

export function resolveCardTheme(state: CardState): ResolvedCardTheme {
  const base =
    COLOR_PALETTES.find((p) => p.id === state.paletteId) ?? COLOR_PALETTES[0];

  let primary = base.primary;
  let accent = base.accent;
  let paper = base.paper;
  let textMain = base.textMain;
  let textMuted = base.textMuted;
  let border = base.border;

  if (state.customColor) {
    const custom = state.customColor;
    const lum = getLuminance(custom);
    // Ensure primary has rich readability on light paper
    primary = lum > 0.55 ? mixHex(custom, '#1C1410', 0.45) : custom;
    accent = mixHex(custom, '#C59B48', 0.45);
    paper = mixHex(custom, '#FCF9F3', 0.04);
    border = mixHex(custom, '#DDD3C3', 0.28);
  }

  const isDarkCanvas = state.background === 'blackboard';

  if (isDarkCanvas) {
    return {
      primary: '#F5DFB0',
      accent: '#E2B86B',
      paper: '#1B332A',
      textMain: '#F8F5EC',
      textMuted: '#C7D3CB',
      border: '#5A7D6D',
      isDarkCanvas: true,
      softTint: 'rgba(245, 223, 176, 0.12)',
    };
  }

  return {
    primary,
    accent,
    paper,
    textMain,
    textMuted,
    border,
    isDarkCanvas: false,
    softTint: mixHex(primary, '#FFFFFF', 0.08),
  };
}
