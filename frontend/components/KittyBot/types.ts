export type KittyMessageRole = 'user' | 'assistant';

export interface KittyMessage {
  id: string;
  role: KittyMessageRole;
  text: string;
}

export interface KittyBotChatProps {
  /**
   * compact  = small card used for the floating button
   * full     = wider, taller layout used in the main Kitty Bot tab
   */
  variant?: 'compact' | 'full';
}

