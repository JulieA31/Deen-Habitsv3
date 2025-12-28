
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Send, Loader2, AlertTriangle } from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';
import { createChatSession } from '../services/geminiService';
import { Chat } from '@google/genai';

interface DeenCoachProps {
  userProfile: UserProfile;
  onSubscribe: () => void;
}

const DeenCoach: React.FC<DeenCoachProps> = ({ userProfile, onSubscribe }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: `As-salamu alaykum ${userProfile.name} ! Je suis ton Coach Deen. Comment puis-je t'accompagner dans ton cheminement aujourd'hui ?`,
      timestamp: Date.now()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatSessionRef.current) {
      try {
        chatSessionRef.current = createChatSession(userProfile.name);
        setInitError(null);
      } catch (error: any) {
        setInitError("Le Coach IA est indisponible pour le moment.");
      }
    }
  }, [userProfile.name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || initError || isLoading) return;

    const newUserMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: inputValue, timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (chatSessionRef.current) {
        const result = await chatSessionRef.current.sendMessage({ message: newUserMessage.text });
        const aiResponseText = result.text || "Désolé, je n'ai pas pu formuler de réponse.";
        setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), role: 'model', text: aiResponseText, timestamp: Date.now() }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { id: 'err', role: 'model', text: "Erreur de connexion. Vérifiez votre accès internet.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] md:h-[650px] bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
      <div className="bg-emerald-900 p-4 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-700 rounded-2xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-white font-bold text-sm md:text-base">Coach Deen</h2>
            <p className="text-emerald-300 text-[10px] uppercase tracking-wider font-bold">Accompagnement Spirituel</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-slate-50 space-y-4">
        {initError && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-800">
             <AlertTriangle className="w-5 h-5 shrink-0" />
             <p className="text-xs">{initError}</p>
          </div>
        )}
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm shadow-sm ${msg.role === 'user' ? 'bg-emerald-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                {msg.text}
              </div>
          </div>
        ))}
        {isLoading && <div className="flex justify-start"><div className="bg-white p-4 rounded-2xl border border-slate-100 flex gap-1"><span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce"></span><span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span><span className="w-2 h-2 bg-emerald-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span></div></div>}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t border-slate-100 shrink-0">
        <form onSubmit={handleSendMessage} className="flex gap-2 relative">
          <input 
            type="text" 
            value={inputValue} 
            onChange={(e) => setInputValue(e.target.value)} 
            placeholder="Posez votre question..." 
            disabled={isLoading || !!initError} 
            className="flex-1 p-3.5 pr-14 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 disabled:opacity-50 text-slate-800 text-sm" 
          />
          <button type="submit" disabled={isLoading || !inputValue.trim() || !!initError} className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all active:scale-95"><Send className="w-5 h-5" /></button>
        </form>
        <div className="mt-3 px-2">
            <p className="text-[9px] leading-tight text-center text-slate-400 italic">
                Note : Ce coach est une IA conçue pour l'accompagnement spirituel. Il est impératif de se référer à des savants qualifiés ou à votre imam local pour toute question spécifique de jurisprudence (Fiqh) ou Fatwa.
            </p>
        </div>
      </div>
    </div>
  );
};

export default DeenCoach;
