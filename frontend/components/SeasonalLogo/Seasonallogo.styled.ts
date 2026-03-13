import styled, { css, keyframes } from 'styled-components';

// Shared container
export const LogoWrapper = styled.div`
  width: 3rem;
  height: 3rem;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 8th of March – floral 8
const flowerBloom = keyframes`
  0% {
    transform: scale(0.9) rotate(0deg);
    opacity: 0.6;
  }
  50% {
    transform: scale(1.1) rotate(5deg);
    opacity: 1;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 0.9;
  }
`;

export const WomensDayLogo = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const EightShape = styled.div`
  width: 70%;
  height: 90%;
  position: relative;
  border-radius: 999px;
  background: rgb(var(--primary));
  border: 2px solid rgb(var(--foreground));
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  &::before,
  &::after {
    content: '';
    width: 68%;
    height: 42%;
    border-radius: 999px;
    border: 2px solid rgb(var(--background));
  }
`;

interface FlowerProps {
  $index: number;
  $isHovering: boolean;
}

export const Flower = styled.div<FlowerProps>`
  position: absolute;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  background: rgb(var(--accent));
  border: 2px solid rgb(var(--background));

  ${({ $index }) =>
    $index === 0 &&
    css`
      top: 6%;
      left: 10%;
    `}

  ${({ $index }) =>
    $index === 1 &&
    css`
      top: 14%;
      right: 4%;
    `}

  ${({ $index }) =>
    $index === 2 &&
    css`
      bottom: 10%;
      left: 14%;
    `}

  ${({ $index }) =>
    $index === 3 &&
    css`
      bottom: 2%;
      right: 14%;
    `}

  ${({ $isHovering }) =>
    $isHovering &&
    css`
      animation: ${flowerBloom} 600ms ease-in-out infinite alternate;
    `}

  &::before,
  &::after {
    content: '';
    position: absolute;
    inset: -0.13rem;
    border-radius: 999px;
    border: 2px solid #fb923c;
    opacity: 0.6;
  }
`;

// Halloween – floating ghost
const floatGhost = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-6px);
  }
  100% {
    transform: translateY(0px);
  }
`;

export const GhostLogo = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GhostBody = styled.div`
  width: 70%;
  height: 80%;
  background: rgb(var(--card));
  border-radius: 60% 60% 35% 35%;
  position: relative;
  overflow: hidden;
  animation: ${floatGhost} 2.4s ease-in-out infinite;

  &::after {
    content: '';
    position: absolute;
    bottom: -12%;
    left: 0;
    right: 0;
    height: 30%;
    background: radial-gradient(circle at 10% 0, #e5e7eb 40%, transparent 41%) 0 0 /
        33% 100% repeat-x;
  }
`;

export const GhostFace = styled.div`
  position: absolute;
  top: 32%;
  left: 50%;
  transform: translateX(-50%);
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const GhostEye = styled.span`
  width: 0.3rem;
  height: 0.6rem;
  background: rgb(var(--foreground));
  border-radius: 999px;
`;

export const GhostMouth = styled.span`
  position: absolute;
  bottom: 18%;
  left: 50%;
  width: 0.9rem;
  height: 0.5rem;
  border-radius: 0 0 999px 999px;
  transform: translateX(-50%);
  border-bottom: 3px solid rgb(var(--foreground));
`;

// Default – cat logo
interface CatEyeProps {
    $isSquinting: boolean;
  }
  
  interface CatPupilProps {
    $offsetX: number;
    $offsetY: number;
  }
  
  export const CatLogo = styled.div`
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  `;
  
  export const CatFace = styled.div`
    width: 78%;
    height: 78%;
    background: #020617;
    border-radius: 60% 60% 55% 55%;
    position: relative;
    border: 2px solid rgb(var(--border));
  `;
  
  /* EARS */
  
  export const CatEar = styled.div<{ $side: "left" | "right" }>`
    position: absolute;
    top: -12%;
    ${({ $side }) => ($side === "left" ? "left: 4%;" : "right: 4%;")}
    width: 30%;
    height: 35%;
    background: #020617;
  
    clip-path: polygon(50% 0, 0 100%, 100% 100%);
    border: 2px solid rgb(var(--border));
  
    transition: transform 0.2s ease;
  
    ${LogoWrapper}:hover & {
      transform: rotate(${({ $side }) => ($side === "left" ? "-8deg" : "8deg")});
    }
  `;
  
  /* EYES */
  
  export const CatEyeRow = styled.div`
    position: absolute;
    top: 38%;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    display: flex;
    justify-content: space-between;
  `;
  
  export const CatEye = styled.div<CatEyeProps>`
    width: 1rem;
    height: 0.75rem;
    background: #fefce8;
    border-radius: 50%;
    border: 1px solid rgba(15, 23, 42, 0.9);
  
    display: flex;
    align-items: center;
    justify-content: center;
  
    overflow: hidden;
    position: relative;
  
    transition: all 0.15s ease;
  
    ${({ $isSquinting }) =>
      $isSquinting &&
      css`
        background: transparent;
        border: none;
        height: 0.45rem;
  
        & > * {
          display: none;
        }
  
        &::before {
          content: "";
          position: absolute;
          width: 0.9rem;
          height: 0.45rem;
  
          border-bottom: 3px solid #fefce8;
          border-radius: 0 0 100% 100%;
        }
      `}
  `;
  
  export const CatPupil = styled.div<CatPupilProps>`
    width: 0.3rem;
    height: 0.9rem;
    background: #020617;
    border-radius: 999px;
  
    transform: translate(
      ${({ $offsetX }) => $offsetX * 6}px,
      ${({ $offsetY }) => $offsetY * 4}px
    );
  
    transition: transform 120ms cubic-bezier(0.22, 1, 0.36, 1);
  `;
  
  /* NOSE */
  
  export const CatNose = styled.div`
    position: absolute;
    top: 67%;
    left: 50%;
    transform: translateX(-50%);
  
    width: 0.35rem;
    height: 0.28rem;
  
    background: rgb(var(--primary));
    clip-path: polygon(50% 100%, 0 0, 100% 0);
  `;
  
  /* MOUTH */
  
  export const CatMouth = styled.div`
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translateX(-50%);
    width: 0.8rem;
    height: 0.4rem;
  
    &::before,
    &::after {
      content: "";
      position: absolute;
      width: 0.4rem;
      height: 0.3rem;
      border-bottom: 2px solid rgb(var(--foreground));
      border-radius: 0 0 60% 60%;
    }
  
    &::before {
      left: 0;
    }
  
    &::after {
      right: 0;
    }
  `;
  
  /* WHISKERS */
  
  export const CatWhiskers = styled.div`
    position: absolute;
    bottom: 22%;
    left: 50%;
    transform: translateX(-50%);
    width: 80%;
    height: 0.5rem;
  
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 80%;
      width: 40%;
      border-top: 1px solid rgb(var(--background));
    }
  
    &::before {
      left: 0;
      transform: translateY(-50%) rotate(-7deg);
    }
  
    &::after {
      right: 0;
      transform: translateY(-50%) rotate(7deg);
    }
  `;
  
  /* TAIL */
  
  export const CatTail = styled.div`
    position: absolute;
    bottom: -4%;
    right: -25%;
  
    width: 1.4rem;
    height: 0.5rem;
  
    border: 3px solid #020617;
    border-left: none;
  
    border-radius: 0 999px 999px 0;
  
    opacity: 0;
    transform: translateX(-5px);
  
    transition: all 0.25s ease;
  
    ${LogoWrapper}:hover & {
      opacity: 1;
      transform: translateX(0px);
    }
  `;