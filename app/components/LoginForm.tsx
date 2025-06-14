"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type LoginResult = {
  ok: boolean;
  data: unknown;
};

type LoginFormProps = {
  onLoginResult?: (result: LoginResult) => void;
};

export default function LoginForm({ onLoginResult }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      onLoginResult?.({ ok: true, data });
    } else {
      onLoginResult?.({ ok: false, data });
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300"
          />

          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#19287A] text-white font-semibold py-3 rounded-lg hover:bg-[#0C8F8F] transition cursor-pointer"
        >
          Login
        </Button>
      </form>
    </>
  );
}
