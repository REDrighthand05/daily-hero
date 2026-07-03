 // Button not needed;
 import { Palette } from "lucide-react";
 
 interface Props {
   accentColor: string;
   onChange: (color: string) => void;
 }
 
 const PRESETS = ["#4F8CFF", "#10B981", "#8B5CF6", "#F59E0B", "#EF4444", "#14B8A6"];
 
 function adjustColor(hex: string, amount: number): string {
   const num = parseInt(hex.slice(1), 16);
   const r = Math.min(255, Math.max(0, ((num >> 16) & 0xFF) + amount));
   const g = Math.min(255, Math.max(0, ((num >> 8) & 0xFF) + amount));
   const b = Math.min(255, Math.max(0, (num & 0xFF) + amount));
   return "#" + ((r << 16) | (g << 8) | b).toString(16).padStart(6, "0");
 }
 
 export default function ThemePicker({ accentColor, onChange }: Props) {
   const handleChange = (color: string) => {
     document.documentElement.style.setProperty("--accent", color);
     document.documentElement.style.setProperty("--accent-hover", adjustColor(color, -20));
     onChange(color);
   };
 
   return (
     <div className="flex items-center gap-4 my-1">
       <div className="flex items-center gap-1.5">
         {PRESETS.map((color) => (
           <button
             key={color}
             className={`w-6 h-6 rounded-full border-2 transition-transform duration-150 ${accentColor === color ? "border-white scale-110" : "border-transparent"} hover:scale-110`}
             style={{ backgroundColor: color }}
             onClick={() => handleChange(color)}
             title={color}
           />
         ))}
       </div>
       <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground text-xs">
         <Palette size={14} />
         <input
           type="color"
           value={accentColor}
           onChange={(e) => handleChange(e.target.value)}
           className="w-6 h-6 border-none bg-transparent cursor-pointer p-0"
         />
       </label>
     </div>
   );
 }


