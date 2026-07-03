 import { useTranslation } from "react-i18next";
 import { useUIStore } from "../../stores/useUIStore";
 import { Search, X } from "lucide-react";
 import { Input } from "@heroui/react";
 
 export default function NoteSearch() {
   const { t } = useTranslation();
   const { searchQuery, setSearchQuery } = useUIStore();
 
   return (
     <div className="flex items-center gap-3 px-3 py-2 border-b border-divider">
       <Search size={14} className="text-foreground-400 shrink-0" />
       <Input
         
         
         placeholder={t("notes.search")}
         value={searchQuery}
         onChange={(e) => setSearchQuery(e.target.value)}
         className="flex-1"
         classNames={{ inputWrapper: "bg-transparent shadow-none px-0", input: "text-sm" }}
       />
       {searchQuery && (
         <button className="text-foreground-400 hover:text-foreground shrink-0" onClick={() => setSearchQuery("")}>
           <X size={14} />
         </button>
       )}
     </div>
   );
 }
