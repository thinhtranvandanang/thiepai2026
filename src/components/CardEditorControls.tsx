import React from 'react';
import {
  AlertCircle,
  Check,
  Download,
  KeyRound,
  Loader2,
  Mail,
  Pipette,
  RefreshCw,
  RotateCcw,
  Share2,
  Sparkles,
} from 'lucide-react';
import {
  BACKGROUND_OPTIONS,
  CARD_TEMPLATES,
  COLOR_PALETTES,
  CardState,
  FLOWER_OPTIONS,
  MAX_NAME_LENGTH,
  MAX_WISH_LENGTH,
  WISH_STYLES,
} from '../types/card';
import { ScaledCardPreview } from './CardCanvas';
import { FloralArt } from './vectors/FloralArt';

export interface FieldErrors {
  teacherName?: string;
  senderName?: string;
}

interface CardEditorControlsProps {
  state: CardState;
  errors: FieldErrors;
  hasApiKey: boolean;
  aiLoading: boolean;
  aiError: string | null;
  aiSuggestions: string[];
  exporting: boolean;
  sharing: boolean;
  preparingGmail: boolean;
  gmailUserEmail: string | null;
  teacherInputRef: React.RefObject<HTMLInputElement | null>;
  senderInputRef: React.RefObject<HTMLInputElement | null>;
  onChange: <K extends keyof CardState>(key: K, value: CardState[K]) => void;
  onGenerateWishes: () => void;
  onOpenApiModal: () => void;
  onDownloadPng: () => void;
  onShareCard: () => void;
  onOpenGmailSend: () => void;
  onRequestReset: () => void;
}

export const CardEditorControls: React.FC<CardEditorControlsProps> = ({
  state,
  errors,
  hasApiKey,
  aiLoading,
  aiError,
  aiSuggestions,
  exporting,
  sharing,
  preparingGmail,
  gmailUserEmail,
  teacherInputRef,
  senderInputRef,
  onChange,
  onGenerateWishes,
  onOpenApiModal,
  onDownloadPng,
  onShareCard,
  onOpenGmailSend,
  onRequestReset,
}) => {
  return (
    <div className="space-y-8 pb-8">
      {/* 01. Chọn mẫu thiệp */}
      <section
        id="buoc-mau-thiep"
        className="rounded-2xl bg-white border border-[#E5DCCD] p-5 sm:p-6 shadow-[0_2px_12px_-6px_rgba(45,25,15,0.08)]"
      >
        <div className="mb-4">
          <h2 className="font-display-serif text-xl font-bold text-[#231B16]">
            01. Chọn mẫu thiệp
          </h2>
          <p className="text-sm text-[#6E6056] mt-0.5">
            Chọn 1 trong 6 bố cục thiệp 20/11 được thiết kế sẵn theo tỉ lệ 4:5.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
          {CARD_TEMPLATES.map((tpl) => {
            const isSelected = state.templateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChange('templateId', tpl.id)}
                className={`group text-left rounded-xl p-2 border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8B1E24] ${
                  isSelected
                    ? 'border-[#8B1E24] bg-[#FDF7F5] ring-2 ring-[#8B1E24]/20'
                    : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9B9A3]'
                }`}
              >
                <div className="relative rounded-lg overflow-hidden border border-[#E6DDD0] bg-white">
                  <ScaledCardPreview
                    state={{
                      ...state,
                      templateId: tpl.id,
                    }}
                  />
                  {isSelected && (
                    <span
                      aria-hidden="true"
                      className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#8B1E24] text-white flex items-center justify-center shadow-sm"
                    >
                      <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                    </span>
                  )}
                </div>
                <div className="mt-2 px-0.5">
                  <div className="text-xs sm:text-sm font-semibold text-[#231B16] truncate">
                    {tpl.name}
                  </div>
                  <div className="text-[11px] text-[#6E6056] truncate">{tpl.subtitle}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02. Màu sắc, hoa & hình nền */}
      <section
        id="buoc-trang-tri"
        className="rounded-2xl bg-white border border-[#E5DCCD] p-5 sm:p-6 shadow-[0_2px_12px_-6px_rgba(45,25,15,0.08)] space-y-7"
      >
        <div>
          <h2 className="font-display-serif text-xl font-bold text-[#231B16]">
            02. Màu sắc, hoa & hình nền
          </h2>
          <p className="text-sm text-[#6E6056] mt-0.5">
            Mọi thay đổi hiển thị ngay trên bản xem trước theo thời gian thực.
          </p>
        </div>

        {/* Màu sắc chủ đạo */}
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <label className="text-sm font-semibold text-[#231B16]">
              Màu sắc chủ đạo <span className="text-[#8B1E24]">*</span>
            </label>
            {state.customColor && (
              <button
                type="button"
                onClick={() => onChange('customColor', null)}
                className="text-xs font-medium text-[#8B1E24] hover:underline cursor-pointer"
              >
                Dùng lại bảng màu gợi ý
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {COLOR_PALETTES.map((palette) => {
              const isSelected = !state.customColor && state.paletteId === palette.id;
              return (
                <button
                  key={palette.id}
                  type="button"
                  onClick={() => {
                    onChange('customColor', null);
                    onChange('paletteId', palette.id);
                  }}
                  className={`min-h-[48px] px-3 py-2 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#8B1E24] bg-[#FDF7F5] ring-2 ring-[#8B1E24]/15'
                      : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9B9A3]'
                  }`}
                >
                  <span className="flex items-center shrink-0">
                    <span
                      className="w-5 h-5 rounded-full border border-black/10"
                      style={{ backgroundColor: palette.primary }}
                    />
                    <span
                      className="w-4 h-4 rounded-full border border-black/10 -ml-1.5"
                      style={{ backgroundColor: palette.accent }}
                    />
                  </span>
                  <span className="text-xs font-medium text-[#231B16] leading-tight line-clamp-2">
                    {palette.name}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom color picker */}
          <div className="pt-1 flex flex-wrap items-center gap-3">
            <label
              htmlFor="custom-color-picker"
              className={`min-h-[44px] px-3.5 py-2 rounded-xl border inline-flex items-center gap-2.5 text-xs sm:text-sm font-medium cursor-pointer transition-colors ${
                state.customColor
                  ? 'border-[#8B1E24] bg-[#FDF7F5] text-[#8B1E24]'
                  : 'border-[#D7CBB9] bg-[#FAF7F2] text-[#4D4037] hover:bg-[#F3ECE1]'
              }`}
            >
              <Pipette className="w-4 h-4 shrink-0" />
              <span>Chọn màu tùy chỉnh</span>
              <input
                id="custom-color-picker"
                type="color"
                value={state.customColor ?? '#8B1E24'}
                onChange={(e) => onChange('customColor', e.target.value)}
                className="w-6 h-6 rounded border-0 bg-transparent p-0 cursor-pointer"
              />
            </label>
            {state.customColor && (
              <span className="text-xs font-mono text-[#6E6056] tabular-nums">
                Mã màu: {state.customColor.toUpperCase()}
              </span>
            )}
          </div>

          {state.background === 'blackboard' && (
            <p className="text-xs text-[#5B5047]">
              Lưu ý: Khi chọn nền “Bảng đen”, chữ trên thiệp tự động chuyển sang màu phấn sáng để
              đảm bảo độ rõ nét.
            </p>
          )}
        </div>

        <hr className="border-[#EFE8DC]" />

        {/* Loại hoa */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[#231B16]">Loại hoa trang trí (tùy chọn)</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {FLOWER_OPTIONS.map((item) => {
              const isSelected = state.flower === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange('flower', item.id)}
                  className={`min-h-[56px] p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#8B1E24] bg-[#FDF7F5] ring-2 ring-[#8B1E24]/15'
                      : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9B9A3]'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-white border border-[#EAE2D6] flex items-center justify-center shrink-0 overflow-hidden">
                    {item.id === 'none' ? (
                      <span className="text-xs text-[#9A8E83]">Trống</span>
                    ) : (
                      <FloralArt
                        flower={item.id}
                        primary="#8B1E24"
                        accent="#B68938"
                        className="w-9 h-9"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs sm:text-sm font-semibold text-[#231B16] truncate">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#6E6056] truncate">{item.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <hr className="border-[#EFE8DC]" />

        {/* Hình nền */}
        <div className="space-y-3">
          <div className="text-sm font-semibold text-[#231B16]">Hình nền minh họa (tùy chọn)</div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {BACKGROUND_OPTIONS.map((bg) => {
              const isSelected = state.background === bg.id;
              return (
                <button
                  key={bg.id}
                  type="button"
                  onClick={() => onChange('background', bg.id)}
                  className={`min-h-[54px] px-3.5 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#8B1E24] bg-[#FDF7F5] ring-2 ring-[#8B1E24]/15'
                      : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9B9A3]'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold text-[#231B16]">{bg.label}</div>
                  <div className="text-[11px] text-[#6E6056] mt-0.5 leading-snug">
                    {bg.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 03. Tên thầy cô & người gửi */}
      <section
        id="buoc-thong-tin"
        className="rounded-2xl bg-white border border-[#E5DCCD] p-5 sm:p-6 shadow-[0_2px_12px_-6px_rgba(45,25,15,0.08)] space-y-5"
      >
        <div>
          <h2 className="font-display-serif text-xl font-bold text-[#231B16]">
            03. Tên thầy cô và người gửi
          </h2>
          <p className="text-sm text-[#6E6056] mt-0.5">
            Nhập tên để hiển thị trực tiếp lên thiệp (bắt buộc trước khi tải hoặc chia sẻ).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Tên thầy cô */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="teacher-name-input" className="text-sm font-semibold text-[#231B16]">
                Tên thầy cô <span className="text-[#8B1E24]">*</span>
              </label>
              <span className="text-xs text-[#6E6056] tabular-nums">
                {state.teacherName.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
            <input
              ref={teacherInputRef}
              id="teacher-name-input"
              type="text"
              maxLength={MAX_NAME_LENGTH}
              value={state.teacherName}
              onChange={(e) => onChange('teacherName', e.target.value)}
              placeholder="Ví dụ: Cô Nguyễn Thu Hà"
              aria-invalid={Boolean(errors.teacherName)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#231B16] placeholder:text-[#9A8E83] focus:outline-none focus:ring-2 ${
                errors.teacherName
                  ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/15'
                  : 'border-[#D6CABA] focus:border-[#8B1E24] focus:ring-[#8B1E24]/15'
              }`}
            />
            {errors.teacherName && (
              <p className="mt-1.5 text-xs text-[#B91C1C] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.teacherName}</span>
              </p>
            )}
          </div>

          {/* Tên người gửi */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="sender-name-input" className="text-sm font-semibold text-[#231B16]">
                Tên người gửi <span className="text-[#8B1E24]">*</span>
              </label>
              <span className="text-xs text-[#6E6056] tabular-nums">
                {state.senderName.length}/{MAX_NAME_LENGTH}
              </span>
            </div>
            <input
              ref={senderInputRef}
              id="sender-name-input"
              type="text"
              maxLength={MAX_NAME_LENGTH}
              value={state.senderName}
              onChange={(e) => onChange('senderName', e.target.value)}
              placeholder="Ví dụ: Em Minh Anh - Lớp 10A2"
              aria-invalid={Boolean(errors.senderName)}
              className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border bg-white text-sm text-[#231B16] placeholder:text-[#9A8E83] focus:outline-none focus:ring-2 ${
                errors.senderName
                  ? 'border-[#B91C1C] focus:border-[#B91C1C] focus:ring-[#B91C1C]/15'
                  : 'border-[#D6CABA] focus:border-[#8B1E24] focus:ring-[#8B1E24]/15'
              }`}
            />
            {errors.senderName && (
              <p className="mt-1.5 text-xs text-[#B91C1C] flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.senderName}</span>
              </p>
            )}
          </div>
        </div>
      </section>

      {/* 04. Lời chúc & Gợi ý AI */}
      <section
        id="buoc-loi-chuc"
        className="rounded-2xl bg-white border border-[#E5DCCD] p-5 sm:p-6 shadow-[0_2px_12px_-6px_rgba(45,25,15,0.08)] space-y-5"
      >
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h2 className="font-display-serif text-xl font-bold text-[#231B16]">
              04. Lời chúc tri ân & Gợi ý AI
            </h2>
            <p className="text-sm text-[#6E6056] mt-0.5">
              Chọn phong cách để AI viết giúp 3 lời chúc, hoặc tự soạn theo ý bạn.
            </p>
          </div>
          <button
            type="button"
            onClick={onOpenApiModal}
            className="min-h-[40px] px-3 py-1.5 rounded-lg border border-[#D7CBB9] bg-[#FAF7F2] text-xs font-medium text-[#4D4037] hover:bg-[#F1E9DC] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#8B1E24]" />
            <span>{hasApiKey ? 'Đang dùng khóa riêng · Đổi' : 'Cài đặt khóa AI'}</span>
          </button>
        </div>

        {/* Phong cách lời chúc */}
        <div className="space-y-2.5">
          <div className="text-sm font-semibold text-[#231B16]">
            Phong cách lời chúc <span className="text-[#8B1E24]">*</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {WISH_STYLES.map((style) => {
              const isSelected = state.wishStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => onChange('wishStyle', style.id)}
                  className={`min-h-[50px] px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#8B1E24] bg-[#FDF7F5] ring-2 ring-[#8B1E24]/15'
                      : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9B9A3]'
                  }`}
                >
                  <div className="text-xs sm:text-sm font-semibold text-[#231B16]">
                    {style.label}
                  </div>
                  <div className="text-[11px] text-[#6E6056]">{style.hint}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* AI Generate CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={onGenerateWishes}
            disabled={aiLoading}
            className="min-h-[46px] px-5 py-2.5 rounded-xl bg-[#9A6E24] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#825B1B] disabled:opacity-65 transition-colors cursor-pointer whitespace-nowrap"
          >
            {aiLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang tạo 3 lời chúc AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Gợi ý lời chúc bằng AI</span>
              </>
            )}
          </button>
          <span className="text-xs text-[#6E6056]">
            Tạo 3 phương án khác nhau theo tên thầy cô và phong cách đã chọn.
          </span>
        </div>

        {/* AI Error with retry */}
        {aiError && (
          <div
            role="alert"
            className="rounded-xl bg-[#FDF2F2] border border-[#E8C0C0] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="flex items-start gap-2.5 text-sm text-[#7F1D1D]">
              <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
              <span>{aiError}</span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {!hasApiKey && (
                <button
                  type="button"
                  onClick={onOpenApiModal}
                  className="min-h-[40px] px-3.5 py-2 rounded-lg bg-[#8B1E24] text-white text-xs font-semibold hover:bg-[#73161B] cursor-pointer whitespace-nowrap"
                >
                  Cài đặt API Key
                </button>
              )}
              <button
                type="button"
                onClick={onGenerateWishes}
                className="min-h-[40px] px-3.5 py-2 rounded-lg border border-[#D8A5A5] bg-white text-[#7F1D1D] text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-[#FAF0F0] cursor-pointer whitespace-nowrap"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Thử lại</span>
              </button>
            </div>
          </div>
        )}

        {/* 3 AI Suggestions */}
        {aiSuggestions.length > 0 && (
          <div className="space-y-2.5">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#6E6056]">
              Chọn 1 lời chúc gợi ý bên dưới (có thể sửa lại sau)
            </div>
            <div className="space-y-2.5">
              {aiSuggestions.map((wish, idx) => {
                const isActive = state.wishText.trim() === wish.trim();
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onChange('wishText', wish)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'border-[#8B1E24] bg-[#FDF7F5] ring-2 ring-[#8B1E24]/15'
                        : 'border-[#E6DDD0] bg-[#FAF7F2] hover:border-[#C9B9A3]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-xs font-semibold text-[#8B1E24]">
                        Gợi ý {idx + 1}
                      </span>
                      <span className="text-[11px] text-[#6E6056] tabular-nums">
                        {wish.length} ký tự
                      </span>
                    </div>
                    <p className="font-body-serif text-sm text-[#231B16] leading-relaxed">
                      {wish}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Editable wish textarea */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="wish-textarea" className="text-sm font-semibold text-[#231B16]">
              Nội dung lời chúc trên thiệp (tùy chọn)
            </label>
            <span className="text-xs text-[#6E6056] tabular-nums">
              {state.wishText.length}/{MAX_WISH_LENGTH}
            </span>
          </div>
          <textarea
            id="wish-textarea"
            rows={4}
            maxLength={MAX_WISH_LENGTH}
            value={state.wishText}
            onChange={(e) => onChange('wishText', e.target.value)}
            placeholder="Nhập lời chúc tri ân thầy cô tại đây hoặc bấm nút Gợi ý lời chúc bằng AI..."
            className="w-full p-3.5 rounded-xl border border-[#D6CABA] bg-white font-body-serif text-sm text-[#231B16] leading-relaxed placeholder:text-[#9A8E83] focus:outline-none focus:border-[#8B1E24] focus:ring-2 focus:ring-[#8B1E24]/15 resize-y"
          />
          {state.wishText.length > 0 && (
            <div className="mt-1.5 flex justify-end">
              <button
                type="button"
                onClick={() => onChange('wishText', '')}
                className="text-xs text-[#6E6056] hover:text-[#8B1E24] cursor-pointer"
              >
                Xóa nội dung để viết mới
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 05. Xuất thiệp & Chia sẻ */}
      <section
        id="buoc-xuat-thiep"
        className="rounded-2xl bg-white border border-[#E5DCCD] p-5 sm:p-6 shadow-[0_2px_12px_-6px_rgba(45,25,15,0.08)] space-y-4"
      >
        <div>
          <h2 className="font-display-serif text-xl font-bold text-[#231B16]">
            05. Tải về & Chia sẻ thiệp
          </h2>
          <p className="text-sm text-[#6E6056] mt-0.5">
            Xuất ảnh PNG độ phân giải cao (1200×1500 px, đúng tỉ lệ 4:5), không cắt chữ.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={onDownloadPng}
            disabled={exporting || sharing || preparingGmail}
            className="min-h-[48px] px-4 py-3 rounded-xl bg-[#8B1E24] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#73161B] disabled:opacity-65 transition-colors cursor-pointer whitespace-nowrap"
          >
            {exporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xuất ảnh...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Tải ảnh PNG</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenGmailSend}
            disabled={exporting || sharing || preparingGmail}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-[#8B1E24] bg-[#8B1E24]/5 text-[#8B1E24] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#8B1E24]/12 disabled:opacity-65 transition-colors cursor-pointer whitespace-nowrap"
          >
            {preparingGmail ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang chuẩn bị...</span>
              </>
            ) : (
              <>
                <Mail className="w-4 h-4" />
                <span>{gmailUserEmail ? 'Gửi qua Gmail' : 'Đăng nhập & Gửi Gmail'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onShareCard}
            disabled={exporting || sharing || preparingGmail}
            className="min-h-[48px] px-4 py-3 rounded-xl border border-[#D7CBB9] bg-[#FAF7F2] text-[#3E322B] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[#F1E9DC] disabled:opacity-65 transition-colors cursor-pointer whitespace-nowrap"
          >
            {sharing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang chuẩn bị...</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ khác</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2 border-t border-[#EFE8DC] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs text-[#6E6056]">
            {gmailUserEmail
              ? `Đã kết nối Gmail: ${gmailUserEmail} · Bản nháp tự động lưu.`
              : 'Bản nháp được tự động lưu trên trình duyệt của bạn.'}
          </span>
          <button
            type="button"
            onClick={onRequestReset}
            className="min-h-[40px] px-3.5 py-2 rounded-lg text-xs font-semibold text-[#5E5047] hover:bg-[#F3ECE1] hover:text-[#231B16] inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Tạo thiệp mới</span>
          </button>
        </div>
      </section>
    </div>
  );
};
