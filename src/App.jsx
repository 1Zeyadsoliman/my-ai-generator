import React, { useState } from 'react';
import { Sparkles, Zap, Rocket, ArrowLeft, Shield, Utensils, Coffee, ShoppingBag, Star, Check, HelpCircle, Mail } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState('idle');
  const [siteData, setSiteData] = useState(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setStatus('loading');

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_APP_API_KEY}`
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{
            role: "user",
            content: `Generate a full professional website configuration in JSON for: "${prompt}". 
            Return ONLY JSON. Fields:
            - brand, color, title, desc, iconName (one of: "Rocket", "Shield", "Utensils", "Coffee", "ShoppingBag", "Star", "Zap") 
            - imageSearchTerm: a short descriptive phrase (2-3 words) for an image search that best represents the business (e.g., "luxury spa", "gourmet burger", "tech startup")
            - theme (either "dark" or "light" based on business type)
            - fontStyle (either "modern", "serif", or "mono")
            - features: 3 items {h, p}
            - pricing: 2 plans {name, price, features:[]}
            - testimonials: 2 items {name, text, role}
            - faq: 2 items {q, a}`
          }],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      const cleanJson = JSON.parse(data.choices[0].message.content);
      const iconMap = { Rocket, Shield, Utensils, Coffee, ShoppingBag, Star, Zap };
      setSiteData({ ...cleanJson, Icon: iconMap[cleanJson.iconName] || Rocket });
      setStatus('preview');
    } catch (error) {
      console.error(error);
      setStatus('idle');
      alert("Error building the beast!");
    }
  };

  if (status === 'preview' && siteData) {
    const isDark = siteData.theme === 'dark';
    const fonts = {
      modern: 'sans-serif',
      serif: 'serif',
      mono: 'monospace'
    };

    const bgColor = isDark ? 'bg-slate-950' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-slate-900';
    const subTextColor = isDark ? 'text-slate-400' : 'text-gray-500';

    const navBgColor = isDark ? 'bg-black/80' : 'bg-white/80';
    const borderColor = isDark ? 'border-white/10' : 'border-gray-100';

    return (
      <div 
        className={`min-h-screen transition-all duration-700 ${bgColor} ${textColor}`}
        style={{ fontFamily: fonts[siteData.fontStyle] || 'sans-serif' }}
      >
        {/* Navigation */}
        <nav className={`sticky top-0 z-50 ${navBgColor} backdrop-blur-md border-b ${borderColor} p-5 flex justify-between items-center px-10`}>
          <div className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
            <div style={{backgroundColor: siteData.color}} className="p-1 rounded text-white"><siteData.Icon size={20}/></div>
            {siteData.brand}
          </div>
          <div className="hidden md:flex gap-8 font-bold text-sm uppercase tracking-widest">
            <a href="#features" className="hover:opacity-50 transition-opacity">Features</a>
            <a href="#pricing" className="hover:opacity-50 transition-opacity">Pricing</a>
            <a href="#faq" className="hover:opacity-50 transition-opacity">FAQ</a>
          </div>
          <button style={{ backgroundColor: siteData.color }} className="px-6 py-2 text-white rounded-xl font-bold shadow-xl">Contact Us</button>
        </nav>

        {/* Hero Section */}
        <header className="px-10 py-32 grid lg:grid-cols-2 gap-20 max-w-7xl mx-auto items-center animate-in fade-in duration-700">
          <div>
            <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.85] uppercase tracking-tighter italic">{siteData.title}</h1>
            <p className={`text-xl ${subTextColor} mb-12 leading-relaxed max-w-xl border-l-4 border-gray-200 pl-6`}>{siteData.desc}</p>
            <div className="flex gap-4">
                <button style={{ backgroundColor: siteData.color }} className="px-10 py-5 text-white font-black rounded-2xl shadow-2xl hover:scale-105 transition-all">GET STARTED</button>
                <button className={`px-10 py-5 ${isDark ? 'bg-slate-800' : 'bg-slate-100'} font-black rounded-2xl hover:bg-slate-200 transition-all`}>LEARN MORE</button>
            </div>
          </div>
          <div className="relative group overflow-hidden rounded-[5rem] shadow-2xl aspect-square">
          <img 
            src={`https://source.unsplash.com/1000x1000/?${siteData.imageSearchTerm || 'business'}`} 
            
          />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>
        </header>

        {/* Features Section */}
        <section id="features" className={`py-32 ${isDark ? 'bg-black' : 'bg-slate-50'} px-10`}>
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
            {siteData.features?.map((f, i) => (
              <div key={i} className="group cursor-pointer">
                <div style={{color: siteData.color}} className="mb-6 group-hover:rotate-12 transition-transform"><Zap size={40} fill="currentColor"/></div>
                <h3 className="text-3xl font-black mb-4 uppercase italic tracking-tighter">{f.h}</h3>
                <p className={`${subTextColor} leading-relaxed text-lg`}>{f.p}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-32 px-10 max-w-7xl mx-auto">
          <div className="text-center mb-20"><h2 className="text-5xl font-black italic uppercase tracking-tighter">The Investment</h2></div>
          <div className="grid md:grid-cols-2 gap-10">
            {siteData.pricing?.map((p, i) => (
              <div key={i} className={`border-4 ${isDark ? 'border-white/10' : 'border-slate-900'} p-12 rounded-[3rem] hover:shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] transition-all`}>
                <h4 className="text-xl font-black uppercase mb-2">{p.name}</h4>
                <div className="text-6xl font-black mb-8 italic">{p.price}</div>
                <ul className="mb-10 space-y-4">
                  {p.features?.map((feat, idx) => <li key={idx} className={`flex gap-2 font-bold ${textColor}`}><Check size={20} color={siteData.color}/> {feat}</li>)}
                </ul>
                <button style={{backgroundColor: i === 1 ? siteData.color : (isDark ? 'black' : 'black')}} className="w-full py-5 text-white font-black rounded-2xl">CHOOSE PLAN</button>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-32 bg-black text-white px-10 overflow-hidden relative">
           <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 relative z-10">
              {siteData.testimonials?.map((t, i) => (
                <div key={i} className="space-y-6">
                  <div className="flex gap-1 text-yellow-400"><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/><Star fill="currentColor"/></div>
                  <p className="text-3xl font-bold leading-tight">"{t.text}"</p>
                  <div>
                    <div className="font-black uppercase">{t.name}</div>
                    <div className="text-gray-500 text-sm">{t.role}</div>
                  </div>
                </div>
              ))}
           </div>
           <div className="absolute top-0 right-0 opacity-10 text-[20rem] font-black pointer-events-none tracking-tighter uppercase italic">TRUE</div>
        </section>

        {/* Footer */}
        <footer className={`py-20 px-10 border-t ${borderColor} text-center`}>
          <div className="text-4xl font-black italic mb-8 tracking-tighter uppercase">{siteData.brand}</div>
          <p className={`${subTextColor} mb-10`}>© 2026 Crafted by AI Intelligence. All Rights Reserved.</p>
          <button onClick={() => setStatus('idle')} className="bg-black text-white px-8 py-3 rounded-full flex items-center gap-2 mx-auto hover:scale-105 transition-all"><ArrowLeft size={18}/> CREATE ANOTHER WORLD</button>
        </footer>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-white text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent"></div>
      <Sparkles className="text-indigo-400 mb-6 animate-pulse" size={60} />
      <h1 className="text-7xl md:text-[10rem] font-black mb-4 tracking-tighter italic uppercase leading-none">LUMINA <span className="text-indigo-600">ULTRA</span></h1>
      <p className="text-slate-400 mb-12 tracking-[0.5em] uppercase text-xs font-black">Digital World Builder 4.0</p>
      
      <div className="w-full max-w-4xl bg-white/5 border border-white/10 p-4 rounded-[3.5rem] flex items-center shadow-2xl backdrop-blur-2xl relative z-10">
        <input 
          className="bg-transparent flex-1 px-8 py-4 outline-none text-2xl placeholder:text-slate-700" 
          placeholder="Describe an entire business (e.g. Luxury Spa & Resort)"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
        />
        <button onClick={handleGenerate} className="bg-white text-black px-14 py-5 rounded-[2.5rem] font-black text-xl hover:bg-indigo-500 hover:text-white transition-all active:scale-95 shadow-xl uppercase italic">BUILD</button>
      </div>
    </div>
  );
}