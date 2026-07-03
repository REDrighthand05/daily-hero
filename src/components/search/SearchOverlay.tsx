import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useUIStore } from "../../stores/useUIStore";
import { globalSearch } from "../../bridge/ipc";
import type { SearchResultItem } from "../../types";
 import { Button } from "@heroui/react";
import { Search, FileText, Clipboard, X } from "lucide-react";

export default function SearchOverlay() {
  const { t } = useTranslation();
  const {
    globalSearchOpen, globalSearchQuery, globalSearchResults,
    closeGlobalSearch, setGlobalSearchQuery, setGlobalSearchResults, setActiveTab,
  } = useUIStore();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!globalSearchOpen) return;
    setSelectedIdx(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [globalSearchOpen]);

  useEffect(() => {
    if (!globalSearchOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") { closeGlobalSearch(); return; }
      if (e.key === "ArrowDown") { setSelectedIdx((i) => Math.min(i + 1, globalSearchResults.length - 1)); e.preventDefault(); }
      if (e.key === "ArrowUp") { setSelectedIdx((i) => Math.max(i - 1, 0)); e.preventDefault(); }
      if (e.key === "Enter" && globalSearchResults[selectedIdx]) { navigate(globalSearchResults[selectedIdx]); e.preventDefault(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [globalSearchOpen, globalSearchResults, selectedIdx]);

  if (!globalSearchOpen) return null;

  const doSearch = (q: string) => {
    setGlobalSearchQuery(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (q.length < 2) { setGlobalSearchResults([]); return; }
    debounceRef.current = setTimeout(async () => {
      const results = await globalSearch(q);
      setGlobalSearchResults(results);
    }, 250);
  };

  const navigate = (item: SearchResultItem) => {
    closeGlobalSearch();
    if (item.source === "note") setActiveTab("notes");
    else if (item.source === "clipboard") setActiveTab("clipboard");
  };

  const noteResults = globalSearchResults.filter((r) => r.source === "note");
  const clipResults = globalSearchResults.filter((r) => r.source === "clipboard");

  return (
    <div className="fixed inset-0 z-50 flex justify-center pt-20 bg-black/40" onClick={closeGlobalSearch}>
      <div className="w-[90%] max-w-[560px] max-h-[60vh] flex flex-col overflow-hidden rounded-xl bg-[oklch(var(--heroui-content))] border border-default-200 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-3 py-2 border-b border-default-200">
          <Search size={16} className="text-default-500" />
          <input
            ref={inputRef}
            value={globalSearchQuery}
            onChange={(e) => doSearch(e.target.value)}
            placeholder={t("search.placeholder")}
            className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-default-400"
          />
          <Button isIconOnly variant="ghost" size="sm" onPress={closeGlobalSearch}><X size={16} /></Button>
        </div>
        <div className="flex-1 overflow-auto">
          {noteResults.length > 0 && (
            <div>
              <div className="flex items-center gap-1 px-3 py-1.5 text-xs text-default-500 border-b border-default-200">
                <FileText size={12} /> {t("search.notes", { count: noteResults.length })}
              </div>
              {noteResults.map((r, i) => (
                <div key={r.id}
                 className="px-3 py-1.5 cursor-pointer text-sm"
                  onClick={() => navigate(r)} onMouseEnter={() => setSelectedIdx(i)}
                >
                  <div className="text-foreground">{r.title || "Untitled"}</div>
                  <div className="text-xs text-default-400">{r.snippet}</div>
                </div>
              ))}
            </div>
          )}
          {clipResults.length > 0 && (
            <div>
              <div className="flex items-center gap-1 px-3 py-1.5 text-xs text-default-500 border-b border-default-200">
                <Clipboard size={12} /> {t("search.clipboard", { count: clipResults.length })}
              </div>
              {clipResults.map((r, i) => (
                <div key={r.id}
                 className="px-3 py-1.5 cursor-pointer text-sm"
                  onClick={() => navigate(r)} onMouseEnter={() => setSelectedIdx(noteResults.length + i)}
                >
                  <div className="text-foreground">{r.title}</div>
                  <div className="text-xs text-default-400">{r.snippet}</div>
                </div>
              ))}
            </div>
          )}
          {globalSearchQuery.length >= 2 && globalSearchResults.length === 0 && (
            <div className="py-8 text-center text-sm text-default-400">{t("search.noResults")}</div>
          )}
        </div>
      </div>
    </div>
  );
}
