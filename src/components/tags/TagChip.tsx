 import type { Tag } from "../../types";
 import { Chip } from "@heroui/react";
 import { X } from "lucide-react";
 
 interface Props {
   tag: Tag;
   onRemove?: () => void;
   onClick?: () => void;
   size?: "sm" | "md";
 }
 
 export default function TagChip({ tag, onRemove, onClick, size = "md" }: Props) {
   const color = tag.color || "#888";
   return (
     <Chip
       size={size}
       variant="bordered"
       style={{ borderColor: color, color }}
       className="cursor-pointer"
       onClick={onClick}
       endContent={onRemove ? (
         <X
           size={10}
           className="cursor-pointer opacity-60 hover:opacity-100"
           onClick={(e: React.MouseEvent) => { e.stopPropagation(); onRemove(); }}
         />
       ) : undefined}
     >
       <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
       {tag.name}
     </Chip>
   );
 }

