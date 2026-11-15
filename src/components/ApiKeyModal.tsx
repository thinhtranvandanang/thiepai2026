import React, { useEffect, useState } from 'react';
import { Eye, EyeOff, KeyRound, ShieldAlert, Trash2, X } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  currentKey: string;
  onClose: () => void;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  currentKey,
  onClose,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputKey(currentKey);
      setShowKey(false);
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    onSaveKey('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1511]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="api-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] border border-[#E2D8C8] shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#ECE4D7] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <KeyRound className="w-5 h-5 text-[#8B1E24]" />
            <h2 id="api-modal-title" className="font-display-serif text-lg font-bold text-[#231B16]">
              Cài đặt Gemini API Key
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ cài đặt"
            className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#6E6056] hover:bg-[#F3ECE1] hover:text-[#231B16] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="text-sm text-[#4D4037] leading-relaxed space-y-1.5">
            <p>
              Tính năng <strong>“Gợi ý lời chúc bằng AI”</strong> đã được tích hợp sẵn để dùng
              ngay. Bạn chỉ cần nhập khóa bên dưới nếu muốn dùng khóa Gemini API cá nhân riêng.
            </p>
            <p className="text-xs text-[#6E6056]">
              Có thể tạo khóa miễn phí tại Google AI Studio (aistudio.google.com/apikey). Để trống
              ô nhập nếu muốn dùng dịch vụ AI mặc định của ứng dụng.
            </p>
          </div>

          {/* Security warning box */}
          <div className="rounded-xl bg-[#FDF4E7] border border-[#E7CFA6] p-3.5 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-[#9A5B13] shrink-0 mt-0.5" />
            <div className="text-xs text-[#5E3A10] leading-relaxed">
              <div className="font-semibold mb-1">Cảnh báo bảo mật quan trọng</div>
              <p>
                Ứng dụng chạy hoàn toàn trên trình duyệt và không có máy chủ trung gian. Khóa API
                được lưu trong <strong>localStorage</strong> trên thiết bị này. Không nhập khóa
                trên máy tính công cộng và hãy xóa khóa sau khi dùng xong nếu dùng thiết bị lạ.
              </p>
            </div>
          </div>

          {/* Input */}
          <div>
            <label
              htmlFor="gemini-api-key-input"
              className="block text-sm font-medium text-[#231B16] mb-1.5"
            >
              Khóa Gemini API của bạn
            </label>
            <div className="relative">
              <input
                id="gemini-api-key-input"
                type={showKey ? 'text' : 'password'}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Dán khóa bắt đầu bằng AIza..."
                autoComplete="off"
                className="w-full min-h-[44px] pl-3.5 pr-11 py-2.5 rounded-xl border border-[#D6CABA] bg-white text-sm text-[#231B16] placeholder:text-[#9A8E83] focus:outline-none focus:border-[#8B1E24] focus:ring-2 focus:ring-[#8B1E24]/15"
              />
              <button
                type="button"
                onClick={() => setShowKey((v) => !v)}
                aria-label={showKey ? 'Ẩn khóa API' : 'Hiện khóa API'}
                title={showKey ? 'Ẩn khóa API' : 'Hiện khóa API'}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 min-h-[38px] min-w-[38px] rounded-lg flex items-center justify-center text-[#6E6056] hover:bg-[#F3ECE1] cursor-pointer"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-2.5">
            {currentKey ? (
              <button
                type="button"
                onClick={handleClear}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#E3C8C8] text-[#8B1E24] text-sm font-medium flex items-center justify-center gap-1.5 hover:bg-[#FDF2F2] transition-colors cursor-pointer whitespace-nowrap"
              >
                <Trash2 className="w-4 h-4" />
                <span>Xóa khóa đã lưu</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2.5 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D7CBB9] text-sm font-medium text-[#4D4037] hover:bg-[#F3ECE1] transition-colors cursor-pointer whitespace-nowrap"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="min-h-[44px] px-5 py-2 rounded-xl bg-[#8B1E24] text-white text-sm font-semibold hover:bg-[#73161B] transition-colors cursor-pointer whitespace-nowrap"
              >
                Lưu khóa API
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
