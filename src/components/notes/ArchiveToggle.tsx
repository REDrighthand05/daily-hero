 import { useTranslation } from "react-i18next";
 import { useUIStore } from "../../stores/useUIStore";
 import { Archive, Trash2, FileText } from "lucide-react";
 import { Button } from "@heroui/react";
 
 export default function ArchiveToggle() {
   const { t } = useTranslation();
   const { showArchived, showDeleted, setShowArchived, setShowDeleted } = useUIStore();
 
   const mode = showDeleted ? "trash" : showArchived ? "archive" : "active";
 
   return (
     <div className="flex border-b border-divider">
       <Button
         size="sm"
         variant={mode === "active" ? "solid" : "ghost"}
         color={mode === "active" ? "primary" : "default"}
         onClick={() => { setShowDeleted(false); setShowArchived(false); }}
         title={t("notes.active")}
         className="flex-1 h-8 min-w-0 text-xs rounded-none border-b-2 data-[pressed]:scale-100"
         startContent={<FileText size={12} />}
       >
         {t("notes.active")}
       </Button>
       <Button
         size="sm"
         variant={mode === "archive" ? "solid" : "ghost"}
         color={mode === "archive" ? "primary" : "default"}
         onClick={() => setShowArchived(true)}
         title={t("notes.archived")}
         className="flex-1 h-8 min-w-0 text-xs rounded-none data-[pressed]:scale-100"
         startContent={<Archive size={12} />}
       >
         {t("notes.archived")}
       </Button>
       <Button
         size="sm"
         variant={mode === "trash" ? "solid" : "ghost"}
         color={mode === "trash" ? "primary" : "default"}
         onClick={() => setShowDeleted(true)}
         title={t("notes.trash")}
         className="flex-1 h-8 min-w-0 text-xs rounded-none data-[pressed]:scale-100"
         startContent={<Trash2 size={12} />}
       >
         {t("notes.trash")}
       </Button>
     </div>
   );
 }
