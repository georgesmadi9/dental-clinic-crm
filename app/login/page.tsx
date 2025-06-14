"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import LoginForm from "../components/LoginForm";
import { Toaster } from "sonner";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [loginResult, setLoginResult] = useState<unknown>(null);

  const router = useRouter();

  useEffect(() => {
    if (loginResult === null) return;
    if (typeof loginResult === "object" && loginResult !== null && "ok" in loginResult && (loginResult as { ok: boolean }).ok) {
      toast.success("Login successful!");
      toast.success("Welcome Jad Madi!");
      router.push("/cases");
    } else {
      toast.error("Login failed. Please try again.");
    }
  }, [loginResult, router]);

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center px-4 bg-black overflow-hidden">
        {/* Blurred dental-themed background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/dental-bg.jpg" // Place a suitable dental clinic image in your public/ folder with this name
            alt="Dental Clinic Background"
            fill
            className="object-cover w-full h-full blur-[6px] brightness-75"
            priority
          />
        </div>
        {/* Login Card */}
        <Card className="w-3xl max-w-xl z-10 shadow-2xl bg-white backdrop-blur-md">
          <CardHeader>
            <Image
              src="/logo.png"
              alt="FMD Logo"
              width={150}
              height={150}
              className="mx-auto pb-2"
            />
            <CardTitle className="text-center text-[#19287A]">
              Welcome to FMD&apos;s Dental Clinic CRM, please login to proceed!
            </CardTitle>
          </CardHeader>
          <Separator />
          <CardContent>
            <LoginForm onLoginResult={setLoginResult} />
          </CardContent>
        </Card>
      </div>

      <Toaster richColors expand visibleToasts={5} />
    </>
  );
};

export default LoginPage;
