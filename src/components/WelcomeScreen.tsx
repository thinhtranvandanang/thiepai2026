import React from 'react';
import { ArrowRight, BookOpen, Palette, Sparkles, Mail, LogOut } from 'lucide-react';
import { CardState, DEFAULT_CARD_STATE } from '../types/card';
import { ScaledCardPreview } from './CardCanvas';
import { GoogleSignInButton } from './GmailSendModal';

interface WelcomeScreenProps {
  hasSavedDraft: boolean;
  savedDraft: CardState;
  gmailEmail: string | null;
  gmailAuthLoading: boolean;
  onGoogleLogin: () => void;
  onGoogleLogout: () => void;
  onStart: () => void;
  onStartFresh: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  hasSavedDraft,
  savedDraft,
  gmailEmail,
  gmailAuthLoading,
  onGoogleLogin,
  onGoogleLogout,
  onStart,
  onStartFresh,
}) => {
  const showcaseState: CardState = hasSavedDraft
    ? savedDraft
    : {
        ...DEFAULT_CARD_STATE,
        teacherName: 'Cô Nguyễn Minh Hạnh',
        senderName: 'Tập thể lớp 12A1',
      };

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#231B16] flex flex-col">
      {/* Minimal clean header */}
      <header className="w-full border-b border-[#E6DDD0] bg-[#FAF6EF]/90">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <span className="font-display-serif text-base sm:text-xl font-bold tracking-tight text-[#8B1E24] whitespace-nowrap shrink-0">
            Xưởng tạo thiệp 20/11
          </span>

          {gmailEmail ? (
            <div className="flex items-center gap-2 min-w-0">
              <span className="hidden sm:inline text-xs text-[#55473E] truncate max-w-[200px]">
                Gmail: <strong className="text-[#231B16]">{gmailEmail}</strong>
              </span>
              <button
                type="button"
                onClick={onGoogleLogout}
                className="min-h-[38px] px-3 py-1.5 rounded-lg border border-[#D7CBB9] bg-white text-xs font-medium text-[#4D4037] hover:bg-[#F3ECE1] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Đăng xuất</span>
              </button>
            </div>
          ) : (
            <GoogleSignInButton
              onClick={onGoogleLogin}
              loading={gmailAuthLoading}
              label="Đăng nhập Gmail"
              className="!min-h-[38px] !px-3.5 !py-1.5 !text-xs !rounded-lg"
            />
          )}
        </div>
      </header>

      {/* Main editorial hero */}
      <main className="flex-1 flex items-center">
        <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left editorial copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9A6E24]">
              Ngày Nhà giáo Việt Nam · 20 tháng 11
            </div>

            <h1
              className="font-display-serif text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-[#231B16] leading-[1.15]"
              style={{ textWrap: 'balance' }}
            >
              Gửi trọn tấm lòng tri ân qua từng nét chữ 20/11
            </h1>

            <p className="font-body-serif text-base sm:text-lg text-[#55473E] leading-relaxed max-w-xl">
              Tự tay thiết kế tấm thiệp chúc mừng trang nhã dành tặng thầy cô chỉ trong vài
              phút. Chọn mẫu thiệp, phối sắc hoa, nhận gợi ý lời chúc từ AI, tải ảnh 4:5 hoặc
              gửi trực tiếp qua Gmail tới thầy cô.
            </p>

            {/* Primary CTA group */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={onStart}
                className="min-h-[48px] px-7 py-3.5 rounded-xl bg-[#8B1E24] text-[#FFFDF9] font-semibold text-base flex items-center justify-center gap-2.5 shadow-sm hover:bg-[#73161B] active:scale-[0.99] transition-all cursor-pointer whitespace-nowrap"
              >
                <span>{hasSavedDraft ? 'Tiếp tục thiết kế thiệp' : 'Bắt đầu tạo thiệp'}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              {hasSavedDraft && (
                <button
                  type="button"
                  onClick={onStartFresh}
                  className="min-h-[48px] px-5 py-3.5 rounded-xl border border-[#D7CBB9] bg-[#FFFFFF] text-[#4E3F35] font-medium text-sm hover:bg-[#F4EDE2] transition-colors cursor-pointer whitespace-nowrap"
                >
                  Tạo thiệp mới từ đầu
                </button>
              )}
            </div>

            {/* Clean unboxed workflow highlights */}
            <div className="pt-6 border-t border-[#E6DDD0] grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-[#8B1E24] shrink-0 mt-0.5" strokeWidth={1.7} />
                <div>
                  <div className="text-sm font-semibold text-[#231B16]">6 mẫu · 8 bảng màu</div>
                  <p className="text-xs text-[#6E6056] mt-0.5 leading-relaxed">
                    Phối hoa sen, hoa hồng, hướng dương và hình nền mái trường.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#9A6E24] shrink-0 mt-0.5" strokeWidth={1.7} />
                <div>
                  <div className="text-sm font-semibold text-[#231B16]">Gợi ý lời chúc AI</div>
                  <p className="text-xs text-[#6E6056] mt-0.5 leading-relaxed">
                    4 phong cách: Trang trọng, Thân mật, Hài hước, Ngắn gọn.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-[#426046] shrink-0 mt-0.5" strokeWidth={1.7} />
                <div>
                  <div className="text-sm font-semibold text-[#231B16]">Tải PNG & Gửi Gmail</div>
                  <p className="text-xs text-[#6E6056] mt-0.5 leading-relaxed">
                    Xuất ảnh 4:5 sắc nét hoặc đăng nhập Gmail gửi thẳng cho thầy cô.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right live showcase card */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="w-full max-w-[330px] sm:max-w-[360px] rounded-2xl p-3 bg-[#FFFFFF] border border-[#E5DCCD] shadow-[0_18px_45px_-20px_rgba(65,35,20,0.25)]">
              <div className="rounded-xl overflow-hidden border border-[#ECE4D7]">
                <ScaledCardPreview state={showcaseState} />
              </div>
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-[#6E6056]">
              <BookOpen className="w-3.5 h-3.5 text-[#9A6E24]" />
              <span>Xem trước mẫu thiệp · Tỉ lệ chuẩn 4:5</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
