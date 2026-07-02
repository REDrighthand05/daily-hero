import { useAppStore } from "../../stores/appStore";
import type { AppSettings } from "../../types";
import { Palette, AlignLeft, AlignRight } from "lucide-react";
import ThemePicker from "../theme/ThemePicker";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import LanguagePicker from "./LanguagePicker";
import { exportBackup, importBackup, factoryReset, getSystemInfo, createIssueReport } from "../../bridge/ipc";
import type { SystemInfo } from "../../types";
import CollapsibleSection from "../layout/CollapsibleSection";
import { Button, Input, Switch } from "@heroui/react";

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
    { value: "left", icon: <AlignLeft size={18} />, label: t("settings.left") },
    { value: "right", icon: <AlignRight size={18} />, label: t("settings.right") },
    { value: "float", icon: <Palette size={18} />, label: t("settings.float") },
  ];

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <h2 className="text-base font-semibold mb-5">Settings</h2>

      <CollapsibleSection title={t("settings.appearance")}>
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2">{t("settings.accentColor")}</h3>
        <ThemePicker
          accentColor={settings.accent_color}
          onChange={(color) => updateSettings({ accent_color: color })}
        />

        <Switch.Root
          isSelected={settings.animations_enabled}
          onChange={(v) => updateSettings({ animations_enabled: v })}
          className="my-2"
        >
          <Switch.Content>{t("settings.animations")}</Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2">{t("settings.language")}</h3>
        <LanguagePicker />
      </CollapsibleSection>

      <CollapsibleSection title={t("settings.panel")}>
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2">{t("settings.position")}</h3>
        <div className="flex gap-2">
          {positions.map((p) => (
            <Button
              key={p.value}
              size="sm"
              variant={settings.panel_position === p.value ? "solid" : "outline"}
              color={settings.panel_position === p.value ? "primary" : "default"}
              onClick={() => updateSettings({ panel_position: p.value })}
              className="flex-col gap-1.5 py-2 px-3.5"
            >
              {p.icon}
              <span className="text-[11px]">{p.label}</span>
            </Button>
          ))}
        </div>
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2 mt-3">{t("settings.opacity")}</h3>
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="30"
            max="100"
            value={Math.round(settings.opacity * 100)}
            onChange={(e) =>
              updateSettings({ opacity: parseInt(e.target.value) / 100 })
            }
            className="flex-1 accent-primary h-1"
          />
          <span className="text-xs text-foreground-400 min-w-[36px]">{Math.round(settings.opacity * 100)}%</span>
        </div>
      </CollapsibleSection>

      <section className="mb-5">
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2">{t("settings.autostart")}</h3>
        <Switch.Root
          isSelected={settings.autostart}
          onChange={(v) => updateSettings({ autostart: v })}
        >
          <Switch.Content>{t("settings.startWithWindows")}</Switch.Content>
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
        </Switch.Root>
      </section>

      <section className="mb-5">
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2">{t("settings.shortcut")}</h3>
        <Input
          size="sm"
          value={settings.shortcut_toggle}
          readOnly
          placeholder="Alt+Space"
          className="w-[160px]"
        />
      </section>
      <section className="mb-5">
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2">Diagnostics</h3>
        <div className="text-xs text-foreground-400 space-y-1">
          <p>OS: {sysInfo?.os} ({sysInfo?.arch})</p>
          <p>App: v{sysInfo?.app_version}</p>
          <Button size="sm" variant="outline" className="mt-2 h-7 min-w-0 text-xs px-3" onPress={handleReportIssue}>Report Issue</Button>
        </div>
      </section>

      <section className="mb-5">
        <h3 className="text-[11px] font-medium text-foreground-500 uppercase tracking-wider mb-2">Data</h3>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" className="h-7 min-w-0 text-xs px-3" onPress={handleExport}>Export Backup</Button>
          <Button size="sm" variant="outline" className="h-7 min-w-0 text-xs px-3" onPress={handleImport}>Import Backup</Button>
          <Button size="sm" variant="outline" color="danger" className="h-7 min-w-0 text-xs px-3" onPress={handleReset}>Factory Reset</Button>
        </div>
      </section>
    </div>
  );
}