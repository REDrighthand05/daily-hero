 import { useTranslation } from "react-i18next";
 import { useAppStore } from "../../stores/appStore";
 import { RotateCcw, Trash2, AlertTriangle } from "lucide-react";
 import { Button } from "@heroui/react";
 
 export default function TrashBin() {
   const { t } = useTranslation();
   const { notes, restoreNote, deleteNote, purgeTrash } = useAppStore();
 
   const deleted = notes.filter((n) => n.deleted_at !== null)
     .sort((a, b) => (b.deleted_at || 0) - (a.deleted_at || 0));
 
   const handlePurge = () => {
     if (confirm(t("notes.purgeConfirm"))) {
       purgeTrash();
     }
   };
 
   if (deleted.length === 0) {
     return (
       <div className="py-5 text-center text-sm text-foreground-400">
         <p>{t("notes.trashEmpty")}</p>
       </div>
     );
   }
 
   return (
     <div>
       <div className="flex items-center justify-between px-3 py-1.5 text-xs text-foreground-400 border-b border-divider">
         <span>{t("notes.deletedCount", { count: deleted.length })}</span>
         <Button size="sm" variant="ghost" color="danger" className="h-6 min-w-0 text-xs px-2 gap-1" startContent={<AlertTriangle size={12} />} onClick={handlePurge} title={t("notes.purgeAll")}>
           Purge all
         </Button>
       </div>
       <div>
         {deleted.map((note) => (
           <div key={note.id} className="flex items-center justify-between px-3 py-1.5 border-b border-divider text-xs">
             <span className="text-foreground-400 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
               {note.content.slice(0, 50) || t("notes.empty")}
             </span>
             <div className="flex gap-1.5">
               <Button isIconOnly size="sm" variant="ghost" className="w-6 h-6 min-w-0 text-foreground-400" onClick={() => restoreNote(note.id)} title={t("notes.restore")}>
                 <RotateCcw size={12} />
               </Button>
               <Button isIconOnly size="sm" variant="ghost" className="w-6 h-6 min-w-0 text-foreground-400" onClick={() => deleteNote(note.id)} title={t("notes.deletePermanent")}>
                 <Trash2 size={12} />
               </Button>
             </div>
           </div>
         ))}
       </div>
     </div>
   );
 }
