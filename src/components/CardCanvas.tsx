import React, { useEffect, useRef, useState } from 'react';
import { CardState, resolveCardTheme } from '../types/card';
import { BackgroundArt } from './vectors/BackgroundArt';
import { CornerFlourish, FloralArt } from './vectors/FloralArt';

interface CardCanvasProps {
  state: CardState;
  id?: string;
}

export const CARD_WIDTH = 600;
export const CARD_HEIGHT = 750;

export const CardCanvas: React.FC<CardCanvasProps> = ({ state, id }) => {
  const theme = resolveCardTheme(state);

  const teacherDisplay = state.teacherName.trim() || 'Thầy / Cô kính mến';
  const senderDisplay = state.senderName.trim() || 'Học trò của thầy/cô';
  const wishDisplay =
    state.wishText.trim() ||
    'Kính chúc thầy cô luôn dồi dào sức khỏe, hạnh phúc và mãi giữ vững ngọn lửa yêu nghề.';

  // Adaptive font sizing so 300-char wishes & 60-char names never clip
  const wishFontSize =
    wishDisplay.length > 240 ? 17.5 : wishDisplay.length > 170 ? 19 : 21;
  const teacherFontSize =
    teacherDisplay.length > 42 ? 22 : teacherDisplay.length > 26 ? 25 : 29;

  const hasFlower = state.flower !== 'none';

  const baseContainerStyle: React.CSSProperties = {
    position: 'relative',
    width: `${CARD_WIDTH}px`,
    height: `${CARD_HEIGHT}px`,
    backgroundColor: theme.paper,
    color: theme.textMain,
    overflow: 'hidden',
    fontFamily: '"Be Vietnam Pro", system-ui, sans-serif',
    boxSizing: 'border-box',
    userSelect: 'none',
  };

  const renderClassicHeritage = () => (
    <div style={baseContainerStyle} id={id}>
      <BackgroundArt
        background={state.background}
        primary={theme.primary}
        accent={theme.accent}
        paper={theme.paper}
      />
      {/* Double classic frame */}
      <div
        style={{
          position: 'absolute',
          inset: '22px',
          border: `2px solid ${theme.primary}`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: '29px',
          border: `1px solid ${theme.accent}`,
          pointerEvents: 'none',
        }}
      />
      {/* Corner ornaments */}
      <div style={{ position: 'absolute', top: '34px', left: '34px' }}>
        <CornerFlourish color={theme.accent} size={32} />
      </div>
      <div
        style={{
          position: 'absolute',
          top: '34px',
          right: '34px',
          transform: 'scaleX(-1)',
        }}
      >
        <CornerFlourish color={theme.accent} size={32} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '34px',
          left: '34px',
          transform: 'scaleY(-1)',
        }}
      >
        <CornerFlourish color={theme.accent} size={32} />
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: '34px',
          right: '34px',
          transform: 'scale(-1, -1)',
        }}
      >
        <CornerFlourish color={theme.accent} size={32} />
      </div>

      {/* Main content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '54px 62px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.24em',
              textTransform: 'uppercase',
              color: theme.accent,
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            Ngày Nhà Giáo Việt Nam · 20/11
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '34px',
              fontWeight: 700,
              lineHeight: 1.2,
              color: theme.primary,
            }}
          >
            Tri Ân Người Lái Đò
          </h2>
          <div
            style={{
              width: '84px',
              height: '2px',
              backgroundColor: theme.accent,
              margin: '16px auto 0',
            }}
          />
        </div>

        {hasFlower && (
          <div style={{ width: '168px', height: '112px', margin: '4px auto' }}>
            <FloralArt
              flower={state.flower}
              primary={theme.primary}
              accent={theme.accent}
              isDarkCanvas={theme.isDarkCanvas}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        )}

        <div style={{ width: '100%', padding: '0 8px' }}>
          <div
            style={{
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: theme.textMuted,
              marginBottom: '6px',
            }}
          >
            Kính gửi
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: `${teacherFontSize}px`,
              fontWeight: 700,
              color: theme.primary,
              lineHeight: 1.25,
              marginBottom: '18px',
              overflowWrap: 'break-word',
            }}
          >
            {teacherDisplay}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: '"Lora", Georgia, serif',
              fontSize: `${wishFontSize}px`,
              lineHeight: 1.62,
              color: theme.textMain,
              fontStyle: 'italic',
              overflowWrap: 'break-word',
            }}
          >
            “{wishDisplay}”
          </p>
        </div>

        <div style={{ width: '100%' }}>
          <div
            style={{
              width: '48px',
              height: '1px',
              backgroundColor: theme.border,
              margin: '0 auto 12px',
            }}
          />
          <div
            style={{
              fontSize: '12px',
              color: theme.textMuted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '4px',
            }}
          >
            Kính chúc từ
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: theme.primary,
              overflowWrap: 'break-word',
            }}
          >
            {senderDisplay}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditorialPostcard = () => (
    <div style={baseContainerStyle} id={id}>
      <BackgroundArt
        background={state.background}
        primary={theme.primary}
        accent={theme.accent}
        paper={theme.paper}
      />
      <div
        style={{
          position: 'absolute',
          inset: '24px',
          border: `1px solid ${theme.border}`,
          pointerEvents: 'none',
        }}
      />
      {/* Top stamp & masthead */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '48px 54px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: `1.5px solid ${theme.primary}`,
            paddingBottom: '18px',
          }}
        >
          <div style={{ textAlign: 'left', maxWidth: '330px' }}>
            <div
              style={{
                fontSize: '11.5px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: theme.accent,
                fontWeight: 700,
                marginBottom: '6px',
              }}
            >
              Thư Chúc Mừng
            </div>
            <h2
              style={{
                margin: 0,
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '30px',
                fontWeight: 700,
                lineHeight: 1.18,
                color: theme.primary,
              }}
            >
              Ngày Nhà Giáo Việt Nam
            </h2>
          </div>
          {/* Postage-style 20/11 seal */}
          <div
            style={{
              border: `1.5px solid ${theme.primary}`,
              padding: '8px 14px',
              textAlign: 'center',
              backgroundColor: theme.isDarkCanvas
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(255,255,255,0.65)',
            }}
          >
            <div
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '24px',
                fontWeight: 700,
                color: theme.primary,
                lineHeight: 1,
              }}
            >
              20/11
            </div>
            <div
              style={{
                fontSize: '10px',
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: theme.accent,
                marginTop: '4px',
                fontWeight: 600,
              }}
            >
              Tri Ân
            </div>
          </div>
        </div>

        {/* Letter body */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            textAlign: 'left',
            padding: '18px 0',
          }}
        >
          <div
            style={{
              fontFamily: '"Lora", Georgia, serif',
              fontSize: '15px',
              color: theme.textMuted,
              marginBottom: '6px',
            }}
          >
            Kính gửi:
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: `${teacherFontSize}px`,
              fontWeight: 700,
              color: theme.primary,
              lineHeight: 1.25,
              marginBottom: '22px',
              overflowWrap: 'break-word',
            }}
          >
            {teacherDisplay}
          </div>
          <div
            style={{
              padding: '20px 24px',
              backgroundColor: theme.isDarkCanvas
                ? 'rgba(255,255,255,0.06)'
                : 'rgba(255,255,255,0.58)',
              border: `1px solid ${theme.border}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: '"Lora", Georgia, serif',
                fontSize: `${wishFontSize}px`,
                lineHeight: 1.65,
                color: theme.textMain,
                overflowWrap: 'break-word',
              }}
            >
              {wishDisplay}
            </p>
          </div>
        </div>

        {/* Bottom signature + asymmetrical flower */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            borderTop: `1px solid ${theme.border}`,
            paddingTop: '14px',
          }}
        >
          <div style={{ textAlign: 'left', maxWidth: hasFlower ? '310px' : '100%' }}>
            <div
              style={{
                fontSize: '12px',
                color: theme.textMuted,
                marginBottom: '4px',
              }}
            >
              Người gửi lời chúc
            </div>
            <div
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '21px',
                fontWeight: 700,
                fontStyle: 'italic',
                color: theme.primary,
                overflowWrap: 'break-word',
              }}
            >
              {senderDisplay}
            </div>
          </div>
          {hasFlower && (
            <div style={{ width: '152px', height: '104px', flexShrink: 0 }}>
              <FloralArt
                flower={state.flower}
                primary={theme.primary}
                accent={theme.accent}
                isDarkCanvas={theme.isDarkCanvas}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderChalkboardMemory = () => (
    <div style={baseContainerStyle} id={id}>
      <BackgroundArt
        background={state.background}
        primary={theme.primary}
        accent={theme.accent}
        paper={theme.paper}
      />
      {/* Dashed chalk-like border */}
      <div
        style={{
          position: 'absolute',
          inset: '24px',
          border: `2px dashed ${theme.accent}`,
          borderRadius: '14px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '50px 56px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: '100%' }}>
          <div
            style={{
              display: 'inline-block',
              borderBottom: `2px solid ${theme.accent}`,
              paddingBottom: '6px',
              fontSize: '13px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color: theme.accent,
              fontWeight: 600,
              marginBottom: '14px',
            }}
          >
            20 Tháng 11 · Kỷ Niệm Mái Trường
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '33px',
              fontWeight: 700,
              lineHeight: 1.2,
              color: theme.primary,
            }}
          >
            Bụi Phấn & Yêu Thương
          </h2>
        </div>

        <div style={{ width: '100%' }}>
          <div
            style={{
              fontFamily: '"Lora", Georgia, serif',
              fontSize: '14px',
              color: theme.textMuted,
              marginBottom: '4px',
            }}
          >
            Trân trọng kính tặng
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: `${teacherFontSize}px`,
              fontWeight: 700,
              color: theme.primary,
              marginBottom: '18px',
              lineHeight: 1.25,
              overflowWrap: 'break-word',
            }}
          >
            {teacherDisplay}
          </div>

          <div
            style={{
              padding: '22px 26px',
              borderTop: `1px dashed ${theme.border}`,
              borderBottom: `1px dashed ${theme.border}`,
            }}
          >
            <p
              style={{
                margin: 0,
                fontFamily: '"Lora", Georgia, serif',
                fontSize: `${wishFontSize}px`,
                lineHeight: 1.62,
                color: theme.textMain,
                overflowWrap: 'break-word',
              }}
            >
              {wishDisplay}
            </p>
          </div>
        </div>

        <div
          style={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {hasFlower && (
            <div style={{ width: '150px', height: '98px' }}>
              <FloralArt
                flower={state.flower}
                primary={theme.primary}
                accent={theme.accent}
                isDarkCanvas={theme.isDarkCanvas}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
          <div>
            <span style={{ fontSize: '13px', color: theme.textMuted }}>
              Từ tấm lòng của{' '}
            </span>
            <span
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '19px',
                fontWeight: 700,
                color: theme.primary,
                overflowWrap: 'break-word',
              }}
            >
              {senderDisplay}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderModernMinimal = () => (
    <div style={baseContainerStyle} id={id}>
      <BackgroundArt
        background={state.background}
        primary={theme.primary}
        accent={theme.accent}
        paper={theme.paper}
      />
      {/* Clean outer architectural line */}
      <div
        style={{
          position: 'absolute',
          inset: '30px',
          border: `1px solid ${theme.border}`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '58px 62px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          textAlign: 'left',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <div>
            <div
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '64px',
                fontWeight: 700,
                lineHeight: 0.9,
                color: theme.primary,
                letterSpacing: '-0.02em',
              }}
            >
              20/11
            </div>
            <div
              style={{
                fontSize: '12px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: theme.accent,
                fontWeight: 600,
                marginTop: '12px',
              }}
            >
              Ngày Nhà Giáo Việt Nam
            </div>
          </div>
          {hasFlower && (
            <div style={{ width: '144px', height: '102px' }}>
              <FloralArt
                flower={state.flower}
                primary={theme.primary}
                accent={theme.accent}
                isDarkCanvas={theme.isDarkCanvas}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>

        <div>
          <div
            style={{
              width: '44px',
              height: '3px',
              backgroundColor: theme.primary,
              marginBottom: '18px',
            }}
          />
          <div
            style={{
              fontSize: '13px',
              color: theme.textMuted,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: '6px',
            }}
          >
            Kính tặng
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: `${teacherFontSize}px`,
              fontWeight: 700,
              color: theme.primary,
              lineHeight: 1.24,
              marginBottom: '22px',
              overflowWrap: 'break-word',
            }}
          >
            {teacherDisplay}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: '"Lora", Georgia, serif',
              fontSize: `${wishFontSize}px`,
              lineHeight: 1.66,
              color: theme.textMain,
              overflowWrap: 'break-word',
            }}
          >
            {wishDisplay}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            borderTop: `1px solid ${theme.border}`,
            paddingTop: '16px',
          }}
        >
          <div>
            <div style={{ fontSize: '12px', color: theme.textMuted, marginBottom: '2px' }}>
              Trân trọng,
            </div>
            <div
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '20px',
                fontWeight: 700,
                color: theme.primary,
                overflowWrap: 'break-word',
              }}
            >
              {senderDisplay}
            </div>
          </div>
          <div
            style={{
              fontSize: '11px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: theme.textMuted,
            }}
          >
            Tri Ân · 20/11
          </div>
        </div>
      </div>
    </div>
  );

  const renderAutumnReverie = () => (
    <div style={baseContainerStyle} id={id}>
      <BackgroundArt
        background={state.background}
        primary={theme.primary}
        accent={theme.accent}
        paper={theme.paper}
      />
      {/* Arched botanical border */}
      <div
        style={{
          position: 'absolute',
          inset: '26px',
          border: `1.5px solid ${theme.accent}`,
          borderTopLeftRadius: '260px',
          borderTopRightRadius: '260px',
          borderBottomLeftRadius: '14px',
          borderBottomRightRadius: '14px',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '62px 60px 48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {hasFlower ? (
            <div style={{ width: '160px', height: '108px', marginBottom: '6px' }}>
              <FloralArt
                flower={state.flower}
                primary={theme.primary}
                accent={theme.accent}
                isDarkCanvas={theme.isDarkCanvas}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          ) : (
            <div
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '28px',
                color: theme.accent,
                marginBottom: '12px',
              }}
            >
              ✦ 20/11 ✦
            </div>
          )}
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: theme.accent,
              fontWeight: 600,
              marginBottom: '6px',
            }}
          >
            Tháng Mười Một Yêu Thương
          </div>
          <h2
            style={{
              margin: 0,
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '30px',
              fontWeight: 700,
              color: theme.primary,
            }}
          >
            Kính Chúc Ngày Nhà Giáo
          </h2>
        </div>

        <div style={{ width: '100%' }}>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: `${teacherFontSize}px`,
              fontWeight: 700,
              color: theme.primary,
              marginBottom: '16px',
              lineHeight: 1.25,
              overflowWrap: 'break-word',
            }}
          >
            {teacherDisplay}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: '"Lora", Georgia, serif',
              fontSize: `${wishFontSize}px`,
              lineHeight: 1.65,
              color: theme.textMain,
              fontStyle: 'italic',
              overflowWrap: 'break-word',
            }}
          >
            {wishDisplay}
          </p>
        </div>

        <div style={{ width: '100%' }}>
          <div
            style={{
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: theme.textMuted,
              marginBottom: '4px',
            }}
          >
            Kính tặng · 20/11
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '20px',
              fontWeight: 600,
              color: theme.primary,
              overflowWrap: 'break-word',
            }}
          >
            {senderDisplay}
          </div>
        </div>
      </div>
    </div>
  );

  const renderScholarFolio = () => (
    <div style={baseContainerStyle} id={id}>
      <BackgroundArt
        background={state.background}
        primary={theme.primary}
        accent={theme.accent}
        paper={theme.paper}
      />
      {/* Book folio outer border */}
      <div
        style={{
          position: 'absolute',
          inset: '20px',
          border: `1.5px solid ${theme.primary}`,
          pointerEvents: 'none',
        }}
      />
      {/* Top & bottom header bands */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          height: '100%',
          padding: '44px 52px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: `1px solid ${theme.border}`,
            paddingBottom: '12px',
            fontSize: '11.5px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: theme.textMuted,
          }}
        >
          <span>Trang Lưu Bút 20/11</span>
          <span style={{ color: theme.accent, fontWeight: 700 }}>Tri Ân Thầy Cô</span>
        </div>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            padding: '16px 0',
          }}
        >
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '42px',
              lineHeight: 0.7,
              color: theme.accent,
              marginBottom: '10px',
            }}
          >
            “
          </div>
          <div
            style={{
              fontFamily: '"Lora", Georgia, serif',
              fontSize: '14px',
              color: theme.textMuted,
              marginBottom: '4px',
            }}
          >
            Gửi tới người gieo mầm tri thức
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: `${teacherFontSize}px`,
              fontWeight: 700,
              color: theme.primary,
              lineHeight: 1.25,
              marginBottom: '18px',
              overflowWrap: 'break-word',
            }}
          >
            {teacherDisplay}
          </div>
          <p
            style={{
              margin: 0,
              fontFamily: '"Lora", Georgia, serif',
              fontSize: `${wishFontSize}px`,
              lineHeight: 1.65,
              color: theme.textMain,
              maxWidth: '460px',
              overflowWrap: 'break-word',
            }}
          >
            {wishDisplay}
          </p>
          {hasFlower && (
            <div style={{ width: '154px', height: '102px', marginTop: '14px' }}>
              <FloralArt
                flower={state.flower}
                primary={theme.primary}
                accent={theme.accent}
                isDarkCanvas={theme.isDarkCanvas}
                style={{ width: '100%', height: '100%' }}
              />
            </div>
          )}
        </div>

        <div
          style={{
            borderTop: `1px solid ${theme.border}`,
            paddingTop: '14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '11.5px', color: theme.textMuted }}>Kính bút,</div>
            <div
              style={{
                fontFamily: '"Playfair Display", Georgia, serif',
                fontSize: '19px',
                fontWeight: 700,
                color: theme.primary,
                overflowWrap: 'break-word',
              }}
            >
              {senderDisplay}
            </div>
          </div>
          <div
            style={{
              fontFamily: '"Playfair Display", Georgia, serif',
              fontSize: '18px',
              fontWeight: 700,
              color: theme.accent,
            }}
          >
            20 · 11
          </div>
        </div>
      </div>
    </div>
  );

  switch (state.templateId) {
    case 'editorial-postcard':
      return renderEditorialPostcard();
    case 'chalkboard-memory':
      return renderChalkboardMemory();
    case 'modern-minimal':
      return renderModernMinimal();
    case 'autumn-reverie':
      return renderAutumnReverie();
    case 'scholar-folio':
      return renderScholarFolio();
    case 'classic-heritage':
    default:
      return renderClassicHeritage();
  }
};

interface ScaledCardPreviewProps {
  state: CardState;
  className?: string;
}

export const ScaledCardPreview: React.FC<ScaledCardPreviewProps> = ({
  state,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      const width = el.clientWidth;
      if (width > 0) {
        setScale(width / CARD_WIDTH);
      }
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/5] overflow-hidden ${className}`}
    >
      <div
        style={{
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          pointerEvents: 'none',
        }}
      >
        <CardCanvas state={state} />
      </div>
    </div>
  );
};
