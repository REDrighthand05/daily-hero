import { useAppStore } from "../../stores/appStore";
import type { AppSettings } from "../../types";
import { Button } from "@heroui/react";
import { Palette, AlignLeft, AlignRight } from "lucide-react";
import ThemePicker from "../theme/ThemePicker";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguagePicker from "./LanguagePicker";
import { exportBackup, importBackup, factoryReset, getSystemInfo, createIssueReport } from "../../bridge/ipc";
import type { SystemInfo } from "../../types";
import CollapsibleSection from "../layout/CollapsibleSection";

export default function SettingsPage() {
  const { t } = useTranslation();
  const [sysInfo, setSysInfo] = useState<SystemInfo | null>(null);
  const { settings, updateSettings, loadAll } = useAppStore();

  useEffect(() => { getSystemInfo().then(setSysInfo).catch(() => {}); }, []);

  const handleExport = async () => {
    const { save } = await import("@tauri-apps/plugin-dialog");
    const p = await save({ filters: [{ name: "Backup", extensions: ["zip"] }], defaultPath: "daily-backup.zip" });
    if (p) await exportBackup(p);
  };
  const handleImport = async () => {
    const { open } = await import("@tauri-apps/plugin-dialog");
    const p = await open({ filters: [{ name: "Backup", extensions: ["zip"] }] });
    if (p) { await importBackup(p); await loadAll(); }
  };
  const handleReportIssue = async () => {
    const d = prompt("Describe the issue:");
    if (d && sysInfo) {
      const p = await createIssueReport(sysInfo, d);
      alert("Report saved to:\n" + p);
    }
  };
  const handleReset = async () => {
    if (confirm("Delete all data?")) { await factoryReset(); await loadAll(); }
  };

  const positions: { value: AppSettings["panel_position"]; icon: React.ReactNode; label: string }[] = [
    { value: "left" as AppSettings["panel_position"], icon: <AlignLeft size={18} />, label: t("settings.left") },
    { value: "right" as AppSettings["panel_position"], icon: <AlignRight size={18} />, label: t("settings.right") },
    { value: "float" as AppSettings["panel_position"], icon: <Palette size={18} />, label: t("settings.float") },
  ];

  return (
    <div className="p-4 max-w-[600px] mx-auto overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <CollapsibleSection title={t("settings.appearance")}>
        <div className="mt-2">
          <span className="text-sm font-medium">{t("settings.accentColor")}</span>
          <ThemePicker accentColor={settings.accent_color} onChange={(color) => updateSettings({ accent_color: color })} />
        </div>
        <label className="flex items-center gap-2 cursor-pointer mt-2">
          <input type="checkbox" checked={settings.animations_enabled} onChange={(e) => updateSettings({ animations_enabled: e.target.checked })} className="accent-primary w-4 h-4" />
          <span className="text-sm">{t("settings.animations")}</span>
        </label>
        <div className="mt-2">
          <span className="text-sm font-medium">{t("settings.language")}</span>
          <LanguagePicker />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title={t("settings.panel")}>
        <div className="mt-2">
          <span className="text-sm font-medium">{t("settings.position")}</span>
          <div className="flex gap-1 mt-1">
            {positions.map((p) => (
            <Button key={p.value} variant={settings.panel_position === p.value ? "flat" : "ghost"} size="sm" onPress={() => updateSettings({ panel_position: p.value as AppSettings["panel_position"] })} startContent={p.icon}>
                {p.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="mt-3">
          <span className="text-sm font-medium">{t("settings.opacity")}</span>
          <div className="flex items-center gap-2 mt-1">
            <input type="range" min={30} max={100} value={Math.round(settings.opacity * 100)} onChange={(e) => updateSettings({ opacity: parseInt(e.target.value) / 100 })} className="flex-1 accent-primary" />
            <span className="text-sm text-default-500 w-9 text-right">{Math.round(settings.opacity * 100)}%</span>
          </div>
        </div>
      </CollapsibleSection>

      <div className="mt-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={settings.autostart} onChange={(e) => updateSettings({ autostart: e.target.checked })} className="accent-primary w-4 h-4" />
          <span className="text-sm">{t("settings.startWithWindows")}</span>
        </label>
      </div>

      <div className="mt-3">
        <span className="text-sm font-medium">{t("settings.shortcut")}</span>
        <div className="mt-1">
          <input type="text" value={settings.shortcut_toggle} readOnly className="flex h-9 w-[200px] rounded-md border border-default-200 bg-transparent px-3 py-1 text-sm outline-none" />
        </div>
      </div>

      <div className="mt-3">
        <span className="text-sm font-medium">Diagnostics</span>
        <div className="flex flex-col gap-1 mt-1">
          <span className="text-xs text-default-400">OS: {sysInfo?.os} ({sysInfo?.arch})</span>
          <span className="text-xs text-default-400">App: v{sysInfo?.app_version}</span>
          <Button variant="ghost" size="sm" onPress={handleReportIssue} className="w-fit">Report Issue</Button>
        </div>
      </div>

      <div className="mt-3">
        <span className="text-sm font-medium">Data</span>
        <div className="flex gap-1 mt-1 flex-wrap">
          <Button variant="ghost" size="sm" onPress={handleExport}>Export Backup</Button>
          <Button variant="ghost" size="sm" onPress={handleImport}>Import Backup</Button>
          <Button variant="ghost" size="sm" color="danger" onPress={handleReset}>Factory Reset</Button>
        </div>
      </div>
    </div>
  );
}

