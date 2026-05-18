import LoginClient from "@/app/_components/ui/LoginClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login",
};

export default function LoginPage() {
  return <LoginClient />;
}
