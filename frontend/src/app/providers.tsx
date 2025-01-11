"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import Header from "@/components/header";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import theme from "@/theme";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript/InitColorSchemeScript";
import { SessionProvider } from "next-auth/react";

export default function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();
  return (
    <>
      <SessionProvider>
        <InitColorSchemeScript attribute="class" />
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header />
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </SessionProvider>
    </>
  );
}
