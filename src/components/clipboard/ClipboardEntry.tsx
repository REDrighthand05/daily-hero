import type { ClipboardEntry as CEntry } from "../../types";
import { Star, Trash2, Clipboard } from "lucide-react";
import { writeClipboard } from "../../bridge/ipc";
import { Button } from "@heroui/react";

interface Props {
  entry: CEntry;
  onDelete: (id: string) => void;
  onStar: (id: string, starred: boolean) => void;
  onClick: (entry: CEntry) => void;
}

export default function ClipboardEntryComponent({ entry, onDelete, onStar, onClick }: Props) {
  const preview = entry.content.slice(0, 80);

  const handleCopy = async () => {
    try { await writeClipboard(entry.content); } catch (e) { console.error("Clipboard copy failed:", e); }
  };

  const time = new Date(entry.created_at).toLocaleTimeString();

  return (
    <div className="group px-3 py-2 border-b border-divider cursor-pointer hover:bg-default-100 transition-colors duration-100" onClick={() => onClick(entry)}>
      <div className="flex justify-between items-start gap-3">
        <span className="text-xs leading-relaxed text-foreground break-all flex-1">
          {preview}{entry.content.length > 80 ? "..." : ""}
        </span>
        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity duration-100">
          <Button isIconOnly size="sm" variant="ghost" className="w-6 h-6 min-w-0 text-foreground-400" onPress={() => handleCopy()} title="Copy">
            <Clipboard size={12} />
          </Button>
          <Button isIconOnly size="sm" variant="ghost" className={`w-6 h-6 min-w-0 ${entry.starred ? "text-warning" : "text-foreground-400"}`} onPress={() => onStar(entry.id, !entry.starred)} title={entry.starred ? "Unstar" : "Star"}>
            <Star size={12} />
          </Button>
          <Button isIconOnly size="sm" variant="ghost" className="w-6 h-6 min-w-0 text-foreground-400" onPress={() => onDelete(entry.id)} title="Delete">
            <Trash2 size={12} />
          </Button>
        </div>
      </div>
      <div className="text-[10px] text-foreground-400 mt-0.5">{time}</div>
    </div>
  );
}
