"use client";

import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatSocketProvider } from "@/contexts/ChatSocketContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ChatSocketProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </ChatSocketProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
