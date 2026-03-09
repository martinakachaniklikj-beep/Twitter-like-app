import { Bell, Bookmark, Compass, HomeIcon, MessageCircle, Settings, User, Users, type LucideIcon } from 'lucide-react';
import { HomeLabels } from './home.styles';

export type Tab =
  | 'feed'
  | 'profile'
  | 'notifications'
  | 'settings'
  | 'messages'
  | 'bookmarks'
  | 'followers'
  | 'explore';

export interface TabConfigItem {
  id: Tab;
  label: string;
  Icon: LucideIcon;
}

export const TAB_CONFIG: TabConfigItem[] = [
  { id: 'feed', label: HomeLabels.feedTab, Icon: HomeIcon },
  { id: 'profile', label: HomeLabels.profileTab, Icon: User },
  { id: 'explore', label: HomeLabels.exploreTab, Icon: Compass },
  { id: 'notifications', label: HomeLabels.notificationsTab, Icon: Bell },
  { id: 'messages', label: HomeLabels.messagesTab, Icon: MessageCircle },
  { id: 'bookmarks', label: HomeLabels.bookmarksTab, Icon: Bookmark },
  { id: 'followers', label: HomeLabels.followersTab, Icon: Users },
  { id: 'settings', label: HomeLabels.settingsTab, Icon: Settings },
];
