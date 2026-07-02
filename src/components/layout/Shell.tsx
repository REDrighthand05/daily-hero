 import TitleBar from "./TitleBar";
 import NoteList from "../notes/NoteList";
 import NoteEditor from "../notes/NoteEditor";
 import NoteSearch from "../notes/NoteSearch";
 const SettingsPage = React.lazy(() => import("../settings/SettingsPage"));
 import ClipboardList from "../clipboard/ClipboardList";
 import React from "react";
 import { useTranslation } from "react-i18next";
 const SearchOverlay = React.lazy(() => import("../search/SearchOverlay"));
 import { useAppStore } from "../../stores/appStore";
 import { useUIStore } from "../../stores/useUIStore";
 import { useEffect } from "react";
 import { listen } from "@tauri-apps/api/event";
 import { FileText, Clipboard, Settings } from "lucide-react";
 import { Button } from "@heroui/react";
 
 export default function Shell() {
   const { t } = useTranslation();
   const { loadAll } = useAppStore();
   const { activeTab, setActiveTab } = useUIStore();
 
   useEffect(() => {
     loadAll();
     const unlisten = listen<string>("navigate", (event) => {
       if (event.payload === "settings") setActiveTab("settings");
     });
     return () => {
       unlisten.then((fn) => fn());
     };
   }, []);
 
     useEffect(() => {
     const handler = (e: KeyboardEvent) => {
       const tag = (e.target as HTMLElement).tagName;
       if (tag === "INPUT" || tag === "TEXTAREA") return;
       const uiState = useUIStore.getState();
       if (uiState.globalSearchOpen) return;
       if (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key === "f")) {
         e.preventDefault();
         uiState.openGlobalSearch();
       }
     };
     window.addEventListener("keydown", handler);
     return () => window.removeEventListener("keydown", handler);
   }, []);
 
   return (
     <div className="flex flex-col h-screen overflow-hidden">
       <React.Suspense fallback={null}><SearchOverlay /></React.Suspense>
       <TitleBar />
       {activeTab === "notes" && (
         <div className="flex flex-col flex-1 overflow-hidden">
           <NoteSearch />
           <div className="flex flex-1 overflow-hidden">
             <NoteList />
             <NoteEditor />
           </div>
         </div>
       )}
       {activeTab === "clipboard" && <ClipboardList />}
       {activeTab === "settings" && <React.Suspense fallback={<div className="flex items-center justify-center flex-1 text-sm text-foreground-400">Loading...</div>}><SettingsPage /></React.Suspense>}
       <div className="flex border-t border-divider bg-content1 shrink-0">
         <Button
           size="sm"
           variant={activeTab === "notes" ? "solid" : "ghost"}
           color={activeTab === "notes" ? "primary" : "default"}
           onClick={() => setActiveTab("notes")}
           className="flex-1 h-9 min-w-0 text-xs rounded-none border-t-2 data-[pressed]:scale-100"
           startContent={<FileText size={14} />}
         >
           {t("tabs.notes")}
         </Button>
         <Button
           size="sm"
           variant={activeTab === "clipboard" ? "solid" : "ghost"}
           color={activeTab === "clipboard" ? "primary" : "default"}
           onClick={() => setActiveTab("clipboard")}
           className="flex-1 h-9 min-w-0 text-xs rounded-none border-t-2 data-[pressed]:scale-100"
           startContent={<Clipboard size={14} />}
         >
           {t("tabs.clipboard")}
         </Button>
         <Button
           size="sm"
           variant={activeTab === "settings" ? "solid" : "ghost"}
           color={activeTab === "settings" ? "primary" : "default"}
           onClick={() => setActiveTab("settings")}
           className="flex-1 h-9 min-w-0 text-xs rounded-none border-t-2 data-[pressed]:scale-100"
           startContent={<Settings size={14} />}
         >
           {t("tabs.settings")}
         </Button>
       </div>
     </div>
   );
 }
