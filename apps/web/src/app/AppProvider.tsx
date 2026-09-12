"use client";

import { Toaster } from "@/components/ui/sonner";
import { UserContext } from "@/context/user-context";
import { refreshableQuery } from "@/helpers/funcs/refreshable-query";
import { getUserInform } from "@/services/user-service";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 15 * 1000,
    },
  },
});

export function AppProvider({ children }: { children: ReactNode }) {
  const { data: user } = useQuery(
    {
      queryKey: ["userInform"],
      queryFn: async () => {
        const res = await refreshableQuery(() => getUserInform());

        if (!res.success) return null;
        return res.data;
      },
    },
    queryClient,
  );

  return (
    <QueryClientProvider client={queryClient}>
      <UserContext value={user}>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </UserContext>
    </QueryClientProvider>
  );
}
