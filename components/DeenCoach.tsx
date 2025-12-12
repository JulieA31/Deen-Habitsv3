import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader2, Crown, User, Bot } from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface DeenCoachProps {
  userProfile: UserProfile;
  onSubscribe: () => void;
  habits?: any;
  logs?: any;
  prayerLogs?: any;
  currentDate?: string;
}

const DeenCoach: React.FC<DeenCoachProps> = ({ userProfile, onSubscribe }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `As-salamu alaykum ${userProfile.name} ! Je suis ton Coach Spirituel IA. Comment puis-je t'aider aujourd'hui dans ton cheminement ?`,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialisation du chat pour TOUS les utilisateurs (Mode Test)
  useEffect(() => {
    if (!chatSessionRef.current) {
      chatSessionRef.current = createChatSession(userProfile.name);
    }
  }, [userProfile.name]);

  // Scroll automatique vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!inputValue.trim()) return;
    
    // Restriction Premium désactivée pour le test
    /* 
    if (!userProfile.isPremium) {
      setShowPaywall(true);
      return;
    } 
    */

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: newUserMessage.text });
        
        const aiResponseText = result.text || "Désolé, je n'ai pas pu formuler de réponse. Réessayez plus tard.";

        const newAiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: aiResponseText,
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, newAiMessage]);
      }
    } catch (error) {
      console.error("Erreur Chat:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Une erreur est survenue lors de la connexion au service. Veuillez réessayer.",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] md:h-[600px] md:max-h-[800px] bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200 relative">
      
      {/* Header */}
      <div className="bg-emerald-900 p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-full flex items-center justify-center border-2 border-emerald-500">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-white font-bold flex items-center gap-2">
              Coach Deen IA
              <span className="bg-emerald-600/50 text-emerald-100 text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 uppercase tracking-wider">
                Test Gratuit
              </span>
            </h2>
            <p className="text-emerald-200 text-xs">Basé sur le Coran & la Sunna</p>
          </div>
        </div>
        {!userProfile.isPremium && (
          <button onClick={onSubscribe} className="text-xs bg-yellow-400 text-emerald-900 px-3 py-1.5 rounded-full font-bold flex items-center gap-1 hover:bg-yellow-300 transition-colors opacity-80" title="Abonnement optionnel">
            <Crown className="w-3 h-3" /> Soutenir
          </button>
        )}
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] md:max-w-[85%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
                  isUser 
                    ? 'bg-slate-800 text-white rounded-tr-none' 
                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
            </div>
          );
        })}
        
        {isLoading && (
          <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span>
                </div>
              </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Posez une question spirituelle..."
            disabled={isLoading}
            className="flex-1 p-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-slate-800 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
        <p className="text-[10px] text-center text-slate-400 mt-2">
          L'IA peut commettre des erreurs. Vérifiez toujours les informations importantes auprès d'un savant.
        </p>
      </div>

      {/* Paywall Overlay REMOVED FOR TESTING */}
    </div>
  );
};

export default DeenCoach;