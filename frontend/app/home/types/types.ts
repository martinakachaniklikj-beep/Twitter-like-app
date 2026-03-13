import {
  Bell,
  Bookmark,
  Cat,
  Compass,
  HomeIcon,
  MessageCircle,
  Plus,
  Settings,
  User,
  Users,
  type LucideIcon,
} from 'lucide-react';

export const HomeLabels = {
  appTitle: 'Twitter',
  logoutButton: 'Logout',
  logoutButtonShort: 'Logout',
  feedTab: 'Feed',
  profileTab: 'Profile',
  notificationsTab: 'Notifications',
  settingsTab: 'Settings',
  messagesTab: 'Messages',
  bookmarksTab: 'Saved',
  followersTab: 'Followers',
  exploreTab: 'Explore',
  trendingTab: 'Trending',
  kittyBotTab: 'Kitty bot',
  loggedInAs: 'Logged in as',
  loading: 'Loading...',
  sidebarCollapse: 'Collapse sidebar',
  sidebarExpand: 'Expand sidebar',
  createPostTab: 'Post',
} as const;

export type Tab =
  | 'feed'
  | 'createPost'
  | 'profile'
  | 'notifications'
  | 'settings'
  | 'messages'
  | 'bookmarks'
  | 'followers'
  | 'explore'
  | 'kittyBot';

export interface TabConfigItem {
  id: Tab;
  label: string;
  Icon: LucideIcon;
}

export const TAB_CONFIG: TabConfigItem[] = [
  { id: 'feed', label: HomeLabels.feedTab, Icon: HomeIcon },
  { id: 'createPost', label: HomeLabels.createPostTab, Icon: Plus },
  { id: 'profile', label: HomeLabels.profileTab, Icon: User },
  { id: 'explore', label: HomeLabels.exploreTab, Icon: Compass },
  { id: 'kittyBot', label: HomeLabels.kittyBotTab, Icon: Cat },
  { id: 'notifications', label: HomeLabels.notificationsTab, Icon: Bell },
  { id: 'messages', label: HomeLabels.messagesTab, Icon: MessageCircle },
  { id: 'bookmarks', label: HomeLabels.bookmarksTab, Icon: Bookmark },
  { id: 'followers', label: HomeLabels.followersTab, Icon: Users },
  { id: 'settings', label: HomeLabels.settingsTab, Icon: Settings },
];
