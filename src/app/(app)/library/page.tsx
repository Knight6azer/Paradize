"use client";

import { useState } from "react";
import { BookBookmark, MagnifyingGlass, Funnel, Books, BookmarkSimple, CheckCircle, XCircle } from "@phosphor-icons/react";

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("reading");

  // Mock data for UI demonstration
  const shelfBooks = [
    { id: 1, title: "Thinking, Fast and Slow", author: "Daniel Kahneman", status: "reading", progress: 45, coverUrl: "" },
    { id: 2, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", status: "reading", progress: 12, coverUrl: "" },
    { id: 3, title: "Atomic Habits", author: "James Clear", status: "completed", progress: 100, coverUrl: "" },
    { id: 4, title: "The Daily Stoic", author: "Ryan Holiday", status: "completed", progress: 100, coverUrl: "" },
    { id: 5, title: "Dune", author: "Frank Herbert", status: "want_to_read", progress: 0, coverUrl: "" },
  ];

  const filteredBooks = shelfBooks.filter(b => b.status === activeTab);

  return (
    <div className="animate-fade-in">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-8)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>My Library</h1>
          <p style={{ color: "var(--text-secondary)" }}>Your personal collection and reading progress.</p>
        </div>
        <button className="btn btn--primary">
          <MagnifyingGlass size={20} weight="bold" />
          Find New Books
        </button>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginBottom: "var(--space-8)", borderBottom: "1px solid var(--border-light)", paddingBottom: "var(--space-4)" }}>
        <button 
          className={`btn ${activeTab === 'reading' ? 'btn--secondary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('reading')}
          style={{ borderColor: activeTab === 'reading' ? 'var(--border-medium)' : 'transparent', background: activeTab === 'reading' ? 'var(--bg-card)' : 'transparent' }}
        >
          <BookBookmark size={18} weight={activeTab === 'reading' ? 'fill' : 'regular'} />
          Currently Reading (2)
        </button>
        <button 
          className={`btn ${activeTab === 'want_to_read' ? 'btn--secondary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('want_to_read')}
          style={{ borderColor: activeTab === 'want_to_read' ? 'var(--border-medium)' : 'transparent', background: activeTab === 'want_to_read' ? 'var(--bg-card)' : 'transparent' }}
        >
          <BookmarkSimple size={18} weight={activeTab === 'want_to_read' ? 'fill' : 'regular'} />
          Want to Read (1)
        </button>
        <button 
          className={`btn ${activeTab === 'completed' ? 'btn--secondary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('completed')}
          style={{ borderColor: activeTab === 'completed' ? 'var(--border-medium)' : 'transparent', background: activeTab === 'completed' ? 'var(--bg-card)' : 'transparent' }}
        >
          <CheckCircle size={18} weight={activeTab === 'completed' ? 'fill' : 'regular'} />
          Completed (2)
        </button>
      </div>

      {/* Tools */}
      <div style={{ display: "flex", gap: "var(--space-4)", marginBottom: "var(--space-8)" }}>
        <div className="input-group" style={{ flex: 1, flexDirection: "row", alignItems: "center", background: "var(--bg-card)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-lg)", padding: "0 var(--space-4)" }}>
          <MagnifyingGlass size={20} color="var(--text-tertiary)" />
          <input 
            type="text" 
            placeholder="Search your library..." 
            style={{ width: "100%", padding: "var(--space-3) 0", border: "none", background: "transparent", outline: "none" }} 
          />
        </div>
        <button className="btn btn--secondary">
          <Funnel size={20} />
          Filter
        </button>
      </div>

      {/* Grid */}
      {filteredBooks.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "var(--space-6)" }}>
          {filteredBooks.map((book) => (
            <div key={book.id} className="card card--interactive" style={{ display: "flex", gap: "var(--space-4)", padding: "var(--space-4)" }}>
              <div style={{ width: "80px", height: "120px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-md)", flexShrink: 0 }}>
                {/* Book Cover Placeholder */}
              </div>
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <h3 style={{ fontSize: "var(--text-md)", fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)", lineHeight: "var(--leading-snug)" }}>{book.title}</h3>
                <p style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "auto" }}>{book.author}</p>
                
                {book.status === 'reading' && (
                  <div style={{ marginTop: "var(--space-4)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "var(--text-xs)", marginBottom: "var(--space-2)" }}>
                      <span style={{ color: "var(--text-secondary)" }}>Progress</span>
                      <span style={{ fontWeight: "var(--weight-semibold)", color: "var(--forest-sage)" }}>{book.progress}%</span>
                    </div>
                    <div style={{ width: "100%", height: "6px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                      <div style={{ width: `${book.progress}%`, height: "100%", background: "var(--forest-sage)", borderRadius: "var(--radius-full)" }} />
                    </div>
                  </div>
                )}
                
                {book.status === 'completed' && (
                  <div className="badge badge--success" style={{ alignSelf: "flex-start", marginTop: "var(--space-4)" }}>
                    <CheckCircle size={14} weight="fill" /> Completed
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "var(--space-16) 0", background: "var(--bg-card)", borderRadius: "var(--radius-xl)", border: "1px dashed var(--border-medium)" }}>
          <Books size={48} weight="duotone" color="var(--text-tertiary)" style={{ margin: "0 auto var(--space-4)" }} />
          <h3 style={{ fontSize: "var(--text-xl)", marginBottom: "var(--space-2)" }}>No books found</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "var(--space-6)" }}>Your "{activeTab.replace('_', ' ')}" shelf is currently empty.</p>
          <button className="btn btn--secondary">Browse Books</button>
        </div>
      )}
    </div>
  );
}
