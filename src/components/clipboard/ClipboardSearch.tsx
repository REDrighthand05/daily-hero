 import { useTranslation } from "react-i18next";
 import { useUIStore } from "../../stores/useUIStore";
 import { Search, X } from "lucide-react";
 import { Input } from "@heroui/react";
 
 export default function ClipboardSearch() {
   const { t } = useTranslation();
   const { clipboardSearchQuery, setClipboardSearchQuery } = useUIStore();
 
   return (
     <div className="flex items-center gap-2 px-3 py-2 border-b border-divider">
       <Search size={14} className="text-foreground-500 shrink-0" />
       <Input
         variant="flat"
         size="sm"
         value={clipboardSearchQuery}
         onChange={(e) => setClipboardSearchQuery(e.target.value)}
         placeholder={t("clipboard.search")}
         className="flex-1"
         classNames={{ inputWrapper: "bg-transparent shadow-none px-0", input: "text-xs" }}
       />
       {clipboardSearchQuery && (
         <button className="text-foreground-400 hover:text-foreground shrink-0 p-0.5" onClick={() => setClipboardSearchQuery("")}>
           <X size={12} />
         </button>
       )}
     </div>
   );
 }
