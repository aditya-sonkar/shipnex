"use client";

import { ScanLine, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import QRModal from "@/app/components/QRModal/QRModal";

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState("");
  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [useCamera, setUseCamera] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scannerRef = useRef<any>(null);

  // Keep focus on the invisible input so physical barcode scanners always type into it
  useEffect(() => {
    if (useCamera) return;
    const focusInput = () => inputRef.current?.focus();
    window.addEventListener("click", focusInput);
    focusInput();
    return () => window.removeEventListener("click", focusInput);
  }, [useCamera]);

  // We moved the camera logic to QRModal component

  const processBarcode = async (code: string) => {
    if (!code.trim()) return;

    setStatus("scanning");
    setMessage("Looking up consignment...");

    try {
      // 1. Lookup shipment by tracking ID
      const trackRes = await fetch(`/api/track/${code.trim()}`);
      const trackData = await trackRes.json();

      if (trackData.error) {
        setStatus("error");
        setMessage(trackData.error || "Consignment not found.");
        setBarcode("");
        return;
      }

      // 2. Update status to "at_hub"
      setMessage(`Found shipment. Updating status...`);
      const updateRes = await fetch(`/api/shipments/${trackData.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: "at_hub",
          description: "Package received and sorted at processing facility.",
        }),
      });

      const updateData = await updateRes.json();
      if (updateData.error) {
        setStatus("error");
        setMessage(updateData.error);
      } else {
        setStatus("success");
        setMessage(`Consignment ${code} successfully registered at hub.`);
      }
    } catch (error: any) {
      setStatus("error");
      setMessage("System error processing barcode.");
    }

    setBarcode("");
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    processBarcode(barcode);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 mt-12">
      <div className="text-center space-y-3">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-zinc-150 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-foreground shadow-sm mb-6">
          <ScanLine size={28} />
        </div>
        <h2 className="font-heading font-light text-4xl tracking-tight text-foreground">
          Hub Barcode Scanner
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Ensure your scanner is connected. Focus is locked automatically.
        </p>
      </div>

      <div className="relative bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl p-12 overflow-hidden shadow-xl shadow-zinc-200/20 dark:shadow-black/20">
        
        {/* Invisible form meant to capture physical scanner keyboard emulation */}
        <form onSubmit={handleScan} className="relative z-10">
          <input
            ref={inputRef}
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            className="w-full bg-transparent border-b-2 border-zinc-300 dark:border-zinc-700 text-center text-3xl font-mono py-4 focus:outline-none focus:border-foreground transition-colors"
            placeholder="Awaiting Scan..."
            autoFocus
          />
          <button type="submit" className="hidden">Submit</button>
        </form>

        <div className="mt-12 text-center h-16 flex items-center justify-center">
          {status === "idle" && (
            <p className="text-zinc-400 text-sm tracking-widest uppercase font-bold animate-pulse">
              Ready to scan next package
            </p>
          )}
          
          {status === "scanning" && (
            <div className="flex items-center gap-3 text-zinc-500">
              <ScanLine className="animate-spin" size={20} />
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {status === "success" && (
            <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 px-6 py-3 rounded-full border border-emerald-200/50 dark:border-emerald-900/50">
              <CheckCircle2 size={20} />
              <p className="text-sm font-bold tracking-wide">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-3 text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-950/30 px-6 py-3 rounded-full border border-red-200/50 dark:border-red-900/50">
              <XCircle size={20} />
              <p className="text-sm font-bold tracking-wide">{message}</p>
            </div>
          )}
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={() => setUseCamera(true)}
          className="px-6 py-3 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400 font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 hover:bg-blue-100 active:scale-[0.97] transition-all cursor-pointer"
        >
          <ScanLine size={16} />
          Use Device Camera
        </button>
      </div>

      {/* Scanner Modal */}
      <QRModal 
        isOpen={useCamera} 
        onClose={() => setUseCamera(false)} 
        onScan={(decodedText) => {
          setUseCamera(false);
          setBarcode(decodedText);
          processBarcode(decodedText);
        }} 
        readerId="hub-reader" 
      />
    </div>
  );
}
