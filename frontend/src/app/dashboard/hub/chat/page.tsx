"use client";

import { useState, useRef, useEffect } from "react";
import {
  Send,
  Paperclip,
  Search,
  Phone,
  Video,
  MoreHorizontal,
  Users,
  Truck,
  Warehouse,
  CheckCheck,
  Clock,
  Image,
  Smile,
  ChevronLeft,
} from "lucide-react";

interface ChatContact {
  id: string;
  name: string;
  role: "agent" | "hub" | "admin";
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
}

interface Message {
  id: string;
  sender: "me" | "them";
  text: string;
  time: string;
  read: boolean;
}

const demoContacts: ChatContact[] = [
  { id: "1", name: "J. Martinez", role: "agent", avatar: "JM", lastMessage: "Delivered all 24 parcels on Route N-12 ✓", lastTime: "2m", unread: 0, online: true },
  { id: "2", name: "S. Patel", role: "agent", avatar: "SP", lastMessage: "Need re-route for stop #8 — road closed", lastTime: "18m", unread: 2, online: true },
  { id: "3", name: "Admin Team", role: "admin", avatar: "AT", lastMessage: "New batch of 45 parcels arriving at 3 PM", lastTime: "35m", unread: 1, online: true },
  { id: "4", name: "K. Lee", role: "agent", avatar: "KL", lastMessage: "Returning to hub, ETA 15 minutes", lastTime: "42m", unread: 0, online: true },
  { id: "5", name: "M. Chen", role: "agent", avatar: "MC", lastMessage: "Customer not available at stop #14", lastTime: "1h", unread: 0, online: false },
  { id: "6", name: "Dallas Hub", role: "hub", avatar: "DH", lastMessage: "Transfer batch #B-4500 confirmed", lastTime: "2h", unread: 0, online: true },
  { id: "7", name: "R. Thompson", role: "agent", avatar: "RT", lastMessage: "Vehicle V-028 ready for dispatch", lastTime: "3h", unread: 0, online: false },
  { id: "8", name: "Denver Hub", role: "hub", avatar: "DH", lastMessage: "Capacity warning — please hold outbound", lastTime: "5h", unread: 0, online: true },
];

const demoMessages: Record<string, Message[]> = {
  "1": [
    { id: "1", sender: "them", text: "Starting Route N-12 now. 24 parcels loaded.", time: "12:30 PM", read: true },
    { id: "2", sender: "me", text: "Great, keep me updated on progress.", time: "12:32 PM", read: true },
    { id: "3", sender: "them", text: "Stop #6 complete. On schedule.", time: "1:15 PM", read: true },
    { id: "4", sender: "them", text: "Traffic on 5th Ave, taking alternate route", time: "1:45 PM", read: true },
    { id: "5", sender: "me", text: "Copy that. How many stops remaining?", time: "1:46 PM", read: true },
    { id: "6", sender: "them", text: "8 more stops. ETA for completion is 4:30 PM", time: "1:48 PM", read: true },
    { id: "7", sender: "them", text: "Delivered all 24 parcels on Route N-12 ✓", time: "4:22 PM", read: true },
  ],
  "2": [
    { id: "1", sender: "them", text: "Starting Route N-15 with 34 parcels", time: "12:45 PM", read: true },
    { id: "2", sender: "me", text: "Acknowledged. Route N-15 is a busy one today.", time: "12:47 PM", read: true },
    { id: "3", sender: "them", text: "Stop #5 done, moving to #6", time: "1:30 PM", read: true },
    { id: "4", sender: "them", text: "Need re-route for stop #8 — road closed", time: "2:10 PM", read: false },
    { id: "5", sender: "them", text: "Can you check alternate access?", time: "2:11 PM", read: false },
  ],
  "3": [
    { id: "1", sender: "them", text: "Hi team, we're scheduling a new batch of transfers.", time: "11:00 AM", read: true },
    { id: "2", sender: "me", text: "How many parcels in this batch?", time: "11:05 AM", read: true },
    { id: "3", sender: "them", text: "New batch of 45 parcels arriving at 3 PM", time: "11:15 AM", read: false },
  ],
};

function RoleIcon({ role }: { role: string }) {
  if (role === "agent") return <Truck size={10} className="text-blue-500" />;
  if (role === "hub") return <Warehouse size={10} className="text-amber-500" />;
  return <Users size={10} className="text-violet-500" />;
}

export default function ChatPage() {
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Record<string, Message[]>>(demoMessages);
  const [searchQuery, setSearchQuery] = useState("");
  const [showContactList, setShowContactList] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedContact, messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedContact) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      sender: "me",
      text: messageInput,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
      read: false,
    };

    setMessages((prev) => ({
      ...prev,
      [selectedContact]: [...(prev[selectedContact] || []), newMsg],
    }));
    setMessageInput("");
  };

  const selectedContactData = demoContacts.find((c) => c.id === selectedContact);
  const currentMessages = selectedContact ? messages[selectedContact] || [] : [];

  const filteredContacts = demoContacts.filter(
    (c) => !searchQuery || c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white/60 dark:bg-zinc-950/60 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl overflow-hidden flex" style={{ height: "calc(100vh - 180px)", minHeight: "500px" }}>
      {/* Contact List */}
      <div className={`w-full sm:w-80 shrink-0 border-r border-zinc-100 dark:border-zinc-900 flex flex-col ${selectedContact && !showContactList ? "hidden sm:flex" : "flex"}`}>
        {/* Search */}
        <div className="p-3 border-b border-zinc-100 dark:border-zinc-900">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Search conversations…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Contact Items */}
        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => (
            <button
              key={contact.id}
              onClick={() => { setSelectedContact(contact.id); setShowContactList(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors text-left border-b border-zinc-50 dark:border-zinc-900/50 ${
                selectedContact === contact.id ? "bg-zinc-50 dark:bg-zinc-900/50" : ""
              }`}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/50">
                  <span className="text-xs font-bold text-zinc-500">{contact.avatar}</span>
                </div>
                {contact.online && (
                  <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-950" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-medium text-foreground truncate">{contact.name}</p>
                    <RoleIcon role={contact.role} />
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0">{contact.lastTime}</span>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{contact.lastMessage}</p>
              </div>
              {contact.unread > 0 && (
                <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                  {contact.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!selectedContact || showContactList ? "hidden sm:flex" : "flex"}`}>
        {selectedContact && selectedContactData ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowContactList(true)}
                  className="p-1 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 sm:hidden"
                >
                  <ChevronLeft size={16} className="text-zinc-500" />
                </button>
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center border border-zinc-200/50 dark:border-zinc-800/50">
                    <span className="text-xs font-bold text-zinc-500">{selectedContactData.avatar}</span>
                  </div>
                  {selectedContactData.online && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-zinc-950" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-foreground">{selectedContactData.name}</p>
                    <RoleIcon role={selectedContactData.role} />
                  </div>
                  <p className="text-[10px] text-zinc-500">{selectedContactData.online ? "Online" : "Offline"}</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors hidden sm:block">
                  <Phone size={14} className="text-zinc-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors hidden sm:block">
                  <Video size={14} className="text-zinc-400" />
                </button>
                <button className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors">
                  <MoreHorizontal size={14} className="text-zinc-400" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 sm:px-5 py-4 space-y-3">
              {currentMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl ${
                    msg.sender === "me"
                      ? "bg-foreground text-background rounded-br-md"
                      : "bg-zinc-100 dark:bg-zinc-900 text-foreground rounded-bl-md"
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${msg.sender === "me" ? "justify-end" : ""}`}>
                      <span className={`text-[10px] ${msg.sender === "me" ? "text-background/50" : "text-zinc-400"}`}>
                        {msg.time}
                      </span>
                      {msg.sender === "me" && (
                        <CheckCheck size={11} className={msg.read ? "text-blue-300" : "text-background/30"} />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <form onSubmit={handleSend} className="px-4 sm:px-5 py-3 border-t border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2">
                <button type="button" className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors shrink-0">
                  <Paperclip size={16} className="text-zinc-400" />
                </button>
                <input
                  type="text"
                  placeholder="Type a message…"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-zinc-50/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800 text-sm focus:outline-none focus:ring-1 focus:ring-zinc-400 dark:focus:ring-zinc-700 placeholder:text-zinc-400"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim()}
                  className="p-2.5 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity disabled:opacity-30 shrink-0"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </>
        ) : (
          // Empty state
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center mb-4">
                <Send size={24} className="text-zinc-300 dark:text-zinc-700" />
              </div>
              <p className="text-sm font-medium text-zinc-500">Select a conversation</p>
              <p className="text-xs text-zinc-400 mt-1">Choose from your contacts to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
