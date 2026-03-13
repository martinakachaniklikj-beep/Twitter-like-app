import { styled } from "styled-components";
import { InspirationKind } from "./types/types";

const Card = styled.div`
  margin-top: 1rem;
  padding: 0.9rem;
  border-radius: 1.2rem;
  border: 1px solid rgb(var(--border));
  background: rgb(var(--card));
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const TitleBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
`;

const Title = styled.span`
  font-size: 0.9rem;
  font-weight: 600;
  color: rgb(var(--foreground));
`;

const Subtitle = styled.span`
  font-size: 0.75rem;
  color: rgb(var(--muted-foreground));
`;

const DotsWrapper = styled.div`
  display: inline-flex;
  padding: 0.15rem;
  border-radius: 999px;
  background: rgba(var(--muted-foreground), 0.08);
  gap: 0.2rem;
`;

const CarouselDot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? '0.8rem' : '0.5rem')};
  height: 0.3rem;
  border-radius: 999px;
  border: none;
  background: ${({ $active }) =>
    $active
      ? 'rgb(var(--primary))'
      : 'rgba(var(--muted-foreground),0.45)'};
  opacity: ${({ $active }) => ($active ? 1 : 0.6)};
  transition: all 160ms ease;
  cursor: pointer;
`;

const Carousel = styled.div<{ $kind: InspirationKind }>`
  position: relative;
  overflow: hidden;
  border-radius: 1rem;
  background: ${({ $kind }) =>
    $kind === 'premium'
      ? 'linear-gradient(135deg, rgba(251,191,36,0.16), rgba(56,189,248,0.06))'
      : 'rgba(var(--background),0.7)'};
`;

const Slides = styled.div<{ $index: number }>`
  display: flex;
  transform: ${({ $index }) => `translateX(-${$index * 100}%)`};
  transition: transform 260ms ease;
`;


const Slide = styled.div`
  flex: 0 0 100%;
  padding: 0.85rem;
  box-sizing: border-box;

  min-width: 0;
`;


const SlideText = styled.p`
  font-size: 0.86rem;
  line-height: 1.45;
  color: rgb(var(--foreground));
  margin: 0;

  white-space: normal;
  word-break: break-word;
  overflow-wrap: anywhere;
`;



const PremiumButton = styled.button`
  margin-top: 0.7rem;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  border: none;
  font-size: 0.78rem;
  font-weight: 600;
  background: rgb(var(--primary));
  color: rgb(var(--primary-foreground));
  cursor: not-allowed;
  opacity: 0.85;
`;

export { Card, Header, TitleBlock, Title, Subtitle, DotsWrapper, CarouselDot, Carousel, Slides, Slide, SlideText, PremiumButton };