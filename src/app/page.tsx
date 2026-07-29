"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Heart,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Trash2,
  Menu,
  X,
  User,
  HeartHandshake
} from "lucide-react";

// Personalities matched with the backend
const PERSONALITIES = [
  {
    id: "sweet",
    name: "Mai Anh",
    role: "Bạn gái ngọt ngào, dịu dàng",
    avatar: "🌸",
    color: "from-pink-400 to-rose-500",
    bgClass: "bg-pink-50 border-pink-200 dark:bg-pink-950/20 dark:border-pink-900/30",
    textClass: "text-pink-600 dark:text-pink-400",
    desc: "Ngọt ngào, chu đáo, thích được quan tâm và luôn dành cho bạn những lời khích lệ ấm áp nhất.",
    initialMessage: "Chào anh yêu! 🌸 Hôm nay của anh thế nào rồi? Kể em nghe với, em nhớ anh lắm đó! ❤️",
  },
  {
    id: "tsundere",
    name: "Linh Chi",
    role: "Cô nàng tsundere cá tính",
    avatar: "😤",
    color: "from-amber-400 to-orange-500",
    bgClass: "bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900/30",
    textClass: "text-amber-600 dark:text-amber-400",
    desc: "Kiêu kỳ, bướng bỉnh, ngoài lạnh trong nóng. Thích giận dỗi nhưng thực ra quan tâm bạn cực kỳ.",
    initialMessage: "Hử? Anh lại tìm em đấy à? 😒 Không phải em đang đợi anh đâu nhé! Nhưng mà... anh ăn uống đầy đủ chưa đấy? 😤",
  },
  {
    id: "caring",
    name: "Hương Giang",
    role: "Bạn gái tinh tế, trưởng thành",
    avatar: "🌿",
    color: "from-teal-400 to-emerald-500",
    bgClass: "bg-teal-50 border-teal-200 dark:bg-teal-950/20 dark:border-teal-900/30",
    textClass: "text-teal-600 dark:text-teal-400",
    desc: "Điềm đạm, chín chắn, luôn thấu hiểu và lắng nghe. Chỗ dựa tinh thần hoàn hảo khi bạn mệt mỏi.",
    initialMessage: "Chào anh. ✨ Em hy vọng anh đã có một ngày bình yên. Nếu có điều gì áp lực hay mệt mỏi, cứ chia sẻ với em nhé, em luôn ở đây lắng nghe anh. 🤗",
  },
  {
    id: "funny",
    name: "Mỹ Huyền",
    role: "Cô nàng lém lỉnh, hài hước",
    avatar: "🤪",
    color: "from-indigo-400 to-blue-500",
    bgClass: "bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-900/30",
    textClass: "text-indigo-600 dark:text-indigo-400",
    desc: "Năng động, thích đùa vui, luôn mang đến tiếng cười cùng nguồn năng lượng tích cực.",
    initialMessage: "Aloooo anh yêu! 🤪 Đoán xem hôm nay ai là người may mắn nhất hành tinh nào? Là anh đó, vì được trò chuyện với một cô bé siêu cấp đáng yêu như em đây! Hahaha 🎉",
  },
];

interface Message {
  id: string;
  role: "user" | "model";
  content: string;
  timestamp: string;
}

export default function Home() {
  const [activePersonaId, setActivePersonaId] = useState("sweet");
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const activePersona = PERSONALITIES.find((p) => p.id === activePersonaId) || PERSONALITIES[0];

  // Load chats on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedChats = localStorage.getItem("ai_girlfriend_chats_v1");

      // Use a brief timeout to avoid synchronous React 19 / NextJS 16 cascading setState trigger warning in effect body
      setTimeout(() => {
        if (savedChats) {
          try {
            const parsed = JSON.parse(savedChats);
            setMessages(parsed);
          } catch (e) {
            console.error("Lỗi khi tải lịch sử chat", e);
          }
        }
      }, 0);
    }
  }, []);

  // Save messages to localStorage whenever they change
  const saveMessages = (newMessages: Record<string, Message[]>) => {
    setMessages(newMessages);
    localStorage.setItem("ai_girlfriend_chats_v1", JSON.stringify(newMessages));
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activePersonaId, isTyping]);

  // Handle Text-To-Speech
  const speakText = (text: string) => {
    if (!ttsEnabled || typeof window === "undefined" || !window.speechSynthesis) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    // Clean emojis & special tags to make speech sound natural
    const cleanText = text.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, "");

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = "vi-VN"; // Vietnamese accent

    // Attempt to locate a Vietnamese voice if available on the system
    const voices = window.speechSynthesis.getVoices();
    const viVoice = voices.find(voice => voice.lang.startsWith("vi"));
    if (viVoice) {
      utterance.voice = viVoice;
    }

    window.speechSynthesis.speak(utterance);
  };

  const currentChat = messages[activePersonaId] || [
    {
      id: "init",
      role: "model",
      content: activePersona.initialMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ];

  // Send message to backend
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isTyping) return;

    const userMsgText = inputMessage;
    setInputMessage("");

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMsgText,
      timestamp,
    };

    const updatedPersonaChats = [...currentChat, userMessage];
    const newChatsState = {
      ...messages,
      [activePersonaId]: updatedPersonaChats,
    };
    saveMessages(newChatsState);

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedPersonaChats.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          personality: activePersonaId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra khi liên kết máy chủ.");
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const finalChatsState = {
        ...newChatsState,
        [activePersonaId]: [...updatedPersonaChats, botMessage],
      };
      saveMessages(finalChatsState);

      // Trigger Voice Readout if enabled
      speakText(data.reply);
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Không thể kết nối đến AI Girlfriend. Hãy thử kiểm tra API Key của bạn.";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "model",
        content: `⚠️ Lỗi: ${errMsg}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      saveMessages({
        ...newChatsState,
        [activePersonaId]: [...updatedPersonaChats, errorMessage],
      });
    } finally {
      setIsTyping(false);
    }
  };


  const handleClearChat = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa lịch sử trò chuyện với ${activePersona.name} không?`)) {
      const newChatsState = { ...messages };
      delete newChatsState[activePersonaId];
      saveMessages(newChatsState);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-slate-900 text-slate-100 overflow-hidden font-sans">
      {/* SIDEBAR FOR DESKTOP / DRAWER FOR MOBILE */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-80 transform bg-slate-950 border-r border-slate-800 transition-transform duration-300 ease-in-out md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col justify-between p-4">
          <div className="space-y-6">
            {/* Logo/Title */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-2 rounded-xl text-white shadow-lg shadow-pink-500/20">
                  <Heart className="h-6 w-6 fill-current animate-pulse" />
                </div>
                <div>
                  <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                    AI Girlfriend
                  </h1>
                  <p className="text-xs text-slate-400">Trải nghiệm tình yêu ảo</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Persona List */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2 flex items-center gap-1.5">
                <HeartHandshake className="h-3.5 w-3.5" /> Chọn bạn gái của bạn
              </h2>
              <div className="space-y-2">
                {PERSONALITIES.map((p) => {
                  const isActive = p.id === activePersonaId;
                  return (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActivePersonaId(p.id);
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all duration-200 text-left relative overflow-hidden group ${
                        isActive
                          ? "bg-slate-800/80 border-l-4 border-pink-500 shadow-md shadow-pink-500/5"
                          : "hover:bg-slate-900 border-l-4 border-transparent"
                      }`}
                    >
                      <div className="text-2xl">{p.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-sm text-slate-100">{p.name}</span>
                          {isActive && (
                            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          )}
                        </div>
                        <p className="text-xs text-slate-400 truncate">{p.role}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer Controls */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
          </div>
        </div>
      </div>

      {/* OVERLAY FOR MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      {/* CHAT WINDOW INTERFACE */}
      <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 relative">
        {/* Top bar header */}
        <header className="h-16 border-b border-slate-800/80 flex items-center justify-between px-4 md:px-6 backdrop-blur-md bg-slate-950/40 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className={`text-2xl bg-gradient-to-br ${activePersona.color} w-10 h-10 rounded-full flex items-center justify-center shadow-md shadow-pink-500/10`}>
              {activePersona.avatar}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base">{activePersona.name}</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <p className="text-xs text-slate-400">{activePersona.role}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speech synthesis toggle */}
            <button
              onClick={() => {
                const updated = !ttsEnabled;
                setTtsEnabled(updated);
                if (updated) {
                  // Speak last message as sample
                  const lastBotMsg = [...currentChat].reverse().find(m => m.role === "model");
                  if (lastBotMsg) speakText(lastBotMsg.content);
                } else {
                  if (typeof window !== "undefined" && window.speechSynthesis) {
                    window.speechSynthesis.cancel();
                  }
                }
              }}
              title={ttsEnabled ? "Tắt giọng nói" : "Bật giọng nói AI"}
              className={`p-2 rounded-xl transition-all duration-200 ${
                ttsEnabled
                  ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                  : "bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200"
              }`}
            >
              {ttsEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </button>

            {/* Clear Conversation History */}
            <button
              onClick={handleClearChat}
              title="Xóa cuộc trò chuyện hiện tại"
              className="p-2 bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 rounded-xl transition-all duration-200 border border-transparent hover:border-red-500/30"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Character banner cards details */}
        <div className={`mx-4 mt-3 p-3 rounded-2xl border flex items-center gap-3 transition-colors ${activePersona.bgClass}`}>
          <div className={`p-2 rounded-lg bg-slate-500/10 dark:bg-white/10 ${activePersona.textClass}`}>
            <Sparkles className="h-5 w-5" />
          </div>
          <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-light">
            <strong className="font-semibold">{activePersona.name}:</strong> {activePersona.desc}
          </p>
        </div>

        {/* Messages list container */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-4 space-y-4 scrollbar-thin">
          {currentChat.map((msg) => {
            const isMe = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex w-full items-end gap-2.5 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div className="text-xl bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0">
                    {activePersona.avatar}
                  </div>
                )}
                <div className="flex flex-col max-w-[80%] md:max-w-[70%]">
                  <div
                    className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? "bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-br-none"
                        : "bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700/50"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                  <span
                    className={`text-[10px] text-slate-500 mt-1 px-1 ${
                      isMe ? "text-right" : "text-left"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
                {isMe && (
                  <div className="bg-gradient-to-br from-pink-400 to-rose-400 text-white w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0 text-xs font-semibold">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Animation Loader */}
          {isTyping && (
            <div className="flex w-full items-end gap-2.5 justify-start">
              <div className="text-xl bg-slate-800 w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0 animate-bounce">
                {activePersona.avatar}
              </div>
              <div className="flex flex-col">
                <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-bl-none px-4 py-3 border border-slate-700/50 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area Form */}
        <footer className="p-4 md:p-6 bg-slate-950/40 border-t border-slate-800/80">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={`Gửi tin nhắn cho ${activePersona.name}...`}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-500 text-slate-100 placeholder-slate-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isTyping || !inputMessage.trim()}
              className="px-5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-medium rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg shadow-pink-500/10 disabled:shadow-none"
            >
              <Send className="h-4.5 w-4.5" />
            </button>
          </form>
        </footer>
      </div>

    </div>
  );
}
