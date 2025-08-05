"use client";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import { Card, CardContent } from "@workspace/ui/components/card";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, x: isUser ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={`flex gap-3 mb-4 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src="/bot-avatar.jpg" alt="AI Assistant" />
          <AvatarFallback className="bg-blue-500 text-white">
            <Bot className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}

      <Card
        className={`max-w-[80%] ${isUser ? "bg-blue-500 text-white" : "bg-white dark:bg-slate-700"}`}
      >
        <CardContent className="p-3">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          <p
            className={`text-xs mt-2 ${isUser ? "text-blue-100" : "text-slate-500"}`}
          >
            {message.timestamp.toLocaleTimeString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </CardContent>
      </Card>

      {isUser && (
        <Avatar className="w-8 h-8">
          <AvatarImage src="/user-avatar.jpg" alt="User" />
          <AvatarFallback className="bg-slate-500 text-white">
            <User className="w-4 h-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </motion.div>
  );
}
