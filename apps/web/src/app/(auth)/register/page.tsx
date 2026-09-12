import { Register } from "@/modules/auth/Register/Register";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Đăng ký | Animavia",
};

export default function RegisterPage() {
  return <Register />;
}
