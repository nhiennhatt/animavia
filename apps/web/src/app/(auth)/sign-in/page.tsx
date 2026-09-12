import { SignIn } from "@/modules/auth/SignIn";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng nhập | Animavia"
}

export default function SignInPage() {
  return <SignIn />;
}
