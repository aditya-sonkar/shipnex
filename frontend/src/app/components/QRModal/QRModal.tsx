"use client";

import { useEffect, useRef } from "react";
import { ScanLine, XCircle } from "lucide-react";

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (decodedText: string) => void;
  readerId?: string;
}

export default function QRModal({ isOpen, onClose, onScan, readerId = "qr-reader" }: QRModalProps) {
  const scannerRef = useRef<any>(null);
  const onScanRef = useRef(onScan);

  // Keep callback fresh without triggering scanner reload
  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    if (isOpen) {
      const { Html5Qrcode } = require("html5-qrcode");

      const timer = setTimeout(() => {
        if (!document.getElementById(readerId)) return;
        scannerRef.current = new Html5Qrcode(readerId);

        const stopScanner = () => {
          try {
            if (scannerRef.current?.isScanning) {
              scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
            } else {
              scannerRef.current?.clear();
            }
          } catch (e) {}
        };

        scannerRef.current
          .start(
            { facingMode: "environment" },
            { fps: 10, qrbox: { width: 250, height: 250 } },
            (decodedText: string) => {
              stopScanner();
              onScanRef.current(decodedText);
            },
            () => {}
          )
          .catch(() => {});
      }, 100);

      return () => {
        clearTimeout(timer);
        try {
          if (scannerRef.current?.isScanning) {
            scannerRef.current.stop().then(() => scannerRef.current?.clear()).catch(() => {});
          } else {
            scannerRef.current?.clear();
          }
        } catch (e) {}
        scannerRef.current = null;
      };
    }
  }, [isOpen, readerId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={onClose}
            className="p-2 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full text-white transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>
        <div className="bg-zinc-900 p-4 text-center">
          <h3 className="text-white font-semibold flex items-center justify-center gap-2">
            <ScanLine size={18} /> Scan Parcel QR
          </h3>
          <p className="text-zinc-400 text-xs mt-1">Point your camera at the shipping label</p>
        </div>
        <div id={readerId} className="w-full bg-black min-h-[350px]" />
      </div>
    </div>
  );
}
