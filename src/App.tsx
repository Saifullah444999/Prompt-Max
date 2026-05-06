/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Zap, 
  ArrowRight, 
  Plus, 
  Search, 
  Settings,
  History,
  RotateCcw,
  FileText,
  Code,
  PenTool,
  Mail,
  Youtube,
  ShoppingBag,
  BookOpen,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react';
import { optimizePrompt, imageToPrompt } from '@/src/services/geminiService';
import { cn } from '@/src/lib/utils';
import { PROMPT_TEMPLATES, type PromptTemplate } from '@/src/constants';
import confetti from 'canvas-confetti';
import ReactMarkdown from 'react-markdown';

const IconMap = {
  FileText,
  Code,
  PenTool,
  Mail,
  Youtube,
  ShoppingBag,
  BookOpen
};

type Tab = 'prompt' | 'image';

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('prompt');
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState<string>('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOptimize = async () => {
    if (activeTab === 'prompt' && !input.trim()) return;
    if (activeTab === 'image' && !selectedImage) return;
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    try {
      let optimized = '';
      if (activeTab === 'prompt') {
        optimized = await optimizePrompt(input);
      } else if (selectedImage) {
        const base64Data = selectedImage.split(',')[1];
        optimized = await imageToPrompt(base64Data, imageMimeType);
      }
      
      setResult(optimized);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FF6321', '#FF9E21', '#FFFFFF']
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file.');
        return;
      }
      setImageMimeType(file.type);
      const reader = new FileReader();
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImageMimeType('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectTemplate = (template: PromptTemplate) => {
    setActiveTab('prompt');
    setInput(template.prompt);
  };

  const clear = () => {
    setInput('');
    setSelectedImage(null);
    setImageMimeType('');
    setResult('');
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans text-[#1A1A1A] relative overflow-hidden flex flex-col">
      {/* Background Decorative Orbs */}
      <div className="fixed top-[-100px] right-[-100px] w-[500px] h-[500px] bg-orange-100 rounded-full blur-[120px] opacity-60 pointer-events-none"></div>
      <div className="fixed bottom-[-150px] left-[-50px] w-[400px] h-[400px] bg-orange-50 rounded-full blur-[100px] opacity-40 pointer-events-none"></div>

      {/* Navigation Bar */}
      <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-8 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-3 group cursor-pointer">
          <img 
            src="https://cdn.phototourl.com/free/2026-05-03-7bcf1951-db23-4c98-aa05-945b84304f15.png" 
            alt="Prompt Max Logo" 
            className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          <span className="text-2xl font-bold tracking-tight text-[#1A1A1A]">
            Prompt<span className="text-[#FF6321]">Max</span>
          </span>
        </div>
      </nav>

      <main className="relative z-10 px-6 md:px-12 mt-4 grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto w-full flex-grow pb-24">
        
        {/* Left Section: Intro & Input */}
        <section className="md:col-span-5 flex flex-col space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Elevate your AI <br/>conversations.
            </h1>
            <p className="text-gray-400 text-lg font-medium">Transform thoughts or images into engineered masterpieces.</p>
          </motion.div>

          {/* Tools Tabs */}
          <div className="flex p-1 bg-gray-100/50 rounded-2xl w-fit">
            <button
              onClick={() => setActiveTab('prompt')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === 'prompt' 
                  ? "bg-white text-[#FF6321] shadow-sm" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Sparkles className="w-4 h-4" />
              Prompt to Prompt
            </button>
            <button
              onClick={() => setActiveTab('image')}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                activeTab === 'image' 
                  ? "bg-white text-[#FF6321] shadow-sm" 
                  : "text-gray-400 hover:text-gray-600"
              )}
            >
              <ImageIcon className="w-4 h-4" />
              Image to Prompt
            </button>
          </div>

          {activeTab === 'prompt' && (
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-[#FF6321]">Templates</h3>
              <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 custom-scrollbar scroll-smooth whitespace-nowrap text-sm">
                {PROMPT_TEMPLATES.map((template) => {
                  const Icon = IconMap[template.icon as keyof typeof IconMap];
                  return (
                    <button
                      key={template.id}
                      onClick={() => selectTemplate(template)}
                      className="flex-shrink-0 group flex flex-col items-start gap-2 p-3 bg-white border border-gray-100 rounded-xl hover:border-brand/40 hover:shadow-lg transition-all duration-300 text-left w-32"
                    >
                      <div className="p-2 bg-orange-50 rounded-lg group-hover:bg-brand/10 transition-colors">
                        <Icon className="w-4 h-4 text-brand" />
                      </div>
                      <span className="text-[11px] font-bold text-gray-700 truncate w-full">{template.name}</span>
                      <span className="text-[8px] text-gray-400 font-medium leading-tight whitespace-normal line-clamp-2 h-6">{template.description}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="input-card p-6 flex flex-col h-[400px] relative group"
          >
            {activeTab === 'prompt' ? (
              <>
                <label className="text-xs font-bold uppercase tracking-widest text-[#FF6321] mb-4">Enter Ordinary Prompt</label>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ex: Write a marketing plan for a new organic coffee brand..."
                  className="flex-1 w-full bg-transparent text-gray-700 font-medium text-lg leading-relaxed border-none focus:ring-0 resize-none placeholder:text-gray-300"
                />
              </>
            ) : (
              <div className="flex-1 flex flex-col">
                <label className="text-xs font-bold uppercase tracking-widest text-[#FF6321] mb-4">Upload Image</label>
                {!selectedImage ? (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-4 hover:border-brand/40 hover:bg-orange-50/10 transition-all cursor-pointer group"
                  >
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Upload className="w-8 h-8 text-brand" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700">Drop an image here</p>
                      <p className="text-xs text-gray-400 mt-1">or click to browse from device</p>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleFileChange}
                    />
                  </div>
                ) : (
                  <div className="flex-1 relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <img 
                      src={selectedImage} 
                      alt="Selected" 
                      className="w-full h-full object-cover" 
                    />
                    <button 
                      onClick={removeImage}
                      className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-red-500 shadow-sm transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
            
            <div className="pt-4 mt-auto">
              <button 
                onClick={handleOptimize}
                disabled={isLoading || (activeTab === 'prompt' ? !input.trim() : !selectedImage)}
                className={cn(
                  "w-full py-4 font-bold rounded-xl transition-all flex items-center justify-center space-x-2",
                  (activeTab === 'prompt' ? input.trim() : selectedImage) && !isLoading
                    ? "bg-gradient-to-r from-[#FF6321] to-[#FF9E21] text-white shadow-[0_8px_20px_rgba(255,99,33,0.3)] hover:scale-[1.02] active:scale-[0.98]" 
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
              >
                <span>{isLoading ? "Analyzing..." : activeTab === 'prompt' ? "Optimize with Max Engine" : "Extract Prompt with Max"}</span>
                {!isLoading && (
                  <Zap className={cn("w-5 h-5", (activeTab === 'prompt' ? input.trim() : selectedImage) ? "fill-white" : "fill-gray-300")} />
                )}
              </button>
            </div>

            {(input || selectedImage) && (
              <button 
                onClick={clear}
                className="absolute top-6 right-6 p-1 text-gray-300 hover:text-gray-500 transition-colors"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </motion.div>

          {error && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-semibold"
            >
              {error}
            </motion.div>
          )}
        </section>

        {/* Right Section: Result */}
        <section className="md:col-span-7">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div 
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[400px] frosted-glass rounded-[20px] flex items-center justify-center border-dashed border-2 border-gray-200/50"
              >
                <div className="text-center space-y-4 p-12">
                  <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-[#FF6321] opacity-40" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-400">Waiting for input</h3>
                  <p className="text-gray-300 max-w-xs mx-auto">Your masterpiece will appear here once the engine processes your prompt.</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="result"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative h-full"
              >
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FF6321] opacity-10 rounded-full blur-xl animate-pulse"></div>
                
                <div className="frosted-glass rounded-[20px] p-8 h-full flex flex-col relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-3">
                      <div className="px-3 py-1 bg-orange-100 text-[#FF6321] text-[10px] font-black uppercase tracking-widest rounded-full">
                        Master Prompt
                      </div>
                      <span className="text-xs text-gray-400 font-bold">Turbo-Engine v2.4</span>
                    </div>
                    <button 
                      onClick={handleCopy}
                      className={cn(
                        "flex items-center space-x-2 px-5 py-2 bg-white rounded-lg border border-gray-100 shadow-sm text-sm font-bold transition-all",
                        copied ? "text-green-500 bg-green-50" : "text-gray-600 hover:bg-gray-50 active:scale-95"
                      )}
                    >
                      {copied ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#FF6321]" />
                          <span>Copy Prompt</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="prose prose-sm max-w-none text-gray-700 font-medium leading-relaxed prose-headings:text-[#FF6321] prose-headings:font-bold prose-headings:mb-2 prose-p:mb-4">
                      <ReactMarkdown>{result}</ReactMarkdown>
                    </div>
                  </div>

                  {/* Visual Fade at bottom */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white/90 to-transparent pointer-events-none group-hover:h-8 transition-all duration-500"></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      {/* Footer Micro-Status */}
      <footer className="relative z-10 px-6 md:px-12 py-8 max-w-7xl mx-auto w-full flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-gray-400">
        <div className="flex space-x-6 items-center">
          <span className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-[#FF6321] rounded-full"></span>
            AI Engine: Max-Turbo-01
          </span>
          <span className="hidden sm:inline">Latency: 12ms</span>
          <span className="hidden sm:inline">Uptime: 99.9%</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
          <span>System Optimized</span>
        </div>
      </footer>
    </div>
  );
}
