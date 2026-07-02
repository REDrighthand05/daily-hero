 import type { Note } from "../../types";
 import type { ExportFormat } from "../../types";
 import { writeFile } from "../../bridge/ipc";
 import { Download } from "lucide-react";
 import { save } from "@tauri-apps/plugin-dialog";
 import { Button, Dropdown } from "@heroui/react";
 
 interface Props {
   note: Note;
 }
 
 export default function ExportMenu({ note }: Props) {
   const handleExport = async (format: ExportFormat) => {
     const ext = format === "markdown" ? "md" : "txt";
     const defaultName = note.content.slice(0, 30).replace(/\s+/g, "_") || "note";
     try {
       const path = await save({
         filters: [{ name: format === "markdown" ? "Markdown" : "Text", extensions: [ext] }],
         defaultPath: `${defaultName}.${ext}`,
       });
       if (path) {
         await writeFile(path, note.content);
       }
     } catch (e) {
       console.error("Export failed", e);
     }
   };
 
   return (
     <Dropdown.Root>
       <Dropdown.Trigger>
         <Button isIconOnly size="sm" variant="light" className="w-7 h-7 min-w-0 text-foreground-400" title="Export note">
           <Download size={14} />
         </Button>
       </Dropdown.Trigger>
       <Dropdown.Popover>
         <Dropdown.Menu onAction={(key) => handleExport(key as ExportFormat)}>
           <Dropdown.Item id="markdown">Export as Markdown</Dropdown.Item>
           <Dropdown.Item id="text">Export as Text</Dropdown.Item>
         </Dropdown.Menu>
       </Dropdown.Popover>
     </Dropdown.Root>
   );
 }
