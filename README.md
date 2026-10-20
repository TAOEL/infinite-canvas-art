# Infinite Canvas

AI 驱动的无限画布创作工具，支持图片生成、视频创作、提示词管理和素材库。

## 技术栈

- **前端**：React 19 + Vite 7 + TypeScript + Tailwind CSS 4 + Ant Design 6 + Zustand
- **桌面端**：Electron 33 + electron-packager
- **API**：浏览器直连 OpenAI 兼容接口，无需后端

## 快速开始

```bash
cd web
bun install
bun run dev
```

访问 http://localhost:3000

## 桌面端打包

```bash
cd desktop
bun install
powershell -ExecutionPolicy Bypass -File run-pack.ps1
```

产物输出到 `dist-desktop/` 目录。

## 功能

- 无限画布节点编辑（图片、文字、图形）
- AI 图片 / 视频 / 音频生成
- 提示词库管理
- 素材资产管理
- 深色模式
- 左侧边栏三态布局（展开 / 收起 / hover 下拉菜单）
