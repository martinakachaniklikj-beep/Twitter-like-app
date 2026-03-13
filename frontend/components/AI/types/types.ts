type InspirationKind = 'quote' | 'joke' | 'premium';

type InspirationSlide = {
  kind: InspirationKind;
  title: string;
  subtitle: string;
  body: string;
  ctaLabel?: string;
};

export type { InspirationKind, InspirationSlide };
