import React from 'react';
import { RotateCcw, X } from 'lucide-react';

interface ConfirmResetModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export const ConfirmResetModal: React.FC<ConfirmResetModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1511]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reset-modal-title"
    >
      <div className="w-full max-w-sm rounded-2xl bg-[#FFFDF9] border border-[#E2D8C8] shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#ECE4D7] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-[#8B1E24]" />
            <h2 id="reset-modal-title" className="font-display-serif text-lg font-bold text-[#231B16]">
              Tạo thiệp mới?
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Hủy"
            className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#6E6056] hover:bg-[#F3ECE1] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <p className="text-sm text-[#4D4037] leading-relaxed">
            Toàn bộ nội dung tên thầy cô, người gửi, lời chúc và tùy chỉnh hiện tại sẽ được đặt lại
            về mặc định. Khóa Gemini API của bạn vẫn được giữ nguyên.
          </p>
          <div className="flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onCancel}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D7CBB9] text-sm font-medium text-[#4D4037] hover:bg-[#F3ECE1] cursor-pointer whitespace-nowrap"
            >
              Giữ lại
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#8B1E24] text-white text-sm font-semibold hover:bg-[#73161B] cursor-pointer whitespace-nowrap"
            >
              Đặt lại mặc định
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
