/// <reference types="node" />

const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api';

export type ModerationCategory = 'safe' | 'harassment' | 'hate' | 'spam' | 'sexual' | 'violence';

export interface ModerationResult {
  safe: boolean;
  category: ModerationCategory;
}

export interface HashtagCheckResult {
  hasMismatches: boolean;
  mismatchedTags: string[];
  warning: string;
}

export interface FixTextResult {
  text: string;
}

export interface ImageDescriptionResult {
  text: string;
}

export type InspirationKind = 'joke' | 'quote';

export interface InspirationResult {
  text: string;
  kind: InspirationKind;
}

export const aiServices = {
  async moderateText(token: string, text: string): Promise<ModerationResult> {
    try {
      const response = await fetch(`${apiUrl}/geminiAi/moderate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('Content moderation request failed with status:', response.status);
        throw new Error(`Content moderation request failed with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Content moderation request threw an error:', error);
      throw error instanceof Error
        ? error
        : new Error('Content moderation request threw an unknown error');
    }
  },

  async checkHashtags(token: string, text: string): Promise<HashtagCheckResult> {
    try {
      const response = await fetch(`${apiUrl}/geminiAi/check-hashtags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('Hashtag check request failed with status:', response.status);
        throw new Error(`Hashtag check request failed with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Hashtag check request threw an error:', error);
      return {
        hasMismatches: false,
        mismatchedTags: [],
        warning: 'Hashtag check could not be completed.',
      };
    }
  },

  async fixText(token: string, text: string): Promise<FixTextResult> {
    try {
      const response = await fetch(`${apiUrl}/geminiAi/fix-text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        console.error('Fix text request failed with status:', response.status);
        throw new Error(`Fix text request failed with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Fix text request threw an error:', error);
      return { text };
    }
  },

  async describeImage(
    token: string,
    base64: string,
    mimeType: string,
  ): Promise<ImageDescriptionResult> {
    try {
      const response = await fetch(`${apiUrl}/geminiAi/describe-image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ base64, mimeType }),
      });

      if (!response.ok) {
        console.error('Describe image request failed with status:', response.status);
        throw new Error(`Describe image request failed with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Describe image request threw an error:', error);
      return {
        text: 'Kitty Bot could not read this image right now.',
      };
    }
  },

  async getInspiration(token: string, kind: InspirationKind = 'quote'): Promise<InspirationResult> {
    try {
      const params = new URLSearchParams({ kind });
      const response = await fetch(`${apiUrl}/geminiAi/inspiration?${params.toString()}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        console.error('Inspiration request failed with status:', response.status);
        throw new Error(`Inspiration request failed with status: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Inspiration request threw an error:', error);
      return {
        text:
          kind === 'joke'
            ? 'Why did the tweet bring a cat to the timeline? For purr-sonal support.'
            : 'Take a breath, share something kind, and keep going.',
        kind,
      };
    }
  },
};
