"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  RotateCcw,
  Copy,
  Check,
  Mic,
  MicOff,
  ArrowUp,
  Loader2,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  time: string;
}

interface AiShipmentAssistantProps {
  trackingNumber?: string;
  shipmentData?: {
    status?: string;
    senderAddress?: string;
    receiverAddress?: string;
    weight?: number;
  };
}

const FULL_LABEL = "Ask Nexi";

const SUGGESTIONS = [
  "Where is my package right now?",
  "When will it be delivered?",
  "What was the latest status update?",
  "Who is the sender & receiver?",
];

function getCurrentTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getGreeting(id?: string) {
  if (id) {
    return `Hi! I'm Nexi. I have your details for shipment ${id}. You can ask me about its current status, estimated arrival, or transit history.`;
  }
  return `Hi! I'm Nexi, your ShipNex AI assistant. Enter a tracking number or ask anything about your delivery.`;
}

function NexiLogo({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      fill="currentColor"
      style={{ width: size, height: size }}
      className={`shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      <path d="M273.5 736H800a64 64 0 0 0 64-64V256a64 64 0 0 0-64-64H224a64 64 0 0 0-64 64v570.9zm22.5 64L148 918.4a32 32 0 0 1-52-25V256a128 128 0 0 1 128-128h576a128 128 0 0 1 128 128v416a128 128 0 0 1-128 128z" />
    </svg>
  );
}

export default function AiShipmentAssistant({ trackingNumber }: AiShipmentAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [labelText, setLabelText] = useState(FULL_LABEL);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [activeCode, setActiveCode] = useState<string | undefined>(trackingNumber);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      role: "assistant",
      content: getGreeting(trackingNumber),
      time: getCurrentTime(),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Typewriter backspace erasing effect
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;

    const startDelay = setTimeout(() => {
      let currentLen = FULL_LABEL.length;

      intervalId = setInterval(() => {
        currentLen--;
        if (currentLen >= 0) {
          setLabelText(FULL_LABEL.slice(0, currentLen));
        } else {
          if (intervalId) clearInterval(intervalId);
          setIsCollapsed(true);
        }
      }, 70);
    }, 6000);

    return () => {
      clearTimeout(startDelay);
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (trackingNumber) {
      setActiveCode(trackingNumber);
      setMessages((prev) => {
        if (prev.length <= 1) {
          return [
            {
              id: "init-" + trackingNumber,
              role: "assistant",
              content: getGreeting(trackingNumber),
              time: getCurrentTime(),
            },
          ];
        }
        return prev;
      });
    }
  }, [trackingNumber]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [isOpen, messages, loading]);

  // Voice recognition setup
  useEffect(() => {
    const SpeechRec =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRec) {
      const rec = new SpeechRec();
      rec.lang = "en-US";
      rec.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        if (text) setInput((prev) => (prev ? `${prev} ${text}` : text));
        setIsListening(false);
      };
      rec.onerror = () => setIsListening(false);
      rec.onend = () => setIsListening(false);
      recognitionRef.current = rec;
    }
  }, []);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        setIsListening(false);
      }
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1400);
  };

  const handleReset = () => {
    setMessages([
      {
        id: "init-" + Date.now(),
        role: "assistant",
        content: getGreeting(activeCode || trackingNumber),
        time: getCurrentTime(),
      },
    ]);
  };

  const handleSend = async (manualText?: string) => {
    const text = (manualText || input).trim();
    if (!text || loading) return;

    const extracted = text.match(/\bSX-[A-Za-z0-9]+\b/i)?.[0]?.toUpperCase();
    const currentCode = extracted || activeCode || trackingNumber;

    if (extracted && extracted !== activeCode) {
      setActiveCode(extracted);
    }

    const userMsg: Message = {
      id: "u-" + Date.now(),
      role: "user",
      content: text,
      time: getCurrentTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          tracking_id: currentCode,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.content })),
        }),
      });

      const data = await res.json();

      if (data.trackingNumber && !activeCode) {
        setActiveCode(data.trackingNumber);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: "a-" + Date.now(),
          role: "assistant",
          content: data.reply || data.error || "No response received from model.",
          time: getCurrentTime(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "a-" + Date.now(),
          role: "assistant",
          content: "Failed to connect to assistant service. Please try again.",
          time: getCurrentTime(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open assistant"
          className={`fixed bottom-6 right-6 z-50 h-12 rounded-full bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 ease-out flex items-center cursor-pointer border border-zinc-700/20 overflow-hidden ${
            !isCollapsed ? "px-4 gap-2.5" : "w-12 justify-center p-0"
          }`}
        >
          <NexiLogo size={20} />
          {!isCollapsed && (
            <span className="whitespace-nowrap text-xs font-semibold tracking-tight transition-all">
              {labelText}
            </span>
          )}
        </button>
      )}

      {/* Chat Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 flex flex-col bg-white dark:bg-zinc-950 text-foreground border border-zinc-200 dark:border-zinc-800 shadow-2xl transition-all duration-200 ${
            isExpanded
              ? "inset-4 sm:inset-10 md:inset-16 rounded-2xl"
              : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[560px] max-h-[85vh] rounded-2xl"
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <NexiLogo size={18} />
              <h3 className="font-semibold text-xs tracking-tight text-foreground">
                Nexi AI
              </h3>
            </div>

            <div className="flex items-center gap-1 text-zinc-400">
              <button
                onClick={handleReset}
                title="Clear chat"
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
              >
                <RotateCcw size={14} />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? "Collapse" : "Expand"}
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors hidden sm:block"
              >
                {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-foreground transition-colors"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
              >
                {m.role === "user" ? (
                  <div className="max-w-[82%] rounded-2xl rounded-tr-sm bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 px-3.5 py-2 text-xs leading-relaxed font-sans shadow-sm">
                    {m.content}
                  </div>
                ) : (
                  <div className="max-w-[88%] space-y-1.5">
                    <div className="rounded-2xl rounded-tl-sm bg-zinc-100 dark:bg-zinc-900 text-foreground px-3.5 py-2.5 text-xs leading-relaxed font-sans select-text">
                      {m.content}
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400 px-1">
                      <button
                        onClick={() => handleCopy(m.id, m.content)}
                        className="hover:text-foreground transition-colors p-0.5 text-[10px] inline-flex items-center gap-1"
                      >
                        {copiedId === m.id ? (
                          <>
                            <Check size={11} className="text-emerald-500" />
                            <span className="text-emerald-500 font-mono">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy size={11} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                      <span className="text-[10px] text-zinc-400 font-mono ml-auto">
                        {m.time}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs py-1 px-1">
                <Loader2 size={13} className="animate-spin text-zinc-500" />
                <span className="text-[11px]">Thinking...</span>
              </div>
            )}

            {/* Quick Suggestions */}
            {messages.length <= 2 && !loading && (
              <div className="pt-2 space-y-1.5">
                <p className="text-[10px] text-zinc-400 font-medium px-1">
                  Suggested Questions
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {SUGGESTIONS.map((chip) => (
                    <button
                      key={chip}
                      type="button"
                      onClick={() => handleSend(chip)}
                      className="text-left text-xs bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-3 py-1.5 rounded-full border border-zinc-200/60 dark:border-zinc-800 transition-colors cursor-pointer"
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-zinc-100 dark:border-zinc-800/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative flex items-center bg-zinc-100 dark:bg-zinc-900 rounded-xl px-3 py-2 border border-transparent focus-within:border-zinc-300 dark:focus-within:border-zinc-700 transition-colors"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Nexi about your package..."
                disabled={loading}
                className="w-full bg-transparent text-xs text-foreground placeholder-zinc-400 focus:outline-none pr-14"
              />

              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`p-1 rounded-md transition-colors ${
                    isListening
                      ? "text-rose-500 animate-pulse"
                      : "text-zinc-400 hover:text-foreground"
                  }`}
                  title={isListening ? "Listening..." : "Voice input"}
                >
                  {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                </button>

                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="w-6 h-6 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 disabled:opacity-30 hover:opacity-90 flex items-center justify-center transition-all cursor-pointer disabled:cursor-not-allowed"
                >
                  <ArrowUp size={13} />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
