 import { useEffect, useRef, useState } from "react";
 import { renderMarkdown } from "../../bridge/ipc";
 
 interface Props {
   content: string;
 }
 
 export default function MarkdownPreview({ content }: Props) {
   const [html, setHtml] = useState("");
   const ref = useRef<HTMLDivElement>(null);
 
   useEffect(() => {
     let cancelled = false;
     renderMarkdown(content).then((h) => {
       if (!cancelled) setHtml(h);
     }).catch(() => {
       if (!cancelled) setHtml("<p><em>Preview unavailable</em></p>");
     });
     return () => { cancelled = true; };
   }, [content]);
 
   useEffect(() => {
     if (html && ref.current) {
       import("highlight.js/lib/core").then((hljs) => {
         ref.current?.querySelectorAll("pre code").forEach((block) => {
           try { hljs.default.highlightElement(block as HTMLElement); } catch {}
         });
       });
     }
   }, [html]);
 
   return (
     <div
       ref={ref}
       className="flex-1 p-2 overflow-y-auto text-xs leading-relaxed text-foreground [&_h1]:text-lg [&_h1]:font-bold [&_h1]:my-3 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:my-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:my-2 [&_p]:my-1.5 [&_ul]:pl-5 [&_ul]:my-1.5 [&_ol]:pl-5 [&_ol]:my-1.5 [&_li]:my-0.5 [&_code]:bg-default-100 [&_code]:px-1 [&_code]:rounded-sm [&_code]:text-xs [&_pre]:bg-content1 [&_pre]:p-2 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-3 [&_pre]:border [&_pre]:border-divider [&_pre_code]:bg-none [&_pre_code]:p-0 [&_blockquote]:border-l-3 [&_blockquote]:border-primary [&_blockquote]:my-3 [&_blockquote]:px-3 [&_blockquote]:py-1 [&_blockquote]:text-foreground-400 [&_table]:border-collapse [&_table]:my-3 [&_table]:w-full [&_th]:border [&_th]:border-divider [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:bg-default-100 [&_td]:border [&_td]:border-divider [&_td]:px-2 [&_td]:py-1 [&_td]:text-left [&_img]:max-w-full [&_img]:rounded-md [&_a]:text-primary [&_a]:underline"
       dangerouslySetInnerHTML={{ __html: html }}
     />
   );
 }
