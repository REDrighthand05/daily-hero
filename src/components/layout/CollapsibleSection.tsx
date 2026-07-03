import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Props {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function CollapsibleSection({ title, defaultOpen = false, children }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-default-200">
      <button
        className="flex items-center justify-between w-full px-2 py-1.5 text-xs font-semibold text-foreground uppercase tracking-wide hover:bg-default-100"
        onClick={() => setOpen(!open)}
      >
        {title}
        <ChevronDown size={14} className={'text-default-400 transition-transform' + (open ? ' rotate-180' : '')} />
      </button>
      {open && <div className="px-2 pb-2">{children}</div>}
    </div>
  );
}
