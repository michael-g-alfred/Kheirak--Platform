import { useMemo, useRef, useState, useEffect } from "react";
import CommentIcon from "../icons/CommentIcon";
import SubmitButton from "./SubmitButton";
import Loader from "./Loader";

export default function ChatAi({ apiBase = "http://localhost:5004" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "مرحباً! أنا مساعد منصة خِيرُكَ الذكى. كيف يمكنني المساعدة؟",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const listRef = useRef(null);

  const ASK_URL = useMemo(() => `${apiBase}/api/chat`, [apiBase]);

  async function send() {
    const q = input.trim();
    if (!q) return;

    const chatForApi = messages
      .slice(-6)
      .map(({ role, content }) => ({ role, content }));

    setMessages((prev) => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(ASK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, chat: chatForApi }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "API error");

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.answer || data.choices?.[0]?.message?.content || "لا يوجد رد",
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "عذرًا، حدثت مشكلة أثناء الإجابة. من فضلك حاول مرة أخرى.",
        },
      ]);
    } finally {
      setLoading(false);
      listRef.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  // ⛔ منع سكرول الصفحة الخارجية عند فتح الشات
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* الزر العائم */}
      <button
        className={`fixed bottom-4 right-4 w-16 h-16 rounded-full 
    bg-[var(--color-bg-card-dark)] border-[var(--color-bg-divider)] 
    flex justify-center items-center 
    hover:bg-[var(--color-primary-base)] text-[var(--color-primary-base)] 
    hover:text-[var(--color-bg-text)] z-[9999]
    ${loading ? "border-2" : "border"}
    ${loading ? "halo-glow" : ""}
    ${loading ? "animate-pulse-glow" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label={open ? "إغلاق محادثة خِيرُكَ" : "فتح محادثة خِيرُكَ"}
        aria-expanded={open}
        aria-controls="khairak-chat-window">
        {loading ? (
          <Loader size={30} />
        ) : (
          <CommentIcon size={30} aria-hidden="true" />
        )}
      </button>

      {/* نافذة الشات */}
      {open && (
        <>
          {/* الـ backdrop */}
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-500/20 backdrop-blur-xs z-[9998]"
            onClick={() => setOpen(false)}
            role="presentation"
            aria-hidden="true"></div>

          <div
            id="khairak-chat-window"
            className="flex flex-col h-100 w-120 aspect-square fixed bottom-22 right-4 border border-[var(--color-bg-divider)] rounded-lg bg-[var(--color-bg-card)] overflow-hidden z-[9999]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="khairak-chat-title">
            <div
              id="khairak-chat-title"
              className="px-4 py-2 font-semibold text-[var(--color-bg-text)] bg-[var(--color-primary-base)] border-b-2  border-[var(--color-bg-divider)]">
              مساعد خِيرُكَ الذكي
            </div>

            {/* منطقة الرسائل */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions text">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`px-3 py-2 rounded max-w-[90%] whitespace-pre-wrap ${
                    m.role === "user"
                      ? "ml-auto bg-[var(--color-primary-base)] text-[var(--color-bg-text)]"
                      : "mr-auto bg-[var(--color-bg-card-dark)] text-[var(--color-bg-text-dark)]"
                  }`}
                  role="note"
                  aria-label={
                    m.role === "user" ? "رسالتك" : "رد المساعد الذكي"
                  }>
                  {m.content}
                </div>
              ))}
              {loading && (
                <div
                  dir="rtl"
                  className="text-sm text-[var(--color-bg-text-dark)] italic"
                  role="status"
                  aria-live="assertive">
                  …المساعد يكتب الآن
                </div>
              )}
            </div>

            {/* إدخال الرسالة */}
            <div className="flex items-center justify-center gap-2 border-t border-[var(--color-bg-divider)] p-2">
              <label htmlFor="chat-input" className="sr-only">
                اكتب رسالتك
              </label>
              <input
                id="chat-input"
                className="w-full h-full border border-[var(--color-bg-divider)] rounded-lg px-2 text-[var(--color-bg-text-dark)] text-right align-middle focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-[var(--color-primary-base)]"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="اسألني أي شيء..."
                aria-label="اكتب رسالتك هنا"
              />
              <SubmitButton
                buttonTitle={"إرسال"}
                disabled={loading}
                onClick={send}
                aria-label="إرسال الرسالة"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}
