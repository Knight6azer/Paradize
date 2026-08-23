"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth/client";
import { Users, Plus, BookOpenText } from "@phosphor-icons/react";
import GroupCard from "@/app/components/GroupCard";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import EmptyState from "@/app/components/EmptyState";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function GroupsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<"discover" | "my_groups">("discover");
  const [groups, setGroups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadGroups() {
      setIsLoading(true);
      try {
        const url = activeTab === "my_groups" && session?.user?.id
          ? `/api/groups?my=true&userId=${session.user.id}`
          : `/api/groups`;
          
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setGroups(data.groups || []);
        }
      } catch (error) {
        console.error("Failed to load groups:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (activeTab === "discover" || session?.user?.id) {
      loadGroups();
    } else {
      setIsLoading(false);
    }
  }, [activeTab, session]);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "var(--space-8)" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h1 style={{ fontSize: "var(--text-3xl)", marginBottom: "var(--space-2)" }}>Reading Groups</h1>
          <p style={{ color: "var(--text-secondary)" }}>Read together, grow together. Join a circle of like-minded readers.</p>
        </div>
        
        <button 
          className="btn btn--primary"
          onClick={() => {
            if (!session) router.push("/login");
            else router.push("/groups/new"); // In a full implementation, create this page
          }}
        >
          <Plus size={16} weight="bold" />
          Create Group
        </button>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", background: "var(--bg-secondary)", padding: "var(--space-1)", borderRadius: "var(--radius-lg)", width: "max-content" }}>
        <button 
          className={`btn ${activeTab === 'discover' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => setActiveTab('discover')}
          style={{ padding: "var(--space-2) var(--space-4)" }}
        >
          Discover Groups
        </button>
        <button 
          className={`btn ${activeTab === 'my_groups' ? 'btn--primary' : 'btn--ghost'}`}
          onClick={() => {
            if (!session) router.push("/login");
            else setActiveTab('my_groups');
          }}
          style={{ padding: "var(--space-2) var(--space-4)" }}
        >
          My Groups
        </button>
      </div>

      {/* Groups Grid */}
      {isLoading ? (
        <LoadingSpinner label="Loading groups..." />
      ) : groups.length > 0 ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "var(--space-6)" }}>
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              id={group.id}
              name={group.name}
              description={group.description}
              memberCount={group.memberCount}
              maxMembers={group.maxMembers}
              currentBookTitle={group.currentBookTitle}
              genreFocus={group.genreFocus}
              isPublic={group.isPublic}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<Users size={48} weight="duotone" />}
          title={activeTab === 'discover' ? "No public groups available" : "You haven't joined any groups"}
          description={activeTab === 'discover' 
            ? "Be the first to create a public reading group in the community!" 
            : "Explore public groups or create your own to start reading with others."}
          action={activeTab === 'my_groups' ? { 
            label: "Discover Groups", 
            onClick: () => setActiveTab("discover") 
          } : {
            label: "Create Group",
            onClick: () => {
              if (!session) router.push("/login");
              else router.push("/groups/new");
            }
          }}
        />
      )}
    </div>
  );
}
