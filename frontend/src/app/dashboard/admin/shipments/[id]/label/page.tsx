"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import QRCode from "react-qr-code";
import Barcode from "react-barcode";

interface Shipment {
  id: string;
  trackingNumber: string;
  senderName: string;
  senderAddress: string;
  receiverName: string;
  receiverAddress: string;
  weight: number;
  status: string;
  createdAt: string;
}

export default function ShippingLabelPage() {
  const params = useParams();
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.id) return;
    fetch(`http://localhost:5000/api/shipments/${params.id}`, { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        setShipment(data);
        // Automatically trigger print dialog once data and images load
        setTimeout(() => window.print(), 500);
      })
      .catch(() => setError(true));
  }, [params.id]);

  if (error) {
    return <div className="p-10 text-center font-bold text-red-500">Error loading label</div>;
  }

  if (!shipment) {
    return <div className="p-10 text-center text-sm text-zinc-500 animate-pulse">Loading Label Data...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-200 flex items-start justify-center p-8 print:p-0 print:bg-white">
      {/* 4x6 Label Container (400px x 600px approx) */}
      <div className="w-[4in] h-[6in] bg-white text-black border-2 border-black p-4 flex flex-col justify-between print:border-none print:w-[4in] print:h-[6in]">
        
        {/* Header section */}
        <div className="border-b-2 border-black pb-3 flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-tighter">SHIPNEX</h1>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-1">Priority Logistics</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black">{shipment.weight} KG</p>
            <p className="text-[10px] font-bold">ACTUAL WEIGHT</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="flex-1 py-4 flex flex-col justify-center space-y-6">
          <div className="border-l-4 border-black pl-3">
            <p className="text-xs font-bold uppercase text-zinc-500 mb-1">From</p>
            <p className="text-sm font-bold uppercase">{shipment.senderName}</p>
            <p className="text-xs uppercase leading-tight mt-0.5 max-w-[200px]">{shipment.senderAddress}</p>
          </div>

          <div className="border-l-4 border-black pl-3">
            <p className="text-xs font-bold uppercase text-zinc-500 mb-1">To</p>
            <p className="text-xl font-black uppercase leading-none">{shipment.receiverName}</p>
            <p className="text-sm font-bold uppercase leading-snug mt-1.5 max-w-[250px]">{shipment.receiverAddress}</p>
          </div>
        </div>

        {/* Barcode Section (1D Code 128) */}
        <div className="border-t-2 border-black pt-4 flex flex-col items-center">
          <div className="w-full flex justify-center scale-90 -mb-2">
            <Barcode 
              value={shipment.trackingNumber} 
              width={2.5} 
              height={70} 
              displayValue={false}
              margin={0}
              background="#ffffff"
            />
          </div>
          <p className="font-mono font-bold text-lg tracking-[0.2em] mt-1">{shipment.trackingNumber}</p>
        </div>

        {/* Footer (QR Code & Date) */}
        <div className="border-t-2 border-black pt-3 mt-3 flex justify-between items-end">
          <div>
            <p className="text-[10px] font-bold text-zinc-500">DATE</p>
            <p className="text-xs font-bold">{new Date(shipment.createdAt).toLocaleDateString()}</p>
            <p className="text-[10px] mt-2 font-bold text-zinc-500">REF: {shipment.id.slice(-6).toUpperCase()}</p>
          </div>
          
          <div className="p-1 border border-black/20">
            <QRCode
              value={shipment.trackingNumber}
              size={128}
              level="M"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
