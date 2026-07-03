 import { useState, useEffect, useRef } from "react";
 import { useTranslation } from "react-i18next";
 import { useAppStore } from "../../stores/appStore";
 import { useUIStore } from "../../stores/useUIStore";
 import type { Note } from "../../types";
 import TagChip from "../tags/TagChip";
 import TagPicker from "../tags/TagPicker";
 import EditorToolbar from "./EditorToolbar";
 import ExportMenu from "./ExportMenu";
 import MarkdownPreview from "./MarkdownPreview";
 import { Button } from "@heroui/react";
 
 export default function NoteEditor() {
   const { t } = useTranslation();
   const { notes, tags, saveNote } = useAppStore();
   const { editorMode, setEditorMode } = useUIStore();
   const [editingId, setEditingId] = useState<string | null>(null);
   const [showTagPicker, setShowTagPicker] = useState(false);
   const textareaRef = useRef<HTMLTextAreaElement>(null);
   const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
 
   const sorted = [...notes].sort((a, b) => b.updated_at - a.updated_at);
   const editingNote = editingId
     ? notes.find((n) => n.id === editingId)
     : sorted[0];
 
   useEffect(() => {
     if (!editingId && notes.length > 0) {
       setEditingId(sorted[0]?.id ?? null);
     }
   }, [notes]);
 
   if (!editingNote) {
     return (
       <div className="flex-1 flex items-center justify-center text-foreground-400 text-xs">
         <p>{t("notes.selectNote")}</p>
       </div>
     );
   }
 
   const handleChange = (content: string) => {
     const updated: Note = { ...editingNote, content, updated_at: Date.now() };
     saveNote(updated);
   };
 
   useEffect(() => {
     return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
   }, []);
 
   const handleTagToggle = (tagId: string) => {
     const exists = editingNote.tags.includes(tagId);
     const newTags = exists
       ? editingNote.tags.filter((id) => id !== tagId)
       : [...editingNote.tags, tagId];
     saveNote({ ...editingNote, tags: newTags, updated_at: Date.now() });
   };
 
   const handleInsert = (before: string, after: string) => {
     const ta = textareaRef.current;
     if (!ta) return;
     const start = ta.selectionStart;
     const end = ta.selectionEnd;
     const selected = editingNote.content.slice(start, end);
     const newContent =
       editingNote.content.slice(0, start) +
       before + selected + after +
       editingNote.content.slice(end);
     const cursorPos = start + before.length + selected.length + after.length;
     handleChange(newContent);
     requestAnimationFrame(() => {
       ta.focus();
       ta.setSelectionRange(cursorPos, cursorPos);
     });
   };
 
   const noteTags = tags.filter((t) => editingNote.tags.includes(t.id));
 
   return (
     <div className="flex-1 flex flex-col">
       <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-divider flex-wrap">
         <ExportMenu note={editingNote} />
         {noteTags.map((tag) => (
           <TagChip key={tag.id} tag={tag} onRemove={() => handleTagToggle(tag.id)} />
         ))}
         <Button size="sm" variant={showTagPicker ? "solid" : "bordered"} className="h-6 min-w-0 text-xs px-2 rounded-full border-dashed" onPress={() => setShowTagPicker(!showTagPicker)}>
           {showTagPicker ? t("common.done") : t("tags.addTags")}
         </Button>
       </div>
       {showTagPicker && <TagPicker onToggle={handleTagToggle} />}
       <EditorToolbar mode={editorMode} onModeChange={setEditorMode} onInsert={handleInsert} />
       <div className="flex-1 flex overflow-hidden">
         {editorMode !== "preview" && (
           <textarea
             ref={textareaRef}
             className={`flex-1 border-none resize-none p-3 text-xs leading-relaxed bg-transparent text-foreground outline-none ${editorMode === "split" ? "w-1/2 border-r border-divider" : ""}`}
             value={editingNote.content}
             onChange={(e) => handleChange(e.target.value)}
             placeholder={t("notes.startTyping")}
             autoFocus
           />
         )}
         {editorMode !== "edit" && (
           <MarkdownPreview content={editingNote.content} />
         )}
       </div>
     </div>
   );
 }

