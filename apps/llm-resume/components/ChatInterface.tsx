"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DynamicContent } from "./DynamicContent";
import { ChatMessage } from "./ChatMessage";
import { aiService, AIResponse } from "../lib/ai-service";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  dynamicContent?: {
    type: "chart" | "code" | "image" | "list";
    data: any;
  };
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "안녕하세요! 저는 AI 어시스턴트입니다. 이력서에 대해 궁금한 점이 있으시면 언제든 물어보세요. 예를 들어 '대용량 시계열 데이터를 어떻게 관리하는지 보여줘'라고 말씀해보세요!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      // 대화 히스토리를 AI 서비스에 전달
      const conversationHistory = messages
        .filter((msg) => msg.role === "user" || msg.role === "assistant")
        .map((msg) => ({
          role: msg.role,
          content: msg.content,
        }));

      const response: AIResponse = await aiService.generateResponse(
        inputValue,
        conversationHistory
      );

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.content,
        timestamp: new Date(),
        dynamicContent: response.dynamicContent,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("AI 응답 처리 중 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          AI 어시스턴트
        </CardTitle>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          이력서에 대해 궁금한 점을 물어보세요!
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 bg-slate-50 dark:bg-slate-800 rounded-lg p-4 mb-4 overflow-y-auto">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <ChatMessage message={message} />
                {message.dynamicContent && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="mt-4"
                  >
                    <DynamicContent content={message.dynamicContent} />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-slate-500 mt-4"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">AI가 응답을 생성하고 있습니다...</span>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
