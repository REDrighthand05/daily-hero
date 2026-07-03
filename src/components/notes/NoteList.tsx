 import { useRef, useMemo } from "react";
 import { useVirtualizer } from "@tanstack/react-virtual";
 import { useTranslation } from "react-i18next";
 import { useAppStore } from "../../stores/appStore";
 import { useUIStore } from "../../stores/useUIStore";
 import type { Note } from "../../types";
 import { Plus, Pin, Trash2, Archive, ChevronUp, ChevronDown } from "lucide-react";
 import CategoryFilter from "../tags/CategoryFilter";
 import ArchiveToggle from "./ArchiveToggle";
 import TrashBin from "./TrashBin";
 import { Button } from "@heroui/react";
 
 function generateId(): string {
   return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
 }
 
 export default function NoteList() {
   const { t } = useTranslation();
   const {
     moveNote,
     notes,
     saveNote, archiveNote, restoreArchive, softDeleteNote
   } = useAppStore();
   const { searchQuery, selectedTagId, showArchived, showDeleted } = useUIStore();
   const parentRef = useRef<HTMLDivElement>(null);
 
   if (showDeleted) {
     return (
       <div className="w-[140px] min-w-[100px] border-r border-divider flex flex-col overflow-hidden">
         <ArchiveToggle />
         <div className="flex-1 overflow-hidden">
           <TrashBin />
         </div>
       </div>
     );
   }
 
   const sorted = useMemo(() => {
     let f = notes.filter((n) => {
       if (n.deleted_at !== null) return false;
       if (!showArchived && n.archived) return false;
       return true;
     });
     if (selectedTagId) f = f.filter((n) => n.tags.includes(selectedTagId));
     if (searchQuery) f = f.filter((n) =>
       n.content.toLowerCase().includes(searchQuery.toLowerCase())
     );
     return [...f].sort((a, b) => {
       if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
       return b.updated_at - a.updated_at;
     });
   }, [notes, showArchived, selectedTagId, searchQuery]);
 
   const virtualizer = useVirtualizer({
     count: sorted.length,
     getScrollElement: () => parentRef.current,
     estimateSize: () => 48,
     overscan: 5,
   });
 
   const handleNew = async () => {
     const now = Date.now();
     const note: Note = {
       id: generateId(),
       content: "",
       created_at: now,
       updated_at: now,
       pinned: false,
       tags: [],
       category: null,
       archived: false,
       deleted_at: null,
     };
     await saveNote(note);
   };
 
   return (
     <div className="w-[140px] min-w-[100px] border-r border-divider flex flex-col overflow-hidden">
       <ArchiveToggle />
       <div className="flex items-center justify-between px-3 py-1.5 border-b border-divider">
         <span className="text-[11px] text-foreground-400">{showArchived ? t("notes.archivedCount", { count: sorted.length }) : t("notes.count", { count: sorted.length })}</span>
         <Button isIconOnly size="sm" variant="ghost" className="w-6 h-6 min-w-0 text-foreground-400" onClick={handleNew} title={t("notes.newNote")}>
           <Plus size={16} />
         </Button>
       </div>
       <CategoryFilter />
       <div className="flex-1 overflow-y-auto" ref={parentRef}>
         <div style={{ height: `${virtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
           {virtualizer.getVirtualItems().map((vItem) => {
             const note = sorted[vItem.index];
             return (
               <div key={note.id} style={{
                 position: 'absolute', top: 0, left: 0, width: '100%',
                 height: `${vItem.size}px`,
                 transform: `translateY(${vItem.start}px)`
               }}>
                 <NoteListItem
                   note={note}
                   showArchived={showArchived}
                   onSave={saveNote}
                   onDelete={softDeleteNote}
                   onMove={moveNote}
                   onArchive={showArchived ? restoreArchive : archiveNote}
                 />
               </div>
             );
           })}
         </div>
       </div>
     </div>
   );
 }
 
 function NoteListItem({
   note, showArchived, onSave, onDelete, onMove, onArchive,
 }: {
   note: Note;
   showArchived: boolean;
   onSave: (n: Note) => Promise<void>;
   onDelete: (id: string) => Promise<void>;
   onArchive: (id: string) => Promise<void>;
   
   onMove: (id: string, dir: string) => Promise<void>;
 }) {
   const { t } = useTranslation();
   const togglePin = () => onSave({ ...note, pinned: !note.pinned });
   const line = note.content.split("\n")[0] || "";
   const text = line.slice(0, 60) || t("notes.empty");
 
   return (
     <div className={`flex items-center border-b border-divider group ${note.archived ? "opacity-60" : ""}`}>
       <div className="flex flex-col items-center gap-0 opacity-0 group-hover:opacity-100 transition-opacity duration-100 px-0.5">
         <Button isIconOnly size="sm" variant="ghost" className="w-4 h-3 min-w-0 text-foreground-400" onPress={() => onMove(note.id, "up")} title="Move up">
           <ChevronUp size={10} />
         </Button>
         <Button isIconOnly size="sm" variant="ghost" className="w-4 h-3 min-w-0 text-foreground-400" onPress={() => onMove(note.id, "down")} title="Move down">
           <ChevronDown size={10} />
         </Button>
       </div>
       <Button variant="ghost" size="sm" className="flex-1 flex items-center gap-1.5 px-3 py-2 text-left min-w-0 rounded-none justify-start h-auto" onPress={togglePin}>
         <Pin size={12} className={`shrink-0 ${note.pinned ? "text-primary" : "text-foreground-400"}`} />
         <span className="text-xs text-foreground-400 truncate">{text}</span>
       </Button>
       <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100">
         <Button isIconOnly size="sm" variant="ghost" className="w-6 h-6 min-w-0 text-foreground-400" onPress={() => onDelete(note.id)} title="Move to trash">
           <Trash2 size={12} />
         </Button>
         <Button isIconOnly size="sm" variant="ghost" className="w-6 h-6 min-w-0 text-foreground-400" onPress={() => onArchive(note.id)} title={showArchived ? "Unarchive" : "Archive"}>
           <Archive size={12} />
         </Button>
       </div>
     </div>
   );
 }
