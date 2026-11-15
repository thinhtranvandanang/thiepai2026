/**
 * ============================================================================
 * XƯỞNG TẠO THIỆP 20/11 — CHẠY HOÀN TOÀN TRÊN TRÌNH DUYỆT
 * ============================================================================
 * Hướng dẫn nhanh cấu hình Gemini API Key:
 * 1. Lấy khóa miễn phí tại Google AI Studio: https://aistudio.google.com/apikey
 * 2. Mở ứng dụng, bấm nút "Cài đặt AI" ở góc trên bên phải.
 * 3. Dán khóa API vào ô nhập và lưu lại. Khóa chỉ lưu cục bộ trong localStorage
 *    của trình duyệt (không có máy chủ riêng).
 * 4. Cảnh báo bảo mật: Không lưu khóa trên thiết bị công cộng; nên đặt giới hạn
 *    tên miền/hạn mức trên Google Cloud nếu chia sẻ rộng rãi.
 * ============================================================================
 */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import html2canvas from 'html2canvas';
import {
  CheckCircle2,
  Download,
  KeyRound,
  Mail,
  Maximize2,
  RotateCcw,
  Share2,
  X,
} from 'lucide-react';
import { ApiKeyModal } from './components/ApiKeyModal';
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  CardCanvas,
  ScaledCardPreview,
} from './components/CardCanvas';
import { CardEditorControls, FieldErrors } from './components/CardEditorControls';
import { ConfirmResetModal } from './components/ConfirmResetModal';
import { GmailSendModal } from './components/GmailSendModal';
import { ShareFallbackModal } from './components/ShareFallbackModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import {
  GeminiWishError,
  generateTeacherDayWishes,
  getSavedGeminiApiKey,
  saveGeminiApiKey,
} from './services/geminiService';
import {
  initGmailAuth,
  signInWithGmail,
  signOutGmail,
} from './services/gmailService';
import {
  CardState,
  DEFAULT_CARD_STATE,
  MAX_NAME_LENGTH,
  MAX_WISH_LENGTH,
  STORAGE_KEYS,
} from './types/card';

function loadDraftFromStorage(): { state: CardState; hasDraft: boolean } {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DRAFT);
    if (!raw) return { state: DEFAULT_CARD_STATE, hasDraft: false };
    const parsed = JSON.parse(raw) as Partial<CardState>;
    const merged: CardState = {
      ...DEFAULT_CARD_STATE,
      ...parsed,
      teacherName:
        typeof parsed.teacherName === 'string'
          ? parsed.teacherName.slice(0, MAX_NAME_LENGTH)
          : '',
      senderName:
        typeof parsed.senderName === 'string'
          ? parsed.senderName.slice(0, MAX_NAME_LENGTH)
          : '',
      wishText:
        typeof parsed.wishText === 'string'
          ? parsed.wishText.slice(0, MAX_WISH_LENGTH)
          : DEFAULT_CARD_STATE.wishText,
    };
    const hasMeaningfulChanges =
      Boolean(merged.teacherName.trim()) ||
      Boolean(merged.senderName.trim()) ||
      merged.wishText !== DEFAULT_CARD_STATE.wishText ||
      merged.templateId !== DEFAULT_CARD_STATE.templateId ||
      merged.paletteId !== DEFAULT_CARD_STATE.paletteId ||
      merged.flower !== DEFAULT_CARD_STATE.flower ||
      merged.background !== DEFAULT_CARD_STATE.background;

    return { state: merged, hasDraft: hasMeaningfulChanges };
  } catch {
    return { state: DEFAULT_CARD_STATE, hasDraft: false };
  }
}

function slugifyFileName(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 36);
}

export default function App() {
  const initialDraft = useRef(loadDraftFromStorage());
  const [showWelcome, setShowWelcome] = useState(true);
  const [cardState, setCardState] = useState<CardState>(initialDraft.current.state);
  const [hasSavedDraft, setHasSavedDraft] = useState(initialDraft.current.hasDraft);

  const [apiKey, setApiKey] = useState<string>(() => getSavedGeminiApiKey());
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const [errors, setErrors] = useState<FieldErrors>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);

  const [exporting, setExporting] = useState(false);
  const [sharing, setSharing] = useState(false);
  const [preparingGmail, setPreparingGmail] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [gmailNeedsAuth, setGmailNeedsAuth] = useState(true);
  const [gmailAuthLoading, setGmailAuthLoading] = useState(false);
  const [gmailUser, setGmailUser] = useState<User | null>(null);
  const [shareFallbackOpen, setShareFallbackOpen] = useState(false);
  const [exportedDataUrl, setExportedDataUrl] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const exportContainerRef = useRef<HTMLDivElement>(null);
  const teacherInputRef = useRef<HTMLInputElement>(null);
  const senderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = initGmailAuth(
      (user) => {
        setGmailUser(user);
        setGmailNeedsAuth(false);
      },
      (user) => {
        setGmailUser(user);
        setGmailNeedsAuth(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 3500);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  // Auto-save draft to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DRAFT, JSON.stringify(cardState));
    } catch {
      // Ignore storage quota errors
    }
  }, [cardState]);

  const handleFieldChange = useCallback(
    <K extends keyof CardState>(key: K, value: CardState[K]) => {
      setCardState((prev) => ({ ...prev, [key]: value }));
      if (key === 'teacherName' && typeof value === 'string' && value.trim()) {
        setErrors((prev) => ({ ...prev, teacherName: undefined }));
      }
      if (key === 'senderName' && typeof value === 'string' && value.trim()) {
        setErrors((prev) => ({ ...prev, senderName: undefined }));
      }
    },
    []
  );

  const validateRequiredNames = useCallback((): boolean => {
    const nextErrors: FieldErrors = {};
    if (!cardState.teacherName.trim()) {
      nextErrors.teacherName = 'Vui lòng nhập tên thầy hoặc cô.';
    }
    if (!cardState.senderName.trim()) {
      nextErrors.senderName = 'Vui lòng nhập tên người gửi thiệp.';
    }
    setErrors(nextErrors);

    if (nextErrors.teacherName) {
      teacherInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      teacherInputRef.current?.focus();
      return false;
    }
    if (nextErrors.senderName) {
      senderInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      senderInputRef.current?.focus();
      return false;
    }
    return true;
  }, [cardState.teacherName, cardState.senderName]);

  const handleSaveApiKey = (newKey: string) => {
    saveGeminiApiKey(newKey);
    setApiKey(newKey);
    setAiError(null);
    showToast(newKey ? 'Đã lưu Gemini API Key vào trình duyệt.' : 'Đã xóa khóa API khỏi trình duyệt.');
  };

  const handleGenerateWishes = async () => {
    setAiError(null);
    setAiLoading(true);
    try {
      const wishes = await generateTeacherDayWishes({
        teacherName: cardState.teacherName,
        senderName: cardState.senderName,
        wishStyle: cardState.wishStyle,
        apiKey,
      });
      setAiSuggestions(wishes);
      showToast('Đã tạo 3 lời chúc 20/11 bằng AI.');
    } catch (err) {
      if (err instanceof GeminiWishError) {
        setAiError(err.message);
      } else {
        setAiError('Không thể tạo gợi ý lời chúc lúc này. Vui lòng thử lại.');
      }
    } finally {
      setAiLoading(false);
    }
  };

  const renderCardToBlob = async (): Promise<{ blob: Blob; dataUrl: string }> => {
    const node = exportContainerRef.current;
    if (!node) {
      throw new Error('Không tìm thấy khung thiệp để xuất ảnh.');
    }

    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const canvas = await html2canvas(node, {
      scale: 2,
      width: CARD_WIDTH,
      height: CARD_HEIGHT,
      useCORS: true,
      allowTaint: false,
      backgroundColor: null,
      logging: false,
      onclone: (clonedDoc) => {
        // Remove Tailwind v4 stylesheets containing oklch() from cloned export document
        // because CardCanvas uses self-contained hex/rgba inline styles + Google Fonts.
        const styleTags = clonedDoc.querySelectorAll('style');
        styleTags.forEach((tag) => tag.remove());

        const linkTags = clonedDoc.querySelectorAll('link[rel="stylesheet"]');
        linkTags.forEach((link) => {
          const href = link.getAttribute('href') || '';
          if (!href.includes('fonts.googleapis.com')) {
            link.remove();
          }
        });

        const safeReset = clonedDoc.createElement('style');
        safeReset.textContent = `
          *, *::before, *::after { box-sizing: border-box; }
          html, body { margin: 0; padding: 0; background: transparent; }
        `;
        clonedDoc.head.appendChild(safeReset);
      },
    });

    const dataUrl = canvas.toDataURL('image/png', 1.0);
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Không thể tạo tệp ảnh PNG.'));
        },
        'image/png',
        1.0
      );
    });

    return { blob, dataUrl };
  };

  const triggerBlobDownload = (dataUrl: string) => {
    const slug = slugifyFileName(cardState.teacherName) || 'thay-co';
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `thiep-20-11-${slug}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadPng = async () => {
    if (!validateRequiredNames()) return;
    setExporting(true);
    try {
      const { dataUrl } = await renderCardToBlob();
      setExportedDataUrl(dataUrl);
      triggerBlobDownload(dataUrl);
      showToast('Đã tải ảnh thiệp PNG (tỉ lệ 4:5) về máy.');
    } catch {
      showToast('Xuất ảnh chưa thành công. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  const handleShareCard = async () => {
    if (!validateRequiredNames()) return;
    setSharing(true);
    try {
      const { blob, dataUrl } = await renderCardToBlob();
      setExportedDataUrl(dataUrl);

      const slug = slugifyFileName(cardState.teacherName) || 'thay-co';
      const file = new File([blob], `thiep-20-11-${slug}.png`, {
        type: 'image/png',
      });

      const shareData: ShareData = {
        title: 'Thiệp chúc mừng 20/11',
        text: `Thiệp tri ân Ngày Nhà giáo Việt Nam 20/11 gửi ${cardState.teacherName.trim()}`,
        files: [file],
      };

      if (
        typeof navigator !== 'undefined' &&
        typeof navigator.share === 'function' &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare({ files: [file] })
      ) {
        await navigator.share(shareData);
        showToast('Đã mở hộp thoại chia sẻ thiệp.');
      } else {
        setShareFallbackOpen(true);
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setShareFallbackOpen(true);
    } finally {
      setSharing(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGmailAuthLoading(true);
    try {
      const { user } = await signInWithGmail();
      setGmailUser(user);
      setGmailNeedsAuth(false);

      if (cardState.teacherName.trim() && cardState.senderName.trim()) {
        if (!exportedDataUrl) {
          const { dataUrl } = await renderCardToBlob();
          setExportedDataUrl(dataUrl);
        }
        showToast(`Đã đăng nhập Gmail: ${user.email || user.displayName}`);
      } else {
        setIsGmailModalOpen(false);
        showToast(
          `Đã đăng nhập Gmail (${user.email || user.displayName}). Nhập tên thầy cô & người gửi rồi bấm Gửi Gmail.`
        );
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '';
      if (msg.toLowerCase().includes('popup-closed-by-user')) {
        showToast('Bạn đã đóng cửa sổ đăng nhập Google.');
      } else {
        showToast('Đăng nhập Google chưa thành công. Vui lòng thử lại.');
      }
    } finally {
      setGmailAuthLoading(false);
    }
  };

  const handleGoogleLogout = async () => {
    await signOutGmail();
    setGmailUser(null);
    setGmailNeedsAuth(true);
    showToast('Đã đăng xuất tài khoản Gmail.');
  };

  const handleOpenGmailSend = async () => {
    if (!validateRequiredNames()) return;
    setPreparingGmail(true);
    try {
      const { dataUrl } = await renderCardToBlob();
      setExportedDataUrl(dataUrl);
      setIsGmailModalOpen(true);
    } catch {
      showToast('Không thể chuẩn bị ảnh thiệp để gửi Gmail. Vui lòng thử lại.');
    } finally {
      setPreparingGmail(false);
    }
  };

  const handleConfirmReset = () => {
    setCardState(DEFAULT_CARD_STATE);
    setErrors({});
    setAiSuggestions([]);
    setAiError(null);
    setExportedDataUrl(null);
    setHasSavedDraft(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.DRAFT);
    } catch {
      // Ignore storage errors
    }
    setIsResetModalOpen(false);
    showToast('Đã đặt lại toàn bộ về mẫu thiệp mặc định.');
  };

  if (showWelcome) {
    return (
      <WelcomeScreen
        hasSavedDraft={hasSavedDraft}
        savedDraft={cardState}
        gmailEmail={!gmailNeedsAuth ? gmailUser?.email || null : null}
        gmailAuthLoading={gmailAuthLoading}
        onGoogleLogin={handleGoogleLogin}
        onGoogleLogout={handleGoogleLogout}
        onStart={() => setShowWelcome(false)}
        onStartFresh={() => {
          setCardState(DEFAULT_CARD_STATE);
          setHasSavedDraft(false);
          try {
            localStorage.removeItem(STORAGE_KEYS.DRAFT);
          } catch {
            // Ignore storage errors
          }
          setShowWelcome(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF6EF] text-[#231B16] flex flex-col">
      {/* Top Bar Contract: Brand — Single-line nav links — Primary action */}
      <header className="sticky top-0 z-40 w-full bg-[#FAF6EF]/95 backdrop-blur-md border-b border-[#E5DCCD]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-6">
          <button
            type="button"
            onClick={() => setShowWelcome(true)}
            className="font-display-serif text-base sm:text-xl font-bold tracking-tight text-[#8B1E24] whitespace-nowrap shrink-0 cursor-pointer"
          >
            Xưởng tạo thiệp 20/11
          </button>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#5E5047]">
            <a
              href="#buoc-mau-thiep"
              className="hover:text-[#8B1E24] transition-colors whitespace-nowrap shrink-0"
            >
              Mẫu thiệp
            </a>
            <a
              href="#buoc-trang-tri"
              className="hover:text-[#8B1E24] transition-colors whitespace-nowrap shrink-0"
            >
              Trang trí
            </a>
            <a
              href="#buoc-thong-tin"
              className="hover:text-[#8B1E24] transition-colors whitespace-nowrap shrink-0"
            >
              Tên thầy cô
            </a>
            <a
              href="#buoc-loi-chuc"
              className="hover:text-[#8B1E24] transition-colors whitespace-nowrap shrink-0"
            >
              Lời chúc AI
            </a>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setIsApiModalOpen(true)}
              className="min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#D7CBB9] bg-white text-xs font-medium text-[#4D4037] hover:bg-[#F3ECE1] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#8B1E24] shrink-0" />
              <span className="sm:hidden">AI</span>
              <span className="hidden sm:inline">Cài đặt AI</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (gmailNeedsAuth) {
                  setIsGmailModalOpen(true);
                } else {
                  handleOpenGmailSend();
                }
              }}
              className="min-h-[38px] sm:min-h-[40px] px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#D7CBB9] bg-white text-xs font-medium text-[#4D4037] hover:bg-[#F3ECE1] inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 max-w-[115px] sm:max-w-[180px]"
            >
              <Mail className="w-3.5 h-3.5 text-[#8B1E24] shrink-0" />
              <span className="truncate">
                {!gmailNeedsAuth && gmailUser?.email
                  ? gmailUser.email
                  : 'Gmail'}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              className="hidden sm:inline-flex min-h-[40px] px-3 py-1.5 rounded-lg bg-[#8B1E24] text-white text-xs font-semibold items-center gap-1.5 hover:bg-[#73161B] cursor-pointer whitespace-nowrap shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Tạo thiệp mới</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Sticky Top Preview Tray (<=15% viewport height, expandable to full 4:5 view) */}
      <div className="lg:hidden sticky top-14 z-30 bg-[#F4EDE1]/95 backdrop-blur-md border-b border-[#E2D8C8] px-3 py-2">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={() => setIsZoomOpen(true)}
              aria-label="Phóng to xem trước thiệp"
              className="w-[48px] shrink-0 rounded-md overflow-hidden border border-[#D7CBB9] bg-white shadow-xs cursor-pointer"
            >
              <ScaledCardPreview state={cardState} />
            </button>
            <div className="min-w-0">
              <div className="text-xs font-semibold text-[#231B16] truncate">
                {cardState.teacherName.trim() || 'Thầy / Cô kính mến'}
              </div>
              <div className="text-[11px] text-[#6E6056] truncate">
                Từ: {cardState.senderName.trim() || 'Học trò của thầy/cô'}
              </div>
              <button
                type="button"
                onClick={() => setIsZoomOpen(true)}
                className="mt-0.5 text-[11px] font-semibold text-[#8B1E24] inline-flex items-center gap-1 cursor-pointer"
              >
                <Maximize2 className="w-3 h-3" />
                <span>Xem lớn</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleOpenGmailSend}
              disabled={exporting || preparingGmail}
              className="min-h-[38px] px-2.5 py-2 rounded-xl border border-[#8B1E24] bg-white text-[#8B1E24] text-xs font-semibold inline-flex items-center gap-1 shrink-0 hover:bg-[#FDF7F5] disabled:opacity-65 cursor-pointer whitespace-nowrap"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Gmail</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadPng}
              disabled={exporting || preparingGmail}
              className="min-h-[38px] px-3 py-2 rounded-xl bg-[#8B1E24] text-white text-xs font-semibold inline-flex items-center gap-1 shrink-0 hover:bg-[#73161B] disabled:opacity-65 cursor-pointer whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{exporting ? 'Xuất...' : 'Tải PNG'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-column Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Customization Steps */}
          <div className="lg:col-span-7">
            <CardEditorControls
              state={cardState}
              errors={errors}
              hasApiKey={Boolean(apiKey)}
              aiLoading={aiLoading}
              aiError={aiError}
              aiSuggestions={aiSuggestions}
              exporting={exporting}
              sharing={sharing}
              preparingGmail={preparingGmail}
              gmailUserEmail={!gmailNeedsAuth ? gmailUser?.email || null : null}
              teacherInputRef={teacherInputRef}
              senderInputRef={senderInputRef}
              onChange={handleFieldChange}
              onGenerateWishes={handleGenerateWishes}
              onOpenApiModal={() => setIsApiModalOpen(true)}
              onDownloadPng={handleDownloadPng}
              onShareCard={handleShareCard}
              onOpenGmailSend={handleOpenGmailSend}
              onRequestReset={() => setIsResetModalOpen(true)}
            />
          </div>

          {/* Right Column: Sticky Desktop Preview */}
          <aside className="hidden lg:block lg:col-span-5 lg:sticky lg:top-22">
            <div className="rounded-2xl bg-white border border-[#E5DCCD] p-5 shadow-[0_10px_32px_-16px_rgba(45,25,15,0.18)]">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-display-serif text-lg font-bold text-[#231B16]">
                  Xem trước thiệp
                </h2>
                <span className="text-xs text-[#6E6056] tabular-nums">
                  Tỉ lệ 4:5 · 1200×1500 px
                </span>
              </div>

              <div className="rounded-xl overflow-hidden border border-[#E6DDD0] bg-[#FAF6EF]">
                <ScaledCardPreview state={cardState} />
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  disabled={exporting || sharing || preparingGmail}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl bg-[#8B1E24] text-white text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#73161B] disabled:opacity-65 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Download className="w-4 h-4 shrink-0" />
                  <span>{exporting ? 'Đang xuất...' : 'Tải PNG'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleOpenGmailSend}
                  disabled={exporting || sharing || preparingGmail}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl border border-[#8B1E24] bg-[#FDF7F5] text-[#8B1E24] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F9EAE6] disabled:opacity-65 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span>{preparingGmail ? 'Đang tạo...' : 'Gửi Gmail'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleShareCard}
                  disabled={exporting || sharing || preparingGmail}
                  className="min-h-[44px] px-3 py-2.5 rounded-xl border border-[#D7CBB9] bg-[#FAF7F2] text-[#3E322B] text-xs font-semibold flex items-center justify-center gap-1.5 hover:bg-[#F1E9DC] disabled:opacity-65 transition-colors cursor-pointer whitespace-nowrap"
                >
                  <Share2 className="w-4 h-4 shrink-0" />
                  <span>{sharing ? 'Đang mở...' : 'Chia sẻ'}</span>
                </button>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Hidden canonical 600x750 off-screen card for crisp 2x html2canvas export */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          left: '-10000px',
          top: 0,
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          pointerEvents: 'none',
          zIndex: -1,
        }}
      >
        <div ref={exportContainerRef} style={{ width: `${CARD_WIDTH}px`, height: `${CARD_HEIGHT}px` }}>
          <CardCanvas state={cardState} id="export-card-canvas" />
        </div>
      </div>

      {/* Mobile Fullscreen Zoom Preview Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1D1511]/70 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Xem trước thiệp cỡ lớn"
        >
          <div className="w-full max-w-md rounded-2xl bg-[#FFFDF9] border border-[#E2D8C8] p-4 space-y-3 shadow-2xl">
            <div className="flex items-center justify-between">
              <span className="font-display-serif text-base font-bold text-[#231B16]">
                Xem trước thiệp 20/11 (4:5)
              </span>
              <button
                type="button"
                onClick={() => setIsZoomOpen(false)}
                aria-label="Đóng xem trước"
                className="min-h-[40px] min-w-[40px] rounded-lg flex items-center justify-center text-[#6E6056] hover:bg-[#F3ECE1] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="rounded-xl overflow-hidden border border-[#E6DDD0]">
              <ScaledCardPreview state={cardState} />
            </div>
            <div className="grid grid-cols-3 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsZoomOpen(false);
                  handleDownloadPng();
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl bg-[#8B1E24] text-white text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải PNG</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsZoomOpen(false);
                  handleOpenGmailSend();
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl border border-[#8B1E24] bg-[#FDF7F5] text-[#8B1E24] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Gửi Gmail</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsZoomOpen(false);
                  handleShareCard();
                }}
                className="min-h-[44px] px-3 py-2 rounded-xl border border-[#D7CBB9] bg-[#FAF7F2] text-[#3E322B] text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Chia sẻ</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        currentKey={apiKey}
        onClose={() => setIsApiModalOpen(false)}
        onSaveKey={handleSaveApiKey}
      />

      <GmailSendModal
        isOpen={isGmailModalOpen}
        needsAuth={gmailNeedsAuth}
        authLoading={gmailAuthLoading}
        user={gmailUser}
        teacherName={cardState.teacherName}
        senderName={cardState.senderName}
        wishText={cardState.wishText}
        pngDataUrl={exportedDataUrl}
        fileName={`thiep-20-11-${slugifyFileName(cardState.teacherName) || 'thay-co'}.png`}
        onClose={() => setIsGmailModalOpen(false)}
        onGoogleLogin={async () => {
          await handleGoogleLogin();
        }}
        onGoogleLogout={handleGoogleLogout}
        onRequireReauth={() => setGmailNeedsAuth(true)}
        onSentSuccess={(recipient) => {
          showToast(`Đã gửi thiệp 20/11 qua Gmail tới ${recipient}`);
        }}
      />

      <ShareFallbackModal
        isOpen={shareFallbackOpen}
        previewDataUrl={exportedDataUrl}
        onClose={() => setShareFallbackOpen(false)}
        onDownload={() => {
          if (exportedDataUrl) {
            triggerBlobDownload(exportedDataUrl);
            showToast('Đã tải ảnh thiệp PNG về máy.');
          }
        }}
      />

      <ConfirmResetModal
        isOpen={isResetModalOpen}
        onCancel={() => setIsResetModalOpen(false)}
        onConfirm={handleConfirmReset}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-[#231B16] text-[#FFFDF9] text-xs sm:text-sm font-medium shadow-lg flex items-center gap-2 max-w-[92vw]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#E2B86B] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
