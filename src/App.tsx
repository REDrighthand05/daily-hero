import Shell from "./components/layout/Shell";
import { useAppStore } from "./stores/appStore";
import { useUIStore } from "./stores/useUIStore";
import { useEffect } from "react";
import * as ipc from "./bridge/ipc";
import "./styles/global.css";

export default function App() {
  const { settings, loadAll } = useAppStore();
  const { loaded } = useUIStore();

  useEffect(() => {
    if (!loaded) {
      loadAll();
      return;
    }
    if (loaded) {
      document.documentElement.style.setProperty('--window-alpha', String(settings.opacity));
      ipc.setWindowOpacity(settings.opacity, settings.theme ?? "system").catch(() => {});
    }
  }, [settings.opacity, loaded]);

  if (!loaded)
    return (
      <div className="flex items-center justify-center h-screen w-full bg-background">
        <div className="w-7 h-7 border-3 border-divider border-t-primary rounded-full animate-spin" />
      </div>
    );
  return <Shell />;
}