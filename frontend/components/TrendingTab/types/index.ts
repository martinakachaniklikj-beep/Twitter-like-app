export type TrendingScope = 'global' | 'country';

export interface TrendingTabProps {
  /**
   * Initial scope for trending hashtags.
   * Defaults to "global" when not provided.
   */
  initialScope?: TrendingScope;

  /**
   * Currently active hashtag filter in the main feed (if any).
   * Used so the sidebar can visually reflect the selected hashtag.
   */
  activeHashtag?: string | null;

  /**
   * Called when the user clicks a hashtag chip so the main feed
   * can update its hashtag filter.
   */
  onHashtagSelect?: (hashtag: string) => void;
}
