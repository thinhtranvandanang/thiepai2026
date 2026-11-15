interface CloudflarePagesEnv {
  GEMINI_API_KEY?: string;
}

interface CloudflarePagesContext {
  request: Request;
  env: CloudflarePagesEnv;
}

const MAX_WISH_LENGTH = 300;

type WishStyle = 'formal' | 'warm' | 'humorous' | 'concise';

const STYLE_LABELS: Record<WishStyle, { label: string; guidance: string }> = {
  formal: {
    label: 'Trang trọng',
    guidance:
      'Ngôn từ kính trọng, chuẩn mực, trang nhã, giàu lòng biết ơn đối với công lao dạy dỗ của thầy cô.',
  },
  warm: {
    label: 'Thân mật',
    guidance:
      'Ngôn từ ấm áp, gần gũi, chân thành, tự nhiên như lời tâm tình của học trò/phụ huynh gửi thầy cô.',
  },
  humorous: {
    label: 'Hài hước',
    guidance:
      'Vui tươi, dí dỏm, đáng yêu nhưng vẫn giữ sự lễ phép, kính trọng với thầy cô (có thể nhắc nhẹ chuyện bài vở, phấn bảng).',
  },
  concise: {
    label: 'Ngắn gọn',
    guidance:
      'Ngắn gọn, súc tích (khoảng 110–170 ký tự), dễ đọc, ý nghĩa sâu sắc, không rườm rà.',
  },
};

function jsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });
}

export async function onRequestPost(context: CloudflarePagesContext): Promise<Response> {
  const apiKey = (context.env.GEMINI_API_KEY || '').trim();
  if (!apiKey) {
    return jsonResponse(
      {
        code: 'MISSING_KEY',
        error:
          'Chưa cấu hình GEMINI_API_KEY trên Cloudflare Pages. Bạn có thể thêm biến môi trường GEMINI_API_KEY trên Cloudflare hoặc nhập khóa cá nhân trong mục Cài đặt AI.',
      },
      503
    );
  }

  let body: { teacherName?: string; senderName?: string; wishStyle?: string } = {};
  try {
    body = (await context.request.json()) as {
      teacherName?: string;
      senderName?: string;
      wishStyle?: string;
    };
  } catch {
    return jsonResponse({ code: 'NETWORK', error: 'Dữ liệu yêu cầu không hợp lệ.' }, 400);
  }

  const teacher =
    (typeof body.teacherName === 'string' ? body.teacherName : '').trim() || 'Thầy/Cô';
  const sender =
    (typeof body.senderName === 'string' ? body.senderName : '').trim() || 'Em/Con';
  const rawStyle = typeof body.wishStyle === 'string' ? body.wishStyle : 'warm';
  const wishStyle: WishStyle =
    rawStyle === 'formal' ||
    rawStyle === 'warm' ||
    rawStyle === 'humorous' ||
    rawStyle === 'concise'
      ? rawStyle
      : 'warm';

  const styleInfo = STYLE_LABELS[wishStyle];
  const prompt = [
    'Hãy viết 3 lời chúc mừng Ngày Nhà giáo Việt Nam 20/11 bằng tiếng Việt thật tự nhiên và giàu cảm xúc.',
    `- Người nhận: ${teacher}`,
    `- Người gửi: ${sender}`,
    `- Phong cách yêu cầu: ${styleInfo.label} (${styleInfo.guidance})`,
    '- Yêu cầu bắt buộc:',
    '  1. Mỗi lời chúc khác hẳn nhau về ý tứ và cách mở đầu.',
    `  2. Mỗi lời chúc tối đa 260 ký tự (tuyệt đối không vượt quá ${MAX_WISH_LENGTH} ký tự).`,
    '  3. Không chèn hashtag, không chèn emoji dày đặc, không viết tiêu đề hay đánh số thứ tự trong nội dung lời chúc.',
    '  4. Xưng hô phù hợp tự nhiên với tên người nhận và người gửi.',
  ].join('\n');

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-4-hydrogen:generateContent?key=${encodeURIComponent(
        apiKey
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
            thinkingConfig: { thinkingLevel: 'LOW' },
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

    if (!geminiRes.ok) {
      if (
        geminiRes.status === 400 ||
        geminiRes.status === 401 ||
        geminiRes.status === 403
      ) {
        return jsonResponse(
          {
            code: 'INVALID_KEY',
            error:
              'GEMINI_API_KEY không hợp lệ hoặc đã hết hiệu lực. Vui lòng kiểm tra lại cấu hình hoặc nhập khóa cá nhân trong Cài đặt AI.',
          },
          401
        );
      }
      if (geminiRes.status === 429) {
        return jsonResponse(
          {
            code: 'RATE_LIMIT',
            error: 'Hệ thống AI đang vượt quá giới hạn lượt gọi. Vui lòng thử lại sau ít phút.',
          },
          429
        );
      }
      return jsonResponse(
        {
          code: 'NETWORK',
          error: 'Không thể kết nối tới Gemini AI lúc này. Vui lòng thử lại sau.',
        },
        502
      );
    }

    const data = (await geminiRes.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const rawText = (data.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();
    if (!rawText) {
      return jsonResponse(
        {
          code: 'EMPTY_RESPONSE',
          error: 'AI chưa trả về nội dung gợi ý. Vui lòng thử lại sau vài giây.',
        },
        502
      );
    }

    const parsed = JSON.parse(rawText) as { wishes?: unknown };
    const wishes = Array.isArray(parsed.wishes)
      ? parsed.wishes
          .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
          .map((item) => item.trim().slice(0, MAX_WISH_LENGTH))
      : [];

    if (wishes.length === 0) {
      return jsonResponse(
        {
          code: 'EMPTY_RESPONSE',
          error: 'Không đọc được danh sách lời chúc từ AI. Bạn vui lòng bấm thử lại nhé.',
        },
        502
      );
    }

    return jsonResponse({ wishes: wishes.slice(0, 3) }, 200);
  } catch {
    return jsonResponse(
      {
        code: 'NETWORK',
        error: 'Không thể kết nối tới Gemini AI lúc này. Vui lòng thử lại sau.',
      },
      500
    );
  }
}
