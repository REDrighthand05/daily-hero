 import type { EditorMode } from "../../types";
 import { Bold, Italic, Heading, Code, List, Eye, Edit3 } from "lucide-react";
 import { Button, Tooltip } from "@heroui/react";
 
 interface Props {
   mode: EditorMode;
   onModeChange: (mode: EditorMode) => void;
   onInsert: (before: string, after: string) => void;
 }
 
 export default function EditorToolbar({ mode, onModeChange, onInsert }: Props) {
   return (
     <div className="flex items-center justify-between px-3 py-[3px] border-b border-divider bg-content1">
       <div className="flex gap-0.5">
         <Tooltip content="Bold">
           <Button isIconOnly size="sm" variant="ghost" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("**", "**")}>
             <Bold size={14} />
           </Button>
         </Tooltip>
         <Tooltip content="Italic">
           <Button isIconOnly size="sm" variant="ghost" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("*", "*")}>
             <Italic size={14} />
           </Button>
         </Tooltip>
         <Tooltip content="Heading">
           <Button isIconOnly size="sm" variant="ghost" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("## ", "")}>
             <Heading size={14} />
           </Button>
         </Tooltip>
         <Tooltip content="List">
           <Button isIconOnly size="sm" variant="ghost" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("- ", "")}>
             <List size={14} />
           </Button>
         </Tooltip>
         <Tooltip content="Code block">
           <Button isIconOnly size="sm" variant="ghost" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("```\n", "\n```")}>
             <Code size={14} />
           </Button>
         </Tooltip>
       </div>
       <div className="flex gap-0.5">
         <Button
           isIconOnly
           size="sm"
           variant={mode === "edit" ? "solid" : "ghost"}

           className="w-7 h-7 min-w-0"
           onPress={() => onModeChange("edit")}

         >
           <Edit3 size={14} />
         </Button>
         <Button
           isIconOnly
           size="sm"
           variant={mode === "preview" ? "solid" : "ghost"}

           className="w-7 h-7 min-w-0"
           onPress={() => onModeChange("preview")}

         >
           <Eye size={14} />
         </Button>
       </div>
     </div>
   );
 }



