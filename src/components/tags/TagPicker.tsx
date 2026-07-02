 import { useState } from "react";
 import TagChip from "./TagChip";
 import { useAppStore } from "../../stores/appStore";
 import type { Tag } from "../../types";
 import { Plus } from "lucide-react";
 import { Button, Input } from "@heroui/react";
 
 interface Props {
   onToggle: (tagId: string) => void;
 }
 
 function generateId(): string {
   return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
 }
 
 export default function TagPicker({ onToggle }: Props) {
   const { tags, saveTag } = useAppStore();
   const [showAdd, setShowAdd] = useState(false);
   const [newName, setNewName] = useState("");
 
   const handleAdd = async () => {
     const name = newName.trim();
     if (!name) return;
     const tag: Tag = { id: generateId(), name, color: undefined };
     await saveTag(tag);
     setNewName("");
     setShowAdd(false);
   };
 
   return (
     <div className="px-3 py-1.5 border-b border-divider bg-content1">
       <div className="flex flex-wrap gap-0.5 items-center">
         {tags.map((tag) => (
           <TagChip
             key={tag.id}
             tag={tag}
             onClick={() => onToggle(tag.id)}
             size="sm"
           />
         ))}
         <Button
           isIconOnly
           size="sm"
           variant="outline"
           className="w-5 h-5 min-w-0 rounded-lg border-dashed text-foreground-400"
           onClick={() => setShowAdd(!showAdd)}
           title="New tag"
         >
           <Plus size={12} />
         </Button>
       </div>
       {showAdd && (
         <div className="mt-1">
           <Input
             size="sm"
             variant="flat"
             autoFocus
             value={newName}
             onChange={(e) => setNewName(e.target.value)}
             onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
             placeholder="Tag name..."
             className="w-full"
           />
         </div>
       )}
     </div>
   );
 }
