"use client";

import { useSession } from "@/lib/auth/client";
import { BookBookmark, ChatTeardropDots, Trophy, Users, TrendUp, Sparkle } from "@phosphor-icons/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="animate-fade-in">
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "var(--space-10)" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>
            Welcome back, {session?.user?.name?.split(' ')[0] || 'Reader'}
          </h1>
          <p style={{ color: "var(--text-secondary)" }}>Here's what's happening in your intellectual journey.</p>
        </div>
        
        <div style={{ display: "flex", gap: "var(--space-4)" }}>
          <div className="card card--elevated" style={{ padding: "var(--space-3) var(--space-5)", display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
            <Trophy size={24} weight="duotone" color="var(--warm-amber)" />
            <div>
              <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", textTransform: "uppercase", fontWeight: "var(--weight-bold)", letterSpacing: "0.05em" }}>Reputation</div>
              <div style={{ fontSize: "var(--text-lg)", fontWeight: "var(--weight-bold)", color: "var(--text-primary)" }}>450 pts</div>
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "var(--space-8)" }}>
        
        {/* Left Column - Main Feed */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          
          {/* AI Recommendation Banner */}
          <div className="card" style={{ background: "linear-gradient(135deg, var(--forest-sage), var(--deep-teal))", color: "white", padding: "var(--space-8)", position: "relative", overflow: "hidden" }}>
            <div className="gradient-orb gradient-orb--amber" style={{ width: 300, height: 300, top: "-50%", right: "-10%", opacity: 0.2 }} />
            
            <div style={{ position: "relative", zIndex: 1 }}>
              <div className="badge" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "var(--space-4)" }}>
                <Sparkle size={14} weight="fill" /> AI Pick For You
              </div>
              <h2 style={{ fontSize: "var(--text-2xl)", color: "white", marginBottom: "var(--space-2)" }}>Thinking, Fast and Slow</h2>
              <p style={{ opacity: 0.9, maxWidth: "500px", marginBottom: "var(--space-6)", lineHeight: "1.5" }}>
                Based on your recent interest in human behavior, Daniel Kahneman's masterpiece will challenge how you perceive your own decision-making process.
              </p>
              <button className="btn" style={{ background: "white", color: "var(--deep-teal)" }}>
                View Book
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: "var(--text-xl)", marginTop: "var(--space-4)" }}>Recent Discussions</h3>
          
          {/* Discussion Cards */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="card card--interactive">
              <div style={{ display: "flex", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                <div className="avatar avatar--sm">R</div>
                <div>
                  <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--weight-semibold)" }}>Rahul Sharma</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>2 hours ago in The Psychology Group</div>
                </div>
              </div>
              
              <h4 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-2)" }}>Does the ego actually exist as described by Freud?</h4>
              <p style={{ color: "var(--text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-4)" }}>
                I was reading chapter 4 and it struck me that modern neuroscience hasn't really found a physical manifestation of the ego. Is it just a useful metaphor?
              </p>
              
              <div style={{ display: "flex", gap: "var(--space-4)", borderTop: "1px solid var(--border-light)", paddingTop: "var(--space-3)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                  <TrendUp size={16} /> 12 Upvotes
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", color: "var(--text-tertiary)", fontSize: "var(--text-sm)" }}>
                  <ChatTeardropDots size={16} /> 8 Insights
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Right Column - Sidebar Widgets */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-6)" }}>
          
          {/* Currently Reading */}
          <div className="card">
            <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <BookBookmark size={20} weight="duotone" color="var(--forest-sage)" />
              Currently Reading
            </h3>
            
            <div style={{ display: "flex", gap: "var(--space-4)", alignItems: "center" }}>
              <div style={{ width: "60px", height: "90px", background: "var(--border-light)", borderRadius: "var(--radius-sm)" }}>
                {/* Book Cover Placeholder */}
              </div>
              <div>
                <div style={{ fontWeight: "var(--weight-semibold)", marginBottom: "var(--space-1)" }}>Sapiens</div>
                <div style={{ fontSize: "var(--text-sm)", color: "var(--text-secondary)", marginBottom: "var(--space-2)" }}>Yuval Noah Harari</div>
                
                {/* Progress Bar */}
                <div style={{ width: "100%", height: "6px", background: "var(--bg-tertiary)", borderRadius: "var(--radius-full)", overflow: "hidden" }}>
                  <div style={{ width: "45%", height: "100%", background: "var(--forest-sage)", borderRadius: "var(--radius-full)" }} />
                </div>
                <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)", marginTop: "var(--space-1)", textAlign: "right" }}>45%</div>
              </div>
            </div>
          </div>

          {/* Active Groups */}
          <div className="card">
            <h3 style={{ fontSize: "var(--text-lg)", marginBottom: "var(--space-4)", display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <Users size={20} weight="duotone" color="var(--deep-teal)" />
              Your Groups
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", padding: "var(--space-2)", borderRadius: "var(--radius-md)", cursor: "pointer" }} className="hover-bg-secondary">
                <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "rgba(45, 95, 62, 0.1)", color: "var(--forest-sage)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Users size={20} weight="fill" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "var(--weight-medium)", fontSize: "var(--text-sm)" }}>Mumbai Philosophy Circle</div>
                  <div style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>12 members • Active now</div>
                </div>
              </div>
            </div>
            
            <button className="btn btn--ghost btn--sm" style={{ width: "100%", marginTop: "var(--space-4)" }}>
              Find More Groups
            </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
