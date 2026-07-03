import { useTranslation } from "react-i18next";
import type { Note } from "../../types";
// export functions;
import { Button } from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

interface Props {
  note: Note;
}

export default function ExportMenu({ note }: Props) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <Button size="sm" variant="ghost" onPress={() => setOpen(!open)}>
        <Download size={14} />
      </Button>
      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 min-w-[140px] rounded-lg border border-default-200 bg-background shadow-lg py-1">
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-default-100 text-foreground"
            onClick={async () => { await console.log("Export markdown:", note.id); setOpen(false); }}
          >
            {t("notes.exportMarkdown", "Export .md")}
          </button>
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-default-100 text-foreground"
            onClick={async () => { await console.log("Export html:", note.id); setOpen(false); }}
          >
            {t("notes.exportHtml", "Export .html")}
          </button>
        </div>
      )}
    </div>
  );
}

