 import { useTranslation } from "react-i18next";
 import type { ClipboardEntry as CEntry } from "../../types";
 import { Star, Trash2, Clipboard, ArrowLeft } from "lucide-react";
 import { writeClipboard } from "../../bridge/ipc";
 import { Button } from "@heroui/react";
 
 interface Props {
   entry: CEntry;
   onBack: () => void;
   onDelete: (id: string) => void;
   onStar: (id: string, starred: boolean) => void;
 }
 
 export default function ClipboardDetail({ entry, onBack, onDelete, onStar }: Props) {
   const { t } = useTranslation();
   const handleCopy = async () => {
     try { await writeClipboard(entry.content); } catch (e) { console.error("Clipboard copy failed:", e); }
   };
 
   return (
     <div className="flex flex-col h-full">
       <div className="flex items-center justify-between px-3 py-2 border-b border-divider">
         <Button size="sm" variant="light" className="h-7 min-w-0 text-xs gap-1" startContent={<ArrowLeft size={14} />} onClick={onBack}>
           Back
         </Button>
         <div className="flex gap-0.5">
           <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" onClick={handleCopy} title={t("clipboard.copy")}>
             <Clipboard size={14} />
           </Button>
           <Button isIconOnly size="sm" variant="light" className={`w-7 h-7 min-w-0 ${entry.starred ? "text-warning" : "text-foreground-400"}`} onClick={() => onStar(entry.id, !entry.starred)} title={entry.starred ? t("clipboard.unstar") : t("clipboard.star")}>
             <Star size={14} />
           </Button>
           <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" onClick={() => onDelete(entry.id)} title={t("common.delete")}>
             <Trash2 size={14} />
           </Button>
         </div>
       </div>
       <div className="flex-1 overflow-y-auto p-3">
         <pre className="text-xs leading-relaxed whitespace-pre-wrap break-all text-foreground">{entry.content}</pre>
       </div>
       <div className="px-3 py-2 text-[10px] text-foreground-400 border-t border-divider">
         {t("clipboard.contentType")}: {entry.content_type} | {new Date(entry.created_at).toLocaleString()}
       </div>
     </div>
   );
 }
