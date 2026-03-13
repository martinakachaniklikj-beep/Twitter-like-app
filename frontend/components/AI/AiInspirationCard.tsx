'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { aiServices } from '@/services/aiServices';

import type { InspirationSlide } from './types/types';
import { ROTATION_INTERVAL_MS } from './types/constants';
import {
  Card,
  Header,
  TitleBlock,
  Title,
  Subtitle,
  DotsWrapper,
  Carousel,
  Slides,
  Slide,
  SlideText,
  PremiumButton,
  CarouselDot,
} from './AiInspirationCard.styled';

const FALLBACK_QUOTE = '"Creativity is intelligence having fun." — Share something kind today.';
const FALLBACK_JOKE =
  'Why did the tweet cross the timeline? To get a little more engagement on the other side.';

export function AiInspirationCard() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { user } = useAuth();

  const disabled = true;

  const { data: quoteData } = useQuery({
    queryKey: ['inspiration', 'quote'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return aiServices.getInspiration(token, 'quote');
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });

  const { data: jokeData } = useQuery({
    queryKey: ['inspiration', 'joke'],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) throw new Error('Not authenticated');
      return aiServices.getInspiration(token, 'joke');
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: false,
  });

  const slides: InspirationSlide[] = useMemo(
    () => [
      {
        kind: 'quote',
        title: 'Daily Wit',
        subtitle: 'Quote of the day',
        body: quoteData?.text ?? FALLBACK_QUOTE,
      },
      {
        kind: 'joke',
        title: 'Daily Wit',
        subtitle: 'Joke of the day',
        body: jokeData?.text ?? FALLBACK_JOKE,
      },
      {
        kind: 'premium',
        title: 'Daily Wit',
        subtitle: 'Unlock Premium',
        body: 'Upgrade to Premium to unlock unlimited AI quotes, smarter inspiration, and tailored suggestions for your posts.',
        ctaLabel: 'Subscribe to Premium',
      },
    ],
    [quoteData?.text, jokeData?.text],
  );

  const activeSlide = slides[activeIndex] ?? slides[0];

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, ROTATION_INTERVAL_MS);

    return () => window.clearInterval(id);
  }, [slides.length]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <Card>
      <Header>
        <TitleBlock>
          <Title>{activeSlide.title}</Title>
          <Subtitle>{activeSlide.subtitle}</Subtitle>
        </TitleBlock>

        <DotsWrapper>
          {slides.map((slide, index) => (
            <CarouselDot
              key={slide.kind}
              $active={index === activeIndex}
              onClick={() => handleDotClick(index)}
              aria-label={slide.subtitle}
            />
          ))}
        </DotsWrapper>
      </Header>

      <Carousel $kind={activeSlide.kind}>
        <Slides $index={activeIndex}>
          {slides.map((slide) => (
            <Slide key={slide.kind}>
              <SlideText>{slide.body}</SlideText>

              {slide.kind === 'premium' && slide.ctaLabel && (
                <PremiumButton disabled={disabled}>{slide.ctaLabel}</PremiumButton>
              )}
            </Slide>
          ))}
        </Slides>
      </Carousel>
    </Card>
  );
}
