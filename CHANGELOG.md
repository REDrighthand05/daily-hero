# Changelog

All notable changes to Daily will be documented in this file.

## [1.1.0] - 2026-07-03

### Changed

- **Full UI migration to HeroUI v2** — all 23 component files rewritten
- All components migrated from custom CSS to @heroui/react components
- Shell.tsx: HeroUI Button + Tailwind layout
- TitleBar.tsx: HeroUI Button for tab navigation
- NoteEditor.tsx: HeroUI Textarea + Chip tags
- SearchOverlay.tsx: HeroUI Modal + Input
- SettingsPage.tsx: HeroUI Switch, Button, Slider
- Deleted components.css (HeroUI + Tailwind cover all styling)
- Global.css: Tailwind v4 @import + minimal scrollbar
- main.tsx: HeroUIProvider wrapper

### Added

- @heroui/react, tailwindcss, @tailwindcss/vite, framer-motion

### Changed

- All component CSS classes replaced with Tailwind utility classes
- Theme management via HeroUIProvider built-in dark mode

## [1.0.0] - 2026-07-03

### Added

- Fork from daily-app with HeroUI component library integration
- Initial Vite + React + TypeScript + Tauri v2 project structure
