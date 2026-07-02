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
         <Tooltip.Root>
           <Tooltip.Trigger>
             <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("**", "**")}>
               <Bold size={14} />
             </Button>
           </Tooltip.Trigger>
           <Tooltip.Content>Bold</Tooltip.Content>
         </Tooltip.Root>
         <Tooltip.Root>
           <Tooltip.Trigger>
             <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("*", "*")}>
               <Italic size={14} />
             </Button>
           </Tooltip.Trigger>
           <Tooltip.Content>Italic</Tooltip.Content>
         </Tooltip.Root>
         <Tooltip.Root>
           <Tooltip.Trigger>
             <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("## ", "")}>
               <Heading size={14} />
             </Button>
           </Tooltip.Trigger>
           <Tooltip.Content>Heading</Tooltip.Content>
         </Tooltip.Root>
         <Tooltip.Root>
           <Tooltip.Trigger>
             <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("- ", "")}>
               <List size={14} />
             </Button>
           </Tooltip.Trigger>
           <Tooltip.Content>List</Tooltip.Content>
         </Tooltip.Root>
         <Tooltip.Root>
           <Tooltip.Trigger>
             <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" onPress={() => onInsert("```\n", "\n```")}>
               <Code size={14} />
             </Button>
           </Tooltip.Trigger>
           <Tooltip.Content>Code block</Tooltip.Content>
         </Tooltip.Root>
       </div>
       <div className="flex gap-0.5">
         <Button
           isIconOnly
           size="sm"
           variant={mode === "edit" ? "solid" : "light"}
           color={mode === "edit" ? "primary" : "default"}
           className="w-7 h-7 min-w-0"
           onPress={() => onModeChange("edit")}
           title="Edit"
         >
           <Edit3 size={14} />
         </Button>
         <Button
           isIconOnly
           size="sm"
           variant={mode === "preview" ? "solid" : "light"}
           color={mode === "preview" ? "primary" : "default"}
           className="w-7 h-7 min-w-0"
           onPress={() => onModeChange("preview")}
           title="Preview"
         >
           <Eye size={14} />
         </Button>
       </div>
     </div>
   );
 }
