'use client';

import { SyntheticEvent, useState } from 'react';
import { Cat } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import type { KittyBotChatProps, KittyMessage } from './types';
import { KITTY_INTRO_TEXT } from './constants';

export function KittyBotChat({ variant = 'compact' }: KittyBotChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<KittyMessage[]>(() =>
    variant === 'full'
      ? []
      : [
          {
            id: 'welcome',
            role: 'assistant',
            text: KITTY_INTRO_TEXT,
          },
        ],
  );
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isFullLayout = variant === 'full';
  const hasMessages = messages.length > 0;

  const handleSend = async (e: SyntheticEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    if (!user) {
      setError('You need to be logged in to chat with Kitty Bot.');
      return;
    }

    setError(null);
    setSending(true);

    try {
      const token = await user.getIdToken();

      const userMessage: KittyMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        text: trimmed,
      };

      const baseIntroLine = `Kitty Bot: ${KITTY_INTRO_TEXT}`;

      const conversationText = [baseIntroLine, ...messages, userMessage]
        .map((m) =>
          typeof m === 'string' ? m : `${m.role === 'assistant' ? 'Kitty Bot' : 'User'}: ${m.text}`,
        )
        .join('\n');

      setMessages((prev) => [...prev, userMessage]);
      setInput('');

      const res = await fetch('/api/geminiAi/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: conversationText }),
      });

      if (!res.ok) {
        throw new Error(`Kitty Bot request failed with status ${res.status}`);
      }

      const data = (await res.json()) as { reply?: string };
      const replyText =
        (data.reply ?? '').trim() ||
        'Hmm, my whiskers are confused right now. Try asking in a different way?';

      const botMessage: KittyMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: replyText,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error('Kitty Bot chat failed', err);
      setError('Kitty Bot is taking a cat nap. Please try again in a moment.');
    } finally {
      setSending(false);
    }
  };

  if (isFullLayout) {
    return (
      <div className="flex flex-col h-[70vh] text-sm text-foreground">
        <div className="flex items-center justify-center gap-2 py-3 border-b border-border bg-background/80 backdrop-blur-sm">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
            <Cat className="h-5 w-5 text-primary" />
          </div>
          <span className="font-semibold">Kitty Bot</span>
        </div>

        {hasMessages ? (
          <>
            <div className="pb-3">
              <h2 className="text-base font-semibold text-center mb-1">Kitty Bot</h2>
              <p className="text-xs text-muted-foreground text-center max-w-xl mx-auto">
                {KITTY_INTRO_TEXT}
              </p>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap text-sm ${
                      m.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted text-foreground rounded-bl-sm'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-4 py-6 text-center space-y-3">
            <h1 className="text-2xl md:text-3xl font-semibold">Welcome to Kitty Bot</h1>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              {KITTY_INTRO_TEXT}
            </p>
            <p className="text-xs md:text-sm text-muted-foreground/80 max-w-md mx-auto">
              Start a conversation below and I&apos;ll help you brainstorm tweets, answer questions,
              or just keep you company.
            </p>
          </div>
        )}

        {error && <div className="px-4 pb-2 text-xs text-red-500 font-medium">{error}</div>}

        <form
          onSubmit={handleSend}
          className="pt-2 pb-4 px-3 border-t border-border flex justify-center bg-background/80 backdrop-blur"
        >
          <div className="w-full max-w-2xl flex items-center gap-3 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Send a message to Kitty Bot..."
              className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              className="text-xs font-medium px-4 py-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? 'Meowing...' : 'Send'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border shadow-2xl overflow-hidden text-sm bg-white text-black">
      <div className="px-4 py-2 border-b border-border flex items-center justify-between bg-white">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
            <Cat className="h-4 w-4 text-primary" />
          </div>
          <div className="font-bold">Kitty Bot</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-white max-h-72">
        {messages.map((m) => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`px-3 py-2 rounded-2xl max-w-[80%] whitespace-pre-wrap font-semibold ${
                m.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-sm'
                  : 'bg-muted text-foreground rounded-bl-sm'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {error && (
        <div className="px-3 py-2 text-xs text-red-600 border-t border-border bg-red-50 font-semibold">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 px-4 py-3 border-t border-border bg-white"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Kitty Bot anything..."
          className="flex-1 bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="text-xs font-medium px-3 py-1.5 rounded-full bg-primary text-primary-foreground disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {sending ? 'Meowing...' : 'Send'}
        </button>
      </form>
    </div>
  );
}
