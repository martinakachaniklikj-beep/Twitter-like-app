'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  LogoWrapper,
  WomensDayLogo,
  EightShape,
  Flower,
  GhostLogo,
  GhostBody,
  GhostFace,
  GhostEye,
  GhostMouth,
  CatLogo,
  CatFace,
  CatEar,
  CatEyeRow,
  CatEye,
  CatPupil,
  CatWhiskers,
  CatNose,
  CatMouth,
  CatTail,
} from './Seasonallogo.styled';

type SeasonVariant = 'womensDay' | 'halloween' | 'default';

const getSeasonVariant = (): SeasonVariant => {
  const now = new Date();
  const month = now.getMonth(); // 0-based
  const day = now.getDate();

  // 8th of March – International Women's Day
  if (month === 2 && day === 8) {
    return 'womensDay';
  }

  // Halloween week – from 24th Oct to 31st Oct (inclusive)
  if (month === 9 && day >= 24 && day <= 31) {
    return 'halloween';
  }

  return 'default';
};

const SeasonalLogo: React.FC = () => {
  const [variant, setVariant] = useState<SeasonVariant>('default');
  const [isHovering, setIsHovering] = useState(false);
  const [cursorOffset, setCursorOffset] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const logoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setVariant(getSeasonVariant());
  }, []);

  useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) => {
      const logoElement = logoRef.current;
      if (!logoElement) return;

      const rect = logoElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;

      const clampedX = Math.min(1, Math.max(0, x));
      const clampedY = Math.min(1, Math.max(0, y));

      setCursorOffset({
        x: (clampedX - 0.5) * 2,
        y: (clampedY - 0.5) * 2,
      });
    };

    window.addEventListener('mousemove', handleWindowMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
    };
  }, []);

  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => {
    setIsHovering(false);
    setCursorOffset({ x: 0, y: 0 });
  };

  const renderWomensDayLogo = () => (
    <WomensDayLogo>
      <EightShape />
      {[0, 1, 2, 3].map((index) => (
        <Flower key={index} $index={index} $isHovering={isHovering} />
      ))}
    </WomensDayLogo>
  );

  const renderHalloweenLogo = () => (
    <GhostLogo>
      <GhostBody>
        <GhostFace>
          <GhostEye />
          <GhostEye />
        </GhostFace>
        <GhostMouth />
      </GhostBody>
    </GhostLogo>
  );

  const renderCatLogo = () => (
    <CatLogo>

      <CatFace>

        <CatEar $side="left" />
        <CatEar $side="right" />

        <CatEyeRow>

          <CatEye $isSquinting={isHovering}>
            {!isHovering && (
              <CatPupil
                $offsetX={cursorOffset.x}
                $offsetY={cursorOffset.y}
              />
            )}
          </CatEye>

          <CatEye $isSquinting={isHovering}>
            {!isHovering && (
              <CatPupil
                $offsetX={cursorOffset.x}
                $offsetY={cursorOffset.y}
              />
            )}
          </CatEye>

        </CatEyeRow>

        {/* <CatNose />
        <CatMouth />
        <CatWhiskers /> */}

      </CatFace>

    </CatLogo>
  );
  
  return (
    <LogoWrapper
      ref={logoRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label="Seasonal logo"
    >
      {variant === 'womensDay' && renderWomensDayLogo()}
      {variant === 'halloween' && renderHalloweenLogo()}
      {variant === 'default' && renderCatLogo()}
    </LogoWrapper>
  );
};

export default SeasonalLogo;

