import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({ prompt: 'select_account' });

let isSigningIn = false;
let cachedAccessToken: string | null = null;

export const initGmailAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, (user: User | null) => {
    if (user && cachedAccessToken) {
      onAuthSuccess?.(user, cachedAccessToken);
    } else if (!isSigningIn) {
      if (!user) {
        cachedAccessToken = null;
      }
      onAuthFailure?.(user);
    }
  });
};

export const signInWithGmail = async (): Promise<{
  user: User;
  accessToken: string;
}> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error(
        'Không nhận được quyền truy cập Gmail từ Google. Vui lòng thử đăng nhập lại.'
      );
    }
    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } finally {
    isSigningIn = false;
  }
};

export const getGmailAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const clearGmailAccessToken = (): void => {
  cachedAccessToken = null;
};

export const signOutGmail = async (): Promise<void> => {
  cachedAccessToken = null;
  await auth.signOut();
};

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }
  return btoa(binary);
}

function utf8ToBase64(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return bytesToBase64(bytes);
}

function toBase64Url(str: string): string {
  return utf8ToBase64(str)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function encodeMimeHeaderUtf8(text: string): string {
  return `=?UTF-8?B?${utf8ToBase64(text)}?=`;
}

function wrapBase64(b64: string, lineLength = 76): string {
  const lines: string[] = [];
  for (let i = 0; i < b64.length; i += lineLength) {
    lines.push(b64.slice(i, i + lineLength));
  }
  return lines.join('\r\n');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export interface SendCardEmailParams {
  toEmail: string;
  subject: string;
  messageBody: string;
  teacherName: string;
  senderName: string;
  pngDataUrl: string;
  fileName: string;
}

export class GmailSendError extends Error {
  public readonly needsReauth: boolean;

  constructor(message: string, needsReauth = false) {
    super(message);
    this.name = 'GmailSendError';
    this.needsReauth = needsReauth;
  }
}

export async function sendCardViaGmail({
  toEmail,
  subject,
  messageBody,
  teacherName,
  senderName,
  pngDataUrl,
  fileName,
}: SendCardEmailParams): Promise<void> {
  const accessToken = getGmailAccessToken();
  if (!accessToken) {
    throw new GmailSendError(
      'Phiên đăng nhập Gmail đã hết hạn hoặc chưa được cấp quyền. Vui lòng đăng nhập lại bằng Google.',
      true
    );
  }

  const base64Marker = ';base64,';
  const markerIndex = pngDataUrl.indexOf(base64Marker);
  if (markerIndex === -1) {
    throw new GmailSendError('Dữ liệu ảnh thiệp không hợp lệ. Vui lòng thử lại.');
  }
  const pngBase64 = pngDataUrl.slice(markerIndex + base64Marker.length);

  const boundary = `----=_Thiep2011_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const safeBodyHtml = escapeHtml(messageBody).replace(/\r?\n/g, '<br />');
  const safeTeacher = escapeHtml(teacherName);
  const safeSender = escapeHtml(senderName);

  const htmlContent = `
<!doctype html>
<html lang="vi">
  <body style="margin:0;padding:24px;background-color:#FAF6EF;font-family:Arial,Helvetica,sans-serif;color:#231B16;">
    <div style="max-width:560px;margin:0 auto;background-color:#FFFFFF;border:1px solid #E5DCCD;border-radius:12px;padding:28px;">
      <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9A6E24;font-weight:bold;margin-bottom:8px;">
        Ngày Nhà giáo Việt Nam 20/11
      </div>
      <h2 style="margin:0 0 16px 0;font-size:20px;color:#8B1E24;">
        Kính gửi ${safeTeacher}
      </h2>
      <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#2E241E;">
        ${safeBodyHtml}
      </p>
      <p style="margin:0 0 12px 0;font-size:14px;color:#6E6056;">
        <em>(Thiệp chúc mừng 20/11 được đính kèm dưới dạng ảnh PNG trong email này.)</em>
      </p>
      <hr style="border:none;border-top:1px solid #ECE4D7;margin:20px 0;" />
      <div style="font-size:14px;color:#4D4037;">
        Trân trọng,<br />
        <strong style="color:#8B1E24;">${safeSender}</strong>
      </div>
    </div>
  </body>
</html>`.trim();

  const mimeLines = [
    `To: ${toEmail}`,
    `Subject: ${encodeMimeHeaderUtf8(subject)}`,
    'MIME-Version: 1.0',
    `Content-Type: multipart/mixed; boundary="${boundary}"`,
    '',
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: base64',
    '',
    wrapBase64(utf8ToBase64(htmlContent)),
    '',
    `--${boundary}`,
    `Content-Type: image/png; name="${fileName}"`,
    'Content-Transfer-Encoding: base64',
    `Content-Disposition: attachment; filename="${fileName}"`,
    '',
    wrapBase64(pngBase64),
    '',
    `--${boundary}--`,
  ];

  const rawMessage = mimeLines.join('\r\n');
  const raw = toBase64Url(rawMessage);

  const response = await fetch(
    'https://gmail.googleapis.com/gmail/v1/users/me/messages/send',
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ raw }),
    }
  );

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      clearGmailAccessToken();
      throw new GmailSendError(
        'Phiên đăng nhập Gmail đã hết hạn hoặc thiếu quyền gửi thư. Vui lòng đăng nhập lại bằng Google.',
        true
      );
    }

    let detail = '';
    try {
      const errJson = (await response.json()) as { error?: { message?: string } };
      detail = errJson.error?.message || '';
    } catch {
      // Ignore JSON parse error
    }

    throw new GmailSendError(
      detail
        ? `Không thể gửi email qua Gmail (${detail}). Vui lòng kiểm tra địa chỉ email người nhận và thử lại.`
        : 'Không thể gửi email qua Gmail lúc này. Vui lòng thử lại sau.'
    );
  }
}
