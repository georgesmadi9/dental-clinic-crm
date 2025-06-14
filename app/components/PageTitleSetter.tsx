"use client";

import { useEffect } from "react";
import { usePageTitle } from "../lib/NavbarPageContext";

export default function PageTitleSetter({ title }: { title: string }) {
  const { setTitle } = usePageTitle();

  useEffect(() => {
    setTitle(title);
    return () => setTitle("");
  }, [title, setTitle]);

  return null; // no UI needed
}
