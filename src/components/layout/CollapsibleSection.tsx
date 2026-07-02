 import { type ReactNode } from "react";
 import { Disclosure, DisclosureGroup } from "@heroui/react";
 import { ChevronDown } from "lucide-react";
 
 interface Props {
   title: string;
   defaultOpen?: boolean;
   children: ReactNode;
 }
 
 export default function CollapsibleSection({ title, defaultOpen = true, children }: Props) {
   return (
     <div className="border-b border-divider">
       <DisclosureGroup allowsMultipleExpanded defaultExpandedKeys={defaultOpen ? ["section"] : []}>
         <Disclosure id="section">
           <Disclosure.Trigger className="flex w-full items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-foreground hover:bg-default-100 data-pressed:bg-default-100 cursor-pointer">
             {title}
           </Disclosure.Trigger>
           <Disclosure.Content>
             <Disclosure.Body className="px-3 pb-2 text-sm">
               {children}
             </Disclosure.Body>
           </Disclosure.Content>
         </Disclosure>
       </DisclosureGroup>
     </div>
   );
 }
