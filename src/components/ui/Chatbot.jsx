import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import OpenAI from 'openai';

// ── OpenAI Configuration ──────────────────────────────────────────────────────
const OPENAI_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const openai = (OPENAI_KEY && OPENAI_KEY !== 'your_openai_api_key_here') 
  ? new OpenAI({ apiKey: OPENAI_KEY, dangerouslyAllowBrowser: true }) 
  : null;

const SYSTEM_PROMPT = `
Tu es l'assistant IA officiel de Abdessamad KAF. Ton rôle est d'aider les visiteurs à explorer son portfolio et à répondre à leurs questions de manière précise et professionnelle.

Informations Clés :
- Identité : Abdessamad KAF, Étudiant en Génie Logiciel.
- Spécialité : Développement Full Stack (React, Node.js, Laravel, Cloud).
- Localisation : Fès, Maroc.
- Contact : kafabdssamad58@gmail.com | Téléphone : +212 6 28 94 67 07.

Sections du Portfolio (Guide l'utilisateur vers ces pages si nécessaire) :
1. Accueil : Présentation générale et technologies clés.
2. Projets : Liste des réalisations techniques (Web, Mobile, 3D). Dis-lui qu'il peut voir les démos et codes sources là-bas.
3. Certificats : Page dédiée affichant toutes ses certifications professionnelles (Cloud, Dev, etc.).
4. CV : Page permettant de visualiser et de TÉLÉCHARGER son CV complet en FR ou EN.
5. Activités : Ses engagements parascolaires (Clubs, Compétitions comme des Hackathons, Bénévolat).
6. Contact : Un formulaire pour lui envoyer un message direct.

Instructions de réponse :
- Sois concis, amical et professionnel.
- Réponds toujours dans la langue utilisée par le visiteur (Français ou Anglais).
- Si on te demande des détails très précis sur un projet ou certificat que tu n'as pas en mémoire, invite poliment l'utilisateur à cliquer sur la section correspondante dans le menu pour voir les derniers détails à jour.
- Ne parle jamais au nom de quelqu'un d'autre que Abdessamad.
`;

// ── Knowledge base (Fallback for offline/no-key) ──────────────────────────────
const FAQ_DATA = {
  fr: [
    { q: 'Qui es-tu ?', a: 'Je suis Abdessamad KAF, étudiant en Génie Logiciel passionné par le développement web full-stack. Je maîtrise React, Node.js, Laravel et les architectures cloud.' },
    { q: 'Tes compétences ?', a: 'Frontend : React, Next.js, Tailwind CSS. Backend : Node.js, Laravel, NestJS. Base de données : PostgreSQL, MySQL, MongoDB. Cloud & DevOps : Docker, GitHub Actions, Supabase.' },
    { q: 'Comment te contacter ?', a: 'Vous pouvez m\'envoyer un email à kafabdssamad58@gmail.com ou utiliser le formulaire de contact sur cette page. Je réponds généralement dans les 24h.' },
    { q: 'Disponible pour des missions ?', a: 'Oui ! Je suis disponible pour des stages, des projets freelance et des collaborations. N\'hésitez pas à me contacter pour discuter de votre projet.' },
    { q: 'Voir tes projets ?', a: 'Bien sûr ! Vous pouvez consulter mes projets dans la section "Projets" de mon portfolio ou visiter mon GitHub : github.com/KAF-Abdessamad' },
  ],
  en: [
    { q: 'Who are you?', a: 'I\'m Abdessamad KAF, a Software Engineering student passionate about full-stack web development. I specialize in React, Node.js, Laravel, and cloud architectures.' },
    { q: 'Your skills?', a: 'Frontend: React, Next.js, Tailwind CSS. Backend: Node.js, Laravel, NestJS. Databases: PostgreSQL, MySQL, MongoDB. Cloud & DevOps: Docker, GitHub Actions, Supabase.' },
    { q: 'How to contact you?', a: 'You can email me at kafabdssamad58@gmail.com or use the contact form on this page. I usually reply within 24 hours.' },
    { q: 'Available for projects?', a: 'Yes! I\'m open to internships, freelance projects, and collaborations. Feel free to reach out to discuss your project.' },
    { q: 'See your projects?', a: 'Of course! You can check out my projects in the "Projects" section of my portfolio or visit my GitHub: github.com/KAF-Abdessamad' },
  ],
};

const GREETINGS = {
  fr: 'Bonjour 👋 Je suis l\'assistant IA de KAF. Comment puis-je vous aider ?',
  en: 'Hello 👋 I\'m KAF\'s AI assistant. How can I help you today?',
};

// ── Simple keyword matcher (Fallback) ──────────────────────────────────────────
function getLocalFallback(input, lang) {
  const lower = input.toLowerCase();
  const faqs = FAQ_DATA[lang] || FAQ_DATA.fr;
  const keywords = {
    fr: { 'qui|bonjour|salut|présent': 0, 'compétence|skill|techno|stack': 1, 'contact|email': 2, 'dispo|mission|stage': 3, 'projet|github': 4 },
    en: { 'who|hello|hi|introduce': 0, 'skill|techno|stack': 1, 'contact|email': 2, 'available|hire|internship': 3, 'project|github': 4 }
  };
  const map = keywords[lang] || keywords.fr;
  for (const [pattern, idx] of Object.entries(map)) {
    if (new RegExp(pattern).test(lower)) return faqs[idx].a;
  }
  return lang === 'fr'
    ? 'Je ne suis pas sûr de comprendre 🤔 Essayez l\'un des sujets ci-dessous ou contactez directement Abdessamad !'
    : 'I\'m not sure I understand 🤔 Try one of the topics below or contact Abdessamad directly!';
}

async function getBotReply(input, lang, history) {
  if (!openai) return getLocalFallback(input, lang);

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.from === 'bot' ? 'assistant' : 'user', content: m.text })),
        { role: "user", content: input }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });
    return completion.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI Error:", error);
    return getLocalFallback(input, lang);
  }
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ msg }) {
  const isBot = msg.from === 'bot';
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.25 }}
      className={`flex gap-2 ${isBot ? 'justify-start' : 'justify-end'}`}
    >
      {isBot && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mt-0.5">
          <Bot size={14} className="text-accent" />
        </div>
      )}
      <div
        className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isBot
            ? 'bg-bg-surface border border-border-def text-text-sec rounded-tl-sm'
            : 'bg-accent text-white rounded-tr-sm'
        }`}
      >
        {msg.text}
      </div>
      {!isBot && (
        <div className="shrink-0 w-7 h-7 rounded-full bg-bg-surface border border-border-def flex items-center justify-center mt-0.5">
          <User size={14} className="text-text-mut" />
        </div>
      )}
    </motion.div>
  );
}

// ── Main Chatbot component ───────────────────────────────────────────────────
export default function Chatbot() {
  const { i18n } = useTranslation();
  const lang = i18n.language?.startsWith('en') ? 'en' : 'fr';

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: GREETINGS[lang], id: 0 },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Update greeting when language changes
  useEffect(() => {
    setMessages([{ from: 'bot', text: GREETINGS[lang], id: 0 }]);
  }, [lang]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when opening
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = { from: 'user', text: text.trim(), id: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const reply = await getBotReply(text, lang, [...messages, userMsg]);
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: 'bot', text: reply, id: Date.now() + 1 }]);
    } catch (err) {
      setIsTyping(false);
      console.error("Chatbot Error:", err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage(input);
  };

  const faqs = FAQ_DATA[lang];

  return (
    <>
      {/* ── Floating toggle button ─────────────────────────────────────── */}
      <motion.button
        id="chatbot-toggle"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.92 }}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent shadow-accent flex items-center justify-center text-white"
        aria-label={open ? 'Fermer le chat' : 'Ouvrir le chat'}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={22} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <MessageCircle size={22} />
            </motion.span>
          )}
        </AnimatePresence>

        {/* Ping notification dot */}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-accent border-2 border-bg-primary" />
          </span>
        )}
      </motion.button>

      {/* ── Chat window ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="chatwindow"
            initial={{ opacity: 0, scale: 0.88, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm sm:right-6 sm:w-[380px] rounded-2xl border border-border-def bg-bg-primary/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ maxHeight: 'calc(100vh - 8rem)' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-bg-surface border-b border-border-def">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center">
                  <Sparkles size={16} className="text-accent" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-bg-surface" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-pri leading-none">KAF Assistant</p>
                <p className="text-xs text-green-400 font-mono mt-0.5">
                  {lang === 'fr' ? 'En ligne' : 'Online'}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-mut hover:text-text-pri transition-colors"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
              {messages.map((msg) => (
                <Bubble key={msg.id} msg={msg} />
              ))}

              {/* Typing indicator */}
              <AnimatePresence>
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="flex gap-2 justify-start"
                  >
                    <div className="shrink-0 w-7 h-7 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mt-0.5">
                      <Bot size={14} className="text-accent" />
                    </div>
                    <div className="px-4 py-3 bg-bg-surface border border-border-def rounded-2xl rounded-tl-sm flex gap-1 items-center">
                      {[0, 1, 2].map((i) => (
                        <motion.span
                          key={i}
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                          className="w-1.5 h-1.5 rounded-full bg-text-mut inline-block"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              <div ref={bottomRef} />
            </div>

            {/* Quick suggestions */}
            <div className="px-4 pb-3 pt-1 flex gap-2 overflow-x-auto no-scrollbar border-t border-border-def/50">
              {faqs.map((faq, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(faq.q)}
                  className="shrink-0 text-xs px-3 py-1.5 rounded-full bg-bg-surface border border-border-def text-text-sec hover:border-accent/50 hover:text-text-acc transition-all duration-200 whitespace-nowrap"
                >
                  {faq.q}
                </button>
              ))}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-4 py-3 bg-bg-surface border-t border-border-def"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={lang === 'fr' ? 'Écrivez votre message...' : 'Type your message...'}
                className="flex-1 min-w-0 bg-bg-elevated border border-border-def text-text-pri text-sm rounded-xl px-3 py-2 outline-none focus:border-accent/60 transition-colors placeholder:text-text-mut"
              />
              <motion.button
                type="submit"
                whileTap={{ scale: 0.9 }}
                disabled={!input.trim() || isTyping}
                className="shrink-0 w-9 h-9 rounded-xl bg-accent disabled:opacity-40 flex items-center justify-center text-white shadow-accent transition-opacity"
                aria-label="Envoyer"
              >
                <Send size={15} />
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
