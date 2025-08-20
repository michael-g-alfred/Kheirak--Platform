import { useMemo, useRef, useState } from "react";

export default function ChatAi({ apiBase = "http://localhost:5004" }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hi! I’m Khairak Copilot. How can I help?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  const ASK_URL = useMemo(() => `${apiBase}/api/chat`, [apiBase]);

  async function send() {
    const q = input.trim();
    if (!q) return;

    const chatForApi = messages
      .slice(-6)
      .map(({ role, content }) => ({ role, content }));

    setMessages(prev => [...prev, { role: "user", content: q }]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch(ASK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: q, chat: chatForApi })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data?.error || "API error");

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.answer || data.choices?.[0]?.message?.content || "No response" }
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Sorry, I had a problem answering. Please try again." }
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        listRef.current?.lastElementChild?.scrollIntoView({ behavior: "smooth" });
      }, 0);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>Khairak Copilot</div>

      <div style={styles.messages} ref={listRef}>
        {messages.map((m, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              ...(m.role === "user" ? styles.user : styles.assistant)
            }}
          >
            {m.content}
          </div>
        ))}
        {loading && <div style={styles.typing}>…typing</div>}
      </div>

      <div style={styles.inputRow}>
        <textarea
          style={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything…"
          rows={2}
        />
        <button style={styles.sendBtn} onClick={send} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    position: "fixed",
    bottom: 16,
    right: 16,
    width: 340,
    maxHeight: 520,
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: 12,
    boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: "system-ui, sans-serif",
    zIndex: 9999
  },
  header: {
    padding: "10px 12px",
    fontWeight: 700,
    borderBottom: "1px solid #eee",
    background: "#fafafa"
  },
  messages: {
    padding: 12,
    gap: 8,
    display: "flex",
    flexDirection: "column",
    overflowY: "auto",
    minHeight: 180
  },
  message: {
    padding: "8px 12px",
    borderRadius: 8,
    maxWidth: "80%",
    wordBreak: "break-word"
  },
  user: {
    alignSelf: "flex-end",
    backgroundColor: "#007bff",
    color: "#fff"
  },
  assistant: {
    alignSelf: "flex-start",
    backgroundColor: "#f1f0f0",
    color: "#333"
  },
  typing: {
    fontStyle: "italic",
    fontSize: 14,
    color: "#888"
  },
  inputRow: {
    display: "flex",
    borderTop: "1px solid #eee"
  },
  input: {
    flex: 1,
    padding: 8,
    border: "none",
    outline: "none",
    resize: "none",
    fontFamily: "inherit",
    fontSize: 14
  },
  sendBtn: {
    padding: "0 16px",
    border: "none",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer"
  }
};


