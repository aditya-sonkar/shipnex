"use client";

import dynamic from "next/dynamic";

const AiShipmentAssistant = dynamic(() => import("./AiShipmentAssistant"), { ssr: false });

export default function AiAssistantLazy() {
  return <AiShipmentAssistant />;
}

