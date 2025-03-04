"use client";

import dynamic from "next/dynamic";

// Dynamically import the QuantumGomoku component with no SSR to avoid hydration issues
const QuantumGomoku = dynamic(() => import("@/components/quantum-gomoku"), {
  ssr: false,
});

export default function Home() {
  return (
    <main className="min-h-screen">
      <QuantumGomoku />
    </main>
  );
}
