 import { useTranslation } from "react-i18next";
 import { useUIStore } from "../../stores/useUIStore";
 import { Settings, StickyNote } from "lucide-react";
 import type { Tab } from "../../types";
 import { Button } from "@heroui/react";
 
 export default function TitleBar() {
   const { t } = useTranslation();
   const { activeTab, setActiveTab } = useUIStore();
 
   const tabs: { id: Tab; icon: React.ReactNode; label: string }[] = [
     { id: "notes", icon: <StickyNote size={16} />, label: t("tabs.notes") },
     { id: "settings", icon: <Settings size={16} />, label: t("tabs.settings") },
   ];
 
   return (
     <div
       data-tauri-drag-region
       className="flex items-center px-3 h-[34px] min-h-[34px] border-b border-divider"
     >
       <div className="flex gap-0.5">
         {tabs.map((tab) => (
           <Button
             key={tab.id}
             size="sm"
             variant={activeTab === tab.id ? "solid" : "ghost"}

             onClick={() => setActiveTab(tab.id)}
             title={tab.label}
             className="h-7 min-w-0 text-xs px-2 gap-1.5 rounded-md"
             startContent={tab.icon}
           >
             {tab.label}
           </Button>
         ))}
       </div>
     </div>
   );
 }

