import React, { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  Mail,
  Paperclip,
  Send,
  X,
} from 'lucide-react';
import {
  GmailSendError,
  sendCardViaGmail,
} from '../services/gmailService';

interface GoogleSignInButtonProps {
  onClick: () => void;
  loading?: boolean;
  label?: string;
  className?: string;
}

export const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  onClick,
  loading = false,
  label = 'Đăng nhập bằng Google',
  className = '',
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={loading}
    className={`gsi-material-button inline-flex items-center justify-center gap-3 min-h-[44px] px-5 py-2.5 rounded-xl bg-white border border-[#747775]/45 text-[#1F1F1F] text-sm font-medium shadow-xs hover:bg-[#F8F9FA] hover:border-[#747775]/70 active:bg-[#F1F3F4] disabled:opacity-65 transition-all cursor-pointer whitespace-nowrap ${className}`}
  >
    <span className="w-5 h-5 shrink-0 flex items-center justify-center">
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin text-[#4285F4]" />
      ) : (
        <svg
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 48 48"
          style={{ display: 'block', width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          <path
            fill="#EA4335"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#4285F4"
            d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
          />
          <path
            fill="#FBBC05"
            d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
          />
          <path
            fill="#34A853"
            d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </svg>
      )}
    </span>
    <span>{loading ? 'Đang kết nối Google...' : label}</span>
  </button>
);

interface GmailSendModalProps {
  isOpen: boolean;
  needsAuth: boolean;
  authLoading: boolean;
  user: User | null;
  teacherName: string;
  senderName: string;
  wishText: string;
  pngDataUrl: string | null;
  fileName: string;
  onClose: () => void;
  onGoogleLogin: () => Promise<void>;
  onGoogleLogout: () => Promise<void>;
  onRequireReauth: () => void;
  onSentSuccess: (recipientEmail: string) => void;
}

export const GmailSendModal: React.FC<GmailSendModalProps> = ({
  isOpen,
  needsAuth,
  authLoading,
  user,
  teacherName,
  senderName,
  wishText,
  pngDataUrl,
  fileName,
  onClose,
  onGoogleLogin,
  onGoogleLogout,
  onRequireReauth,
  onSentSuccess,
}) => {
  const [step, setStep] = useState<'compose' | 'confirm' | 'success'>('compose');
  const [toEmail, setToEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('compose');
      setFormError(null);
      setSending(false);
      setSubject(
        `Chúc mừng Ngày Nhà giáo Việt Nam 20/11 - Kính gửi ${teacherName.trim() || 'Thầy/Cô'}`
      );
      setMessageBody(
        wishText.trim() ||
          'Nhân dịp Ngày Nhà giáo Việt Nam 20/11, em xin kính chúc thầy/cô luôn mạnh khỏe, hạnh phúc và công tác tốt.'
      );
    }
  }, [isOpen, teacherName, wishText]);

  if (!isOpen) return null;

  const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!isValidEmail(toEmail)) {
      setFormError('Vui lòng nhập đúng địa chỉ email của thầy/cô (ví dụ: thayco@truong.edu.vn).');
      return;
    }
    if (!subject.trim()) {
      setFormError('Vui lòng nhập tiêu đề email.');
      return;
    }
    if (!pngDataUrl) {
      setFormError('Chưa có ảnh thiệp để đính kèm. Vui lòng đóng và thử lại.');
      return;
    }

    setStep('confirm');
  };

  const handleConfirmSend = async () => {
    if (!pngDataUrl) return;
    setSending(true);
    setFormError(null);
    try {
      await sendCardViaGmail({
        toEmail: toEmail.trim(),
        subject: subject.trim(),
        messageBody: messageBody.trim(),
        teacherName: teacherName.trim() || 'Thầy/Cô',
        senderName: senderName.trim() || user?.displayName || 'Học trò',
        pngDataUrl,
        fileName,
      });
      setStep('success');
      onSentSuccess(toEmail.trim());
    } catch (err) {
      if (err instanceof GmailSendError) {
        setFormError(err.message);
        if (err.needsReauth) {
          onRequireReauth();
        }
      } else {
        setFormError('Không thể gửi email lúc này. Vui lòng thử lại.');
      }
      setStep('compose');
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1511]/55 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="gmail-modal-title"
    >
      <div className="w-full max-w-lg rounded-2xl bg-[#FFFDF9] border border-[#E2D8C8] shadow-xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#ECE4D7] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <Mail className="w-5 h-5 text-[#8B1E24]" />
            <h2 id="gmail-modal-title" className="font-display-serif text-lg font-bold text-[#231B16]">
              Gửi thiệp 20/11 qua Gmail
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ gửi Gmail"
            className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#6E6056] hover:bg-[#F3ECE1] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {needsAuth ? (
            <div className="py-4 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#FDF4F2] border border-[#EBD2CC] flex items-center justify-center text-[#8B1E24]">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h3 className="font-display-serif text-lg font-bold text-[#231B16]">
                  Đăng nhập tài khoản Gmail
                </h3>
                <p className="text-sm text-[#5E5047] leading-relaxed">
                  Đăng nhập bằng Google để gửi trực tiếp tấm thiệp 20/11 (kèm ảnh PNG sắc nét) tới
                  hộp thư của thầy cô.
                </p>
              </div>

              {formError && (
                <div className="rounded-xl bg-[#FDF2F2] border border-[#E8C0C0] p-3 text-xs text-[#7F1D1D] flex items-start gap-2 text-left">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="pt-1 flex justify-center">
                <GoogleSignInButton onClick={onGoogleLogin} loading={authLoading} />
              </div>

              {pngDataUrl && (
                <div className="pt-3 border-t border-[#EFE8DC] flex items-center justify-center gap-3 text-xs text-[#6E6056]">
                  <img
                    src={pngDataUrl}
                    alt="Xem trước thiệp đính kèm"
                    className="w-12 aspect-[4/5] rounded border border-[#E2D8C8] object-cover"
                  />
                  <span className="text-left">
                    Thiệp đính kèm: <strong className="text-[#231B16]">{fileName}</strong>
                  </span>
                </div>
              )}
            </div>
          ) : step === 'compose' ? (
            <form onSubmit={handleProceedToConfirm} className="space-y-4">
              {/* Signed-in user bar */}
              <div className="rounded-xl bg-[#F6F0E6] border border-[#E5DCCD] p-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] text-[#6E6056]">Đang đăng nhập Gmail:</div>
                  <div className="text-sm font-semibold text-[#231B16] truncate">
                    {user?.email || user?.displayName}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onGoogleLogout}
                  className="min-h-[36px] px-3 py-1.5 rounded-lg border border-[#D7CBB9] bg-white text-xs font-medium text-[#4D4037] hover:bg-[#EFE7DA] inline-flex items-center gap-1.5 shrink-0 cursor-pointer whitespace-nowrap"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đổi tài khoản</span>
                </button>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="rounded-xl bg-[#FDF2F2] border border-[#E8C0C0] p-3 text-xs sm:text-sm text-[#7F1D1D] flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label
                  htmlFor="teacher-email-input"
                  className="block text-sm font-semibold text-[#231B16] mb-1.5"
                >
                  Email thầy cô nhận thiệp <span className="text-[#8B1E24]">*</span>
                </label>
                <input
                  id="teacher-email-input"
                  type="email"
                  required
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  placeholder="Ví dụ: coha.toan@truongthpt.edu.vn"
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#D6CABA] bg-white text-sm text-[#231B16] placeholder:text-[#9A8E83] focus:outline-none focus:border-[#8B1E24] focus:ring-2 focus:ring-[#8B1E24]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="gmail-subject-input"
                  className="block text-sm font-semibold text-[#231B16] mb-1.5"
                >
                  Tiêu đề email <span className="text-[#8B1E24]">*</span>
                </label>
                <input
                  id="gmail-subject-input"
                  type="text"
                  required
                  maxLength={150}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl border border-[#D6CABA] bg-white text-sm text-[#231B16] focus:outline-none focus:border-[#8B1E24] focus:ring-2 focus:ring-[#8B1E24]/15"
                />
              </div>

              <div>
                <label
                  htmlFor="gmail-body-input"
                  className="block text-sm font-semibold text-[#231B16] mb-1.5"
                >
                  Lời nhắn trong email
                </label>
                <textarea
                  id="gmail-body-input"
                  rows={3}
                  maxLength={600}
                  value={messageBody}
                  onChange={(e) => setMessageBody(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-[#D6CABA] bg-white font-body-serif text-sm text-[#231B16] leading-relaxed focus:outline-none focus:border-[#8B1E24] focus:ring-2 focus:ring-[#8B1E24]/15 resize-y"
                />
              </div>

              {/* Attachment preview */}
              {pngDataUrl && (
                <div className="rounded-xl border border-[#E5DCCD] bg-[#FAF7F2] p-3 flex items-center gap-3">
                  <img
                    src={pngDataUrl}
                    alt="Thiệp 20/11 đính kèm"
                    className="w-12 aspect-[4/5] rounded border border-[#D7CBB9] object-cover shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-[#231B16] flex items-center gap-1.5">
                      <Paperclip className="w-3.5 h-3.5 text-[#8B1E24] shrink-0" />
                      <span className="truncate">{fileName}</span>
                    </div>
                    <div className="text-[11px] text-[#6E6056] mt-0.5">
                      Ảnh thiệp PNG chất lượng cao (tỉ lệ 4:5) sẽ được đính kèm tự động.
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D7CBB9] text-sm font-medium text-[#4D4037] hover:bg-[#F3ECE1] cursor-pointer whitespace-nowrap"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#8B1E24] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#73161B] cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-4 h-4" />
                  <span>Tiếp tục xác nhận gửi</span>
                </button>
              </div>
            </form>
          ) : step === 'confirm' ? (
            <div className="space-y-4">
              <div className="rounded-xl bg-[#FDF4E7] border border-[#E7CFA6] p-4 space-y-2">
                <h3 className="text-sm font-bold text-[#5E3A10]">
                  Xác nhận gửi email qua Gmail?
                </h3>
                <p className="text-xs text-[#6B461B] leading-relaxed">
                  Hành động này sẽ gửi một email thật từ hộp thư Gmail của bạn tới người nhận bên
                  dưới. Vui lòng kiểm tra kỹ thông tin trước khi xác nhận.
                </p>
              </div>

              <dl className="rounded-xl border border-[#E5DCCD] bg-white divide-y divide-[#EFE8DC] text-sm">
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="text-[#6E6056] shrink-0">Từ tài khoản:</dt>
                  <dd className="font-medium text-[#231B16] text-right truncate">{user?.email}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="text-[#6E6056] shrink-0">Gửi tới:</dt>
                  <dd className="font-semibold text-[#8B1E24] text-right truncate">{toEmail.trim()}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="text-[#6E6056] shrink-0">Tiêu đề:</dt>
                  <dd className="font-medium text-[#231B16] text-right line-clamp-2">{subject.trim()}</dd>
                </div>
                <div className="px-4 py-2.5 flex justify-between gap-4">
                  <dt className="text-[#6E6056] shrink-0">Đính kèm:</dt>
                  <dd className="font-medium text-[#231B16] text-right truncate">{fileName}</dd>
                </div>
              </dl>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  disabled={sending}
                  onClick={() => setStep('compose')}
                  className="min-h-[44px] px-4 py-2 rounded-xl border border-[#D7CBB9] text-sm font-medium text-[#4D4037] hover:bg-[#F3ECE1] disabled:opacity-60 cursor-pointer whitespace-nowrap"
                >
                  Quay lại sửa
                </button>
                <button
                  type="button"
                  disabled={sending}
                  onClick={handleConfirmSend}
                  className="min-h-[44px] px-5 py-2 rounded-xl bg-[#8B1E24] text-white text-sm font-semibold inline-flex items-center gap-2 hover:bg-[#73161B] disabled:opacity-65 cursor-pointer whitespace-nowrap"
                >
                  {sending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Đang gửi email...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Xác nhận gửi email</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="py-5 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-[#EDF7F0] border border-[#C3E2CD] flex items-center justify-center text-[#2E6B42]">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1.5">
                <h3 className="font-display-serif text-xl font-bold text-[#231B16]">
                  Đã gửi thiệp qua Gmail thành công!
                </h3>
                <p className="text-sm text-[#5E5047] leading-relaxed">
                  Tấm thiệp 20/11 đã được gửi tới địa chỉ{' '}
                  <strong className="text-[#231B16]">{toEmail.trim()}</strong>.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="min-h-[44px] px-6 py-2 rounded-xl bg-[#8B1E24] text-white text-sm font-semibold hover:bg-[#73161B] cursor-pointer"
                >
                  Hoàn tất
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
