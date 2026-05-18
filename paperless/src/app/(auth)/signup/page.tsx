import SignUpClient from "@/app/_components/ui/SignUpClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return <SignUpClient />;
}
