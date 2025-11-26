"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/product");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main className="container">
      <h1>Welcome to Zero to One</h1>
    </main>
  );
}
