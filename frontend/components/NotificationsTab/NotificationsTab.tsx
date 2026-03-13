'use client';

import { useEffect, useRef, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getToken } from 'firebase/messaging';
import { useAuth } from '@/contexts/AuthContext';
import { getMessagingSafely } from '@/lib/firebase';
import { apiUrl, notificationServices, type ApiNotification } from '@/services/notificationServices';
import { useChatSocket } from '@/contexts/ChatSocketContext';
import { chatServices } from '@/services/chatServices';
import { useRouter } from 'next/navigation';
import type { Filter, NotificationsTabProps } from './types';
import { FILTERS, formatDateTime, parseGroupInvite } from './utils';

export default function NotificationsTab({ searchQuery = '', onCompose }: NotificationsTabProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>('all');
  const [justSeenIds, setJustSeenIds] = useState<string[]>([]);
  const { onNotificationNew } = useChatSocket();
  const router = useRouter();

  const observerRef = useRef<IntersectionObserver | null>(null);
  const notificationsRef = useRef<ApiNotification[]>([]);
  const viewedUnreadIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    const registerPushToken = async () => {
      if (!user) return;

      try {
        const messaging = await getMessagingSafely();
        if (!messaging) {
          return;
        }

        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          return;
        }

        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        const fcmToken = await getToken(messaging, vapidKey ? { vapidKey } : undefined);

        if (!fcmToken) {
          return;
        }

        const idToken = await user.getIdToken();

        await fetch(`${apiUrl}/notifications/token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            userId: user.uid,
            token: fcmToken,
          }),
        });
      } catch {
        // silently ignore push registration failures
      }
    };

    void registerPushToken();
  }, [user]);

  const { data, isLoading, isError, refetch, isFetching } = useQuery<ApiNotification[]>({
    queryKey: ['notifications', filter],
    queryFn: async () => {
      const token = await user?.getIdToken();
      if (!token) {
        throw new Error('Not authenticated');
      }
      return notificationServices.fetchNotifications(token, filter);
    },
    enabled: !!user,
    staleTime: 0,
    refetchOnWindowFocus: true,
  });

  const notifications = data ?? [];
  notificationsRef.current = notifications;

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredNotifications =
    !normalizedQuery.length
      ? notifications
      : notifications.filter((n) => {
          const message = n.message.toLowerCase();
          const type = String(n.type).toLowerCase();
          return message.includes(normalizedQuery) || type.includes(normalizedQuery);
        });

  useEffect(() => {
    const unsubscribe = onNotificationNew((notification) => {
      // Update the currently active filter list
      queryClient.setQueryData<ApiNotification[] | undefined>(
        ['notifications', filter],
        (prev) => {
          const current = prev ?? [];

          if (current.some((n) => n.id === notification.id)) {
            return current;
          }

          if (filter !== 'all' && notification.type !== filter) {
            return current;
          }

          return [notification, ...current].slice(0, 50);
        },
      );

      // Also make sure the badge source list stays up to date
      queryClient.setQueryData<ApiNotification[] | undefined>(
        ['notifications', 'badge'],
        (prev) => {
          const current = prev ?? [];
          if (current.some((n) => n.id === notification.id)) {
            return current;
          }
          return [notification, ...current];
        },
      );
    });

    return unsubscribe;
  }, [filter, onNotificationNew, queryClient]);

  useEffect(() => {
    if (!user || notifications.length === 0) return;

    const unreadIds = notifications.filter((n) => !n.readAt).map((n) => n.id);
    if (!unreadIds.length) return;

    // Highlight current unread notifications when opening the tab.
    setJustSeenIds(unreadIds);

    const clearHighlightTimeoutId = window.setTimeout(() => {
      setJustSeenIds([]);
    }, 3000);

    return () => {
      window.clearTimeout(clearHighlightTimeoutId);
    };
  }, [user, notifications]);

  const handleNotificationClick = async (notification: ApiNotification) => {
    if (!user) return;

    try {
      const token = await user.getIdToken();
      await notificationServices.markOneAsRead(token, notification.id);

      queryClient.setQueryData<ApiNotification[] | undefined>(
        ['notifications', filter],
        (prev) =>
          prev?.map((n) =>
            n.id === notification.id ? { ...n, readAt: new Date().toISOString() } : n,
          ) ?? prev,
      );

      queryClient.setQueryData<ApiNotification[] | undefined>(
        ['notifications', 'badge'],
        (prev) =>
          prev?.map((n) =>
            n.id === notification.id ? { ...n, readAt: new Date().toISOString() } : n,
          ) ?? prev,
      );
    } catch {
      // ignore read failures
    }

    if (notification.type !== 'system') {
      return;
    }

    if (notification.message.startsWith('GROUP_INVITE|')) {
      return;
    }

    const lower = notification.message.toLowerCase();
    const isBirthdayNotification = lower.includes('birthday');
    if (!isBirthdayNotification) {
      return;
    }

    const match = notification.message.match(/@([A-Za-z0-9_]+)/);
    if (!match) {
      return;
    }

    const username = match[1];
    const prefill = `@${username} Happy birthday! 🎂 `;

    if (onCompose) {
      onCompose(prefill);
      return;
    }

    router.push(`/home?compose=${encodeURIComponent(prefill)}`);
  };

  useEffect(() => {
    if (!user) return;

    const observer = new IntersectionObserver(
      (entries) => {
        void (async () => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const target = entry.target as HTMLElement;
            const id = target.dataset.notificationId;
            if (!id) continue;

            if (viewedUnreadIdsRef.current.has(id)) {
              observer.unobserve(target);
              continue;
            }

            const currentList = notificationsRef.current;
            const notif = currentList.find((n) => n.id === id);
            if (!notif || notif.readAt) {
              observer.unobserve(target);
              continue;
            }

            viewedUnreadIdsRef.current.add(id);

            try {
              const token = await user.getIdToken();
              await notificationServices.markOneAsRead(token, id);

              const nowIso = new Date().toISOString();

              queryClient.setQueryData<ApiNotification[] | undefined>(
                ['notifications', filter],
                (prev) =>
                  prev?.map((n) =>
                    n.id === id ? { ...n, readAt: nowIso } : n,
                  ) ?? prev,
              );

              queryClient.setQueryData<ApiNotification[] | undefined>(
                ['notifications', 'badge'],
                (prev) =>
                  prev?.map((n) =>
                    n.id === id ? { ...n, readAt: nowIso } : n,
                  ) ?? prev,
              );
            } catch {
              // ignore failures – item will stay unread
            } finally {
              observer.unobserve(target);
            }
          }
        })();
      },
      {
        threshold: 0.6,
      },
    );

    observerRef.current = observer;

    return () => {
      observer.disconnect();
      observerRef.current = null;
      viewedUnreadIdsRef.current.clear();
    };
  }, [user, filter, queryClient]);

  const handleGroupInviteAction = async (notification: ApiNotification, action: 'accept' | 'deny') => {
    const parsed = parseGroupInvite(notification);
    if (!parsed || !user) return;
    try {
      const token = await user.getIdToken();
      await chatServices.respondToGroupInvite(token, parsed.inviteId, action);
      await refetch();
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    } catch {
      // ignore for now
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-xs px-3 py-1 rounded-full border border-border text-foreground/80 hover:bg-accent disabled:opacity-50"
        >
          Refresh
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`px-3 py-1 text-xs rounded-full border ${
              filter === f.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'border-border text-foreground/80 hover:bg-accent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {isLoading && (
        <div className="text-sm text-muted-foreground py-8 text-center">Loading notifications…</div>
      )}

      {isError && !isLoading && (
        <div className="text-sm text-red-500 py-4 text-center">
          Failed to load notifications. Try refreshing.
        </div>
      )}

      {!isLoading && !filteredNotifications.length && !isError && (
        <div className="text-sm text-muted-foreground py-8 text-center">
          No notifications yet. They&apos;ll show up here when you have activity.
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {filteredNotifications.map((n) => {
          const invite = parseGroupInvite(n);
          const isBirthdayNotification =
            n.type === 'system' &&
            !invite &&
            n.message.toLowerCase().includes('birthday');

          return (
            <li
              key={n.id}
              data-notification-id={n.id}
              className={`rounded-xl border border-border p-3 flex flex-col gap-1 transition-colors ${
                justSeenIds.includes(n.id) ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-card'
              } ${!invite && n.type === 'system' ? 'cursor-pointer hover:bg-accent/60' : ''}`}
              ref={(el) => {
                if (!el) return;
                if (observerRef.current) {
                  observerRef.current.observe(el);
                }
              }}
              onClick={() => handleNotificationClick(n)}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {n.type}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground">
                    {formatDateTime(n.createdAt)}
                  </span>
                  {n.readAt && (
                    <button
                      type="button"
                      className="text-[11px] text-muted-foreground hover:text-foreground"
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (!user) return;
                        try {
                          const token = await user.getIdToken();
                          await notificationServices.deleteOne(token, n.id);
                          queryClient.setQueryData<ApiNotification[] | undefined>(
                            ['notifications', filter],
                            (prev) => prev?.filter((x) => x.id !== n.id),
                          );
                          queryClient.setQueryData<ApiNotification[] | undefined>(
                            ['notifications', 'badge'],
                            (prev) => prev?.filter((x) => x.id !== n.id),
                          );
                        } catch {
                          // ignore delete failures
                        }
                      }}
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
              {invite ? (
                <>
                  <p className="text-sm text-foreground">
                    {invite.actorName} invited you to join <span className="font-semibold">{invite.groupName}</span>.
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      className="px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleGroupInviteAction(n, 'accept');
                      }}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="px-3 py-1 text-xs rounded-full border border-border text-foreground/80 hover:bg-accent"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleGroupInviteAction(n, 'deny');
                      }}
                    >
                      Deny
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <p className="text-sm text-foreground">{n.message}</p>
                  {isBirthdayNotification && (
                    <button
                      type="button"
                      className="self-start px-3 py-1 text-xs rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleNotificationClick(n);
                      }}
                    >
                      Wish them a happy birthday
                    </button>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

