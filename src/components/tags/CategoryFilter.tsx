 import { useTranslation } from "react-i18next";
 import { useAppStore } from "../../stores/appStore";
 import { useUIStore } from "../../stores/useUIStore";
 import { X } from "lucide-react";
 import { Button } from "@heroui/react";
 
 export default function CategoryFilter() {
   const { t } = useTranslation();
   const { tags, notes } = useAppStore();
   const { selectedTagId, setSelectedTagId } = useUIStore();
 
   const tagCounts = new Map<string, number>();
   notes.forEach((n) => n.tags.forEach((tId) => {
     tagCounts.set(tId, (tagCounts.get(tId) || 0) + 1);
   }));
 
   return (
     <div className="flex flex-wrap gap-1.5 px-3 py-1.5 border-b border-divider">
       <Button
         size="sm"
         variant={!selectedTagId ? "solid" : "outline"}
         color={!selectedTagId ? "primary" : "default"}
         onClick={() => setSelectedTagId(null)}
         className="h-6 min-w-0 text-xs px-2"
       >
         {t("notes.all")} ({notes.length})
       </Button>
       {tags
         .filter((t) => (tagCounts.get(t.id) || 0) > 0)
         .map((tag) => (
           <Button
             key={tag.id}
             size="sm"
             variant={selectedTagId === tag.id ? "solid" : "outline"}
             color={selectedTagId === tag.id ? "primary" : "default"}
             onClick={() => setSelectedTagId(tag.id === selectedTagId ? null : tag.id)}
             className="h-6 min-w-0 text-xs px-2 gap-1"
           >
             <span className="w-1.5 h-1.5 rounded-full shrink-0 inline-block" style={{ backgroundColor: tag.color || "#888" }} />
             {tag.name} ({tagCounts.get(tag.id) || 0})
             {selectedTagId === tag.id && <X size={10} className="align-middle" />}
           </Button>
         ))}
     </div>
   );
 }
