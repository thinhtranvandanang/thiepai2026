import React from 'react';
import { Download, Share2, X } from 'lucide-react';

interface ShareFallbackModalProps {
  isOpen: boolean;
  previewDataUrl: string | null;
  onClose: () => void;
  onDownload: () => void;
}

export const ShareFallbackModal: React.FC<ShareFallbackModalProps> = ({
  isOpen,
  previewDataUrl,
  onClose,
  onDownload,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1511]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-modal-title"
    >
      <div className="w-full max-w-md rounded-2xl bg-[#FFFDF9] border border-[#E2D8C8] shadow-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#ECE4D7] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Share2 className="w-5 h-5 text-[#8B1E24]" />
            <h2 id="share-modal-title" className="font-display-serif text-lg font-bold text-[#231B16]">
              Chia sẻ thiệp 20/11
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng hướng dẫn chia sẻ"
            className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#6E6056] hover:bg-[#F3ECE1] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-sm text-[#4D4037] leading-relaxed">
            Trình duyệt hiện tại chưa hỗ trợ chia sẻ tệp ảnh trực tiếp. Bạn hãy tải ảnh thiệp về
            máy rồi gửi qua Zalo, Messenger hoặc Facebook theo 3 bước đơn giản sau:
          </p>

          {previewDataUrl && (
            <div className="mx-auto w-40 aspect-[4/5] rounded-xl overflow-hidden border border-[#E2D8C8] shadow-xs">
              <img
                src={previewDataUrl}
                alt="Bản xem trước thiệp 20/11 đã xuất"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <ol className="text-sm text-[#3D322B] space-y-2 bg-[#F6F0E6] rounded-xl p-4 list-decimal list-inside">
            <li>Bấm nút <strong>“Tải ảnh PNG về máy”</strong> bên dưới.</li>
            <li>Mở cuộc trò chuyện Zalo, Messenger hoặc bài đăng Facebook.</li>
            <li>Chọn biểu tượng gửi ảnh và đính kèm tệp ảnh vừa lưu.</li>
          </ol>

          <div className="flex items-center justify-end gap-2.5 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D7CBB9] text-sm font-medium text-[#4D4037] hover:bg-[#F3ECE1] cursor-pointer whitespace-nowrap"
            >
              Đóng
            </button>
            <button
              type="button"
              onClick={() => {
                onDownload();
                onClose();
              }}
              className="min-h-[44px] px-5 py-2 rounded-xl bg-[#8B1E24] text-white text-sm font-semibold flex items-center gap-2 hover:bg-[#73161B] cursor-pointer whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              <span>Tải ảnh PNG về máy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
