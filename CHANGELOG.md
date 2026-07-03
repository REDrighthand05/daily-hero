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
## [1.1.1] - 2026-07-04

### Fixed

- **Acrylic 毛玻璃彻底修复** — 删除 Rust 后端 set_background_color() 调用，该调用在 WebView 软件层写入实色覆盖，完全遮蔽了 OS 层 DWM Acrylic 效果。现在由 	auri.conf.json 的 windowEffects: ["acrylic"] 直接控制，CSS --window-alpha 变量控制透明度

### Added

- **CSS 安全色层** — #root::before 伪元素叠加 gba(0,0,0,0.25) 安全层，确保任何桌面壁纸上文字对比度 ≥ 4.5:1
- **Surface elevation 层级** — 新增 .surface-elevated 和 .surface-dialog 类，编辑器/弹窗使用更高不透明度保障可读性

### Changed

- window.rs: 无用的 	heme 参数已标记为 _theme，消除 Rust 编译 warning
- global.css: 增加 Acrylic 双层背景策略的注释说明