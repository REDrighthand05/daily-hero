 import { useTranslation } from "react-i18next";
 import { useAppStore } from "../../stores/appStore";
 import { Button } from "@heroui/react";
 
 const LANGUAGES = [
   { code: "en-US", label: "English" },
   { code: "zh-CN", label: "中文" },
 ];
 
 export default function LanguagePicker() {
   const { i18n } = useTranslation();
   const { settings, updateSettings } = useAppStore();
 
   const handleChange = async (code: string) => {
     await i18n.changeLanguage(code);
     updateSettings({ language: code });
   };
 
   return (
     <div className="flex gap-2">
       {LANGUAGES.map((lang) => (
         <Button
           key={lang.code}
           size="sm"
           variant={settings.language === lang.code ? "solid" : "outline"}
           color={settings.language === lang.code ? "primary" : "default"}
           onClick={() => handleChange(lang.code)}
         >
           {lang.label}
         </Button>
       ))}
     </div>
   );
 }
