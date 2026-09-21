import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabViewProps {
  tabs: TabItem[];
  defaultTabId?: string;
}

export const TabView: React.FC<TabViewProps> = ({ tabs, defaultTabId }) => {
  const [activeTabId, setActiveTabId] = useState(defaultTabId || tabs[0]?.id || '');
  const contentRef = useRef<HTMLDivElement>(null);

  const activeTab = tabs.find(t => t.id === activeTabId) || tabs[0];

  useEffect(() => {
    if (!contentRef.current) return;

    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
    );
  }, [activeTabId]);

  return (
    <div className="w-full">
      {/* Tab Navigation Header */}
      <div className="flex border-b border-brand-brown/15 overflow-x-auto no-scrollbar scroll-smooth space-x-8 mb-8">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabId(tab.id)}
              className={`py-4 sub-nav-label transition-all duration-300 relative whitespace-nowrap text-sm ${
                isActive
                  ? 'text-brand-black font-semibold'
                  : 'text-brand-black/60 hover:text-brand-black'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-maroon transition-all duration-300" />
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Content Panel */}
      <div ref={contentRef} className="w-full min-h-[250px]">
        {activeTab?.content}
      </div>
    </div>
  );
};
