import { ReactNode } from "react";

export default function OAuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-center flex-1 h-full">{children}</div>
  );
}
