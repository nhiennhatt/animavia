"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { UserContext } from "@/contexts/user.context";
import { refreshableQuery } from "@/lib/refreshable-query";
import { getAuthenticatedUserInform } from "@/services/user.service";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import { Toaster } from "sonner";

export function AppProvider({ children }: { children: ReactNode }) {
  const queryClient = new QueryClient();
  const { data: user, isLoading: isLoadingUser } = useQuery(
    {
      queryKey: ["authenticatedUser"],
      queryFn: async () => {
        const res = await refreshableQuery(getAuthenticatedUserInform);
        if (!res.success) return null;
        return res.data;
      },
      refetchOnMount: false,
    },
    queryClient,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext.Provider
        value={{ user: user || null, loading: isLoadingUser }}
      >
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </UserContext.Provider>
    </QueryClientProvider>
  );
}
