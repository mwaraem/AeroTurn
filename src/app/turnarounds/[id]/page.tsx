import React from "react";
import { notFound } from "next/navigation";
import { MOCK_TURNAROUNDS } from "@/lib/mock-data";
import { TurnaroundDetailClient } from "@/components/turnaround/TurnaroundDetailClient";

interface TurnaroundDetailPageProps {
  params: {
    id: string;
  };
}

export function generateStaticParams() {
  return MOCK_TURNAROUNDS.map((t) => ({
    id: t.id,
  }));
}

export default function TurnaroundDetailPage({
  params,
}: TurnaroundDetailPageProps) {
  const turnaround = MOCK_TURNAROUNDS.find((t) => t.id === params.id);

  if (!turnaround) {
    notFound();
  }

  return <TurnaroundDetailClient initialTurnaround={turnaround} />;
}
