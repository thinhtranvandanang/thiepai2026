import 'dotenv/config';
import express from 'express';
import type { Request, Response } from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { GoogleGenAI, ThinkingLevel, Type } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.post('/api/generate-wishes', async (req: Request, res: Response) => {
    const apiKey = (process.env.GEMINI_API_KEY || '').trim();
    if (!apiKey) {
      res.status(503).json({
        code: 'MISSING_KEY',
        error:
          'Máy chủ chưa có Gemini API Key. Vui lòng kiểm tra cấu hình Secrets hoặc nhập khóa cá nhân trong mục Cài đặt AI.',
      });
      return;
    }

    const body = (req.body ?? {}) as {
      teacherName?: string;
      senderName?: string;
      wishStyle?: string;
    };

    const teacher = (typeof body.teacherName === 'string' ? body.teacherName : '').trim() || 'Thầy/Cô';
    const sender = (typeof body.senderName === 'string' ? body.senderName : '').trim() || 'Em/Con';
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
      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      });

      const response = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
        contents: prompt,
        config: {
          systemInstruction:
            'Bạn là biên tập viên văn học và thiệp chúc mừng tiếng Việt tinh tế. Luôn trả về đúng JSON hợp lệ chứa 3 lời chúc 20/11 thuần tiếng Việt.',
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              wishes: {
                type: Type.ARRAY,
                description: 'Danh sách đúng 3 lời chúc 20/11 khác nhau bằng tiếng Việt.',
                items: {
                  type: Type.STRING,
                },
              },
            },
            required: ['wishes'],
          },
        },
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({
          code: 'EMPTY_RESPONSE',
          error: 'AI chưa trả về nội dung gợi ý. Vui lòng thử lại sau vài giây.',
        });
        return;
      }

      const parsed = JSON.parse(rawText) as { wishes?: unknown };
      const wishes = Array.isArray(parsed.wishes)
        ? parsed.wishes
            .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
            .map((item) => item.trim().slice(0, MAX_WISH_LENGTH))
        : [];

      if (wishes.length === 0) {
        res.status(502).json({
          code: 'EMPTY_RESPONSE',
          error: 'Không đọc được danh sách lời chúc từ AI. Bạn vui lòng bấm thử lại nhé.',
        });
        return;
      }

      res.json({ wishes: wishes.slice(0, 3) });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const lower = message.toLowerCase();

      if (
        lower.includes('api_key_invalid') ||
        lower.includes('api key not valid') ||
        lower.includes('permission_denied') ||
        lower.includes('401') ||
        lower.includes('403') ||
        lower.includes('400')
      ) {
        res.status(401).json({
          code: 'INVALID_KEY',
          error:
            'Gemini API Key không hợp lệ hoặc đã hết hiệu lực. Vui lòng kiểm tra lại trong Settings > Secrets hoặc Cài đặt AI.',
        });
        return;
      }

      if (lower.includes('429') || lower.includes('resource_exhausted') || lower.includes('quota')) {
        res.status(429).json({
          code: 'RATE_LIMIT',
          error:
            'Hệ thống AI đang vượt quá giới hạn lượt gọi. Vui lòng đợi một lát rồi bấm thử lại.',
        });
        return;
      }

      res.status(500).json({
        code: 'NETWORK',
        error: 'Không thể kết nối tới Gemini AI lúc này. Vui lòng thử lại sau.',
      });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
