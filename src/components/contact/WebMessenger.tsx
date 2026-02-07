"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import type { Dictionary } from "@/i18n";

interface Message {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
}

export default function WebMessenger({ dict }: { dict: Dictionary }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const t = dict.messenger;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch("/api/messenger");
        const data = await res.json();
        setMessages(data.messages || []);
      } catch {
        // ignore
      }
    };

    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;

    setSending(true);
    try {
      const res = await fetch("/api/messenger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input.trim() }),
      });

      if (res.ok) {
        setInput("");
        const msgs = await fetch("/api/messenger");
        const data = await msgs.json();
        setMessages(data.messages || []);
      }
    } catch {
      // ignore
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-4 border-black bg-white flex flex-col h-[400px]">
      {/* Header */}
      <div className="border-b-4 border-black p-3 bg-black text-white">
        <p className="text-xs font-bold uppercase tracking-wider">
          {t.title}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-xs text-gray-400 text-center uppercase tracking-wider">
            {t.emptyState}
          </p>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`max-w-[80%] ${
              msg.sender === "user" ? "ml-auto" : "mr-auto"
            }`}
          >
            <div
              className={`border-2 border-black p-3 ${
                msg.sender === "user"
                  ? "bg-accent text-black"
                  : "bg-gray-100 text-black"
              }`}
            >
              <p className="text-xs">{msg.content}</p>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">
              {msg.sender === "user" ? t.you : t.advisor} &middot;{" "}
              {new Date(msg.createdAt).toLocaleTimeString("de-DE", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t-4 border-black p-3 flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={t.placeholder}
          className="border-2 py-2 text-xs"
        />
        <Button
          onClick={sendMessage}
          disabled={sending || !input.trim()}
          variant="accent"
          size="sm"
        >
          {sending ? dict.common.sending : dict.common.send}
        </Button>
      </div>
    </div>
  );
}
