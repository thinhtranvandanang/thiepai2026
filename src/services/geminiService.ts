/**
 * ============================================================================
 * HƯỚNG DẪN CẤU HÌNH GEMINI API KEY
 * ============================================================================
 * - Mặc định: Ứng dụng tự động gọi qua máy chủ tích hợp (/api/generate-wishes)
 *   sử dụng biến môi trường GEMINI_API_KEY của Google AI Studio (không cần nhập
 *   khóa thủ công).
 * - Tùy chọn nâng cao (khi chạy thuần trình duyệt hoặc dùng khóa riêng):
 *   1. Truy cập Google AI Studio (https://aistudio.google.com/apikey) để lấy API Key.
 *   2. Bấm nút "Cài đặt AI" trong ứng dụng và dán khóa vào (lưu vào localStorage).
 *   3. Cảnh báo bảo mật: Khóa nhập thủ công được lưu cục bộ trong trình duyệt;
 *      không dùng khóa cá nhân trên máy tính công cộng.
 * ============================================================================
 */

import { MAX_WISH_LENGTH, STORAGE_KEYS, WishStyle, WISH_STYLES } from '../types/card';

export interface GenerateWishesParams {
  teacherName: string;
  senderName: string;
  wishStyle: WishStyle;
  apiKey?: string;
}

export type GeminiErrorCode =
  | 'MISSING_KEY'
  | 'INVALID_KEY'
  | 'RATE_LIMIT'
  | 'NETWORK'
  | 'EMPTY_RESPONSE';

export class GeminiWishError extends Error {
  public readonly code: GeminiErrorCode;

  constructor(message: string, code: GeminiErrorCode) {
    super(message);
    this.name = 'GeminiWishError';
    this.code = code;
  }
}

export function getSavedGeminiApiKey(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.API_KEY);
    if (stored && stored.trim()) {
      return stored.trim();
    }
  } catch {
    // Ignore storage access errors in restricted environments
  }
  const envKey = import.meta.env.VITE_GEMINI_API_KEY;
  return typeof envKey === 'string' ? envKey.trim() : '';
}

export function saveGeminiApiKey(key: string): void {
  const clean = key.trim();
  if (clean) {
    localStorage.setItem(STORAGE_KEYS.API_KEY, clean);
  } else {
    localStorage.removeItem(STORAGE_KEYS.API_KEY);
  }
}

async function generateWithPersonalBrowserKey(
  params: GenerateWishesParams,
  personalKey: string
): Promise<string[]> {
  const styleMeta = WISH_STYLES.find((s) => s.id === params.wishStyle) ?? WISH_STYLES[1];
  const teacher = params.teacherName.trim() || 'Thầy/Cô';
  const sender = params.senderName.trim() || 'Em/Con';

  const styleGuidanceMap: Record<WishStyle, string> = {
    formal:
      'Ngôn từ kính trọng, chuẩn mực, trang nhã, giàu lòng biết ơn đối với công lao dạy dỗ của thầy cô.',
    warm:
      'Ngôn từ ấm áp, gần gũi, chân thành, tự nhiên như lời tâm tình của học trò/phụ huynh gửi thầy cô.',
    humorous:
      'Vui tươi, dí dỏm, đáng yêu nhưng vẫn giữ sự lễ phép, kính trọng với thầy cô (có thể nhắc nhẹ chuyện bài vở, phấn bảng).',
    concise:
      'Ngắn gọn, súc tích (khoảng 110–170 ký tự), dễ đọc, ý nghĩa sâu sắc, không rườm rà.',
  };

  const prompt = [
    'Hãy viết 3 lời chúc mừng Ngày Nhà giáo Việt Nam 20/11 bằng tiếng Việt thật tự nhiên và giàu cảm xúc.',
    `- Người nhận: ${teacher}`,
    `- Người gửi: ${sender}`,
    `- Phong cách yêu cầu: ${styleMeta.label} (${styleGuidanceMap[params.wishStyle]})`,
    '- Yêu cầu bắt buộc:',
    '  1. Mỗi lời chúc khác hẳn nhau về ý tứ và cách mở đầu.',
    `  2. Mỗi lời chúc tối đa 260 ký tự (tuyệt đối không vượt quá ${MAX_WISH_LENGTH} ký tự).`,
    '  3. Không chèn hashtag, không chèn emoji dày đặc, không viết tiêu đề hay đánh số thứ tự trong nội dung lời chúc.',
    '  4. Xưng hô phù hợp tự nhiên với tên người nhận và người gửi.',
  ].join('\n');

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent?key=${encodeURIComponent(
      personalKey
    )}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: {
          parts: [
            {
              text: 'Bạn là biên tập viên văn học và thiệp chúc mừng tiếng Việt tinh tế. Luôn trả về đúng JSON hợp lệ chứa 3 lời chúc 20/11 thuần tiếng Việt.',
            },
          ],
        },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              wishes: {
                type: 'ARRAY',
                items: { type: 'STRING' },
              },
            },
            required: ['wishes'],
          },
        },
      }),
    }
  );

  if (!response.ok) {
    if (response.status === 400 || response.status === 401 || response.status === 403) {
      throw new GeminiWishError(
        'Gemini API Key cá nhân không hợp lệ hoặc đã hết hiệu lực. Vui lòng kiểm tra lại trong mục Cài đặt AI.',
        'INVALID_KEY'
      );
    }
    if (response.status === 429) {
      throw new GeminiWishError(
        'Khóa API đang vượt quá giới hạn lượt gọi. Vui lòng đợi một lát rồi bấm thử lại.',
        'RATE_LIMIT'
      );
    }
    throw new GeminiWishError(
      'Không thể kết nối tới Gemini AI lúc này. Vui lòng thử lại sau.',
      'NETWORK'
    );
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const rawText = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
  if (!rawText) {
    throw new GeminiWishError(
      'AI chưa trả về nội dung gợi ý. Vui lòng thử lại sau vài giây.',
      'EMPTY_RESPONSE'
    );
  }

  const parsed = JSON.parse(rawText) as { wishes?: unknown };
  const wishes = Array.isArray(parsed.wishes)
    ? parsed.wishes
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .map((item) => item.trim().slice(0, MAX_WISH_LENGTH))
    : [];

  if (wishes.length === 0) {
    throw new GeminiWishError(
      'Không đọc được danh sách lời chúc từ AI. Bạn vui lòng bấm thử lại nhé.',
      'EMPTY_RESPONSE'
    );
  }

  return wishes.slice(0, 3);
}

export async function generateTeacherDayWishes({
  teacherName,
  senderName,
  wishStyle,
  apiKey,
}: GenerateWishesParams): Promise<string[]> {
  const customKey = (apiKey ?? getSavedGeminiApiKey()).trim();

  // If user explicitly configured a personal key in Settings, use it directly
  if (customKey) {
    return generateWithPersonalBrowserKey(
      { teacherName, senderName, wishStyle },
      customKey
    );
  }

  // Otherwise use the built-in server endpoint powered by GEMINI_API_KEY
  try {
    const res = await fetch('/api/generate-wishes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ teacherName, senderName, wishStyle }),
    });

    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      throw new GeminiWishError(
        'Bạn chưa cấu hình Gemini API Key cho bản chạy tĩnh. Hãy nhập khóa API trong mục Cài đặt AI.',
        'MISSING_KEY'
      );
    }

    const data = (await res.json()) as {
      wishes?: unknown;
      error?: string;
      code?: GeminiErrorCode;
    };

    if (!res.ok) {
      throw new GeminiWishError(
        data.error || 'Không thể tạo gợi ý lời chúc lúc này. Vui lòng thử lại.',
        data.code || 'NETWORK'
      );
    }

    const wishes = Array.isArray(data.wishes)
      ? data.wishes
          .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
          .map((item) => item.trim().slice(0, MAX_WISH_LENGTH))
      : [];

    if (wishes.length === 0) {
      throw new GeminiWishError(
        'Không đọc được danh sách lời chúc từ AI. Bạn vui lòng bấm thử lại nhé.',
        'EMPTY_RESPONSE'
      );
    }

    return wishes.slice(0, 3);
  } catch (err) {
    if (err instanceof GeminiWishError) {
      throw err;
    }
    throw new GeminiWishError(
      'Không thể kết nối tới dịch vụ AI lúc này. Vui lòng kiểm tra mạng và thử lại.',
      'NETWORK'
    );
  }
}
