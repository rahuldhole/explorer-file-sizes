# Explorer File Sizes

Tiny, fast badges in the VS Code Explorer showing file sizes. Hover to see exact bytes/MB. Optional recursive folder sizes.

---

## Features (deep dive)

### 1) File size badges (Explorer)
- **What you see**
  - **Full** shows a compact 2-character badge next to each file: `B`, `1K…`, `K`, `1M…`, `M`, `1G…`, `T`.
  - **Subtle** shows **no badge** but keeps a **rich tooltip** on hover (clean look, zero visual clutter).
  - **Off** removes all Explorer decorations created by this extension.
- **Why 2 characters?** VS Code limits FileDecoration badges to two glyphs, so sizes are compressed intelligently (e.g., 1–9K shows `1K…9K`, 10–999K shows `K`, etc.).
- **Tooltips** Always show **exact bytes** and **MB** for files (and last modified date when available).
![Demo](https://github.com/bdoole1/explorer-file-sizes/blob/main/images/demo.gif?raw=true)
> **Tip:** Use **Subtle** if you want tooltips without extra UI noise. Switch in **Settings → Explorer File Sizes → Badge Mode**.

---

### 2) Folder sizes (optional, background compute)
- **How it works**
  - When **Enable Folder Sizes** is **ON**, folders are scanned in the background.  
  - While the size is being computed, a **⏳** badge appears (configurable via **Folder Hover Indicator**).
  - Once done, hovering the folder shows a **tooltip** with the **exact total** (and `~` + “approx” if a safety budget stopped the scan early).
- **Budgets (for responsiveness)**
  - To avoid UI jank on huge trees, the walker stops after a **time** or **entry count** budget. You’ll see `~123.45 MB (approx)` in the tooltip.
- **Decorations can clash**  
  VS Code shows **only one decoration** per item. If another provider (Problems/SCM/Explorer filter “Contains emphasized items”) is active on that folder, our badge/tooltip may not be visible at that moment.
- **Guaranteed result on demand**  
  Use the context menu **Explorer File Sizes → Show Folder Size** to run a bigger scan with a progress notification (works even when another badge is shown).

> **Default:** Folders don’t show a persistent size badge; you get ⏳ **only while calculating** (clean look, avoids clashing with Git/Problems). You can disable the indicator entirely via **Folder Hover Indicator = off**.

---

### 3) Status bar size (active editor)
- Shows the **exact size** for the currently active file in the **Status Bar**, even when badges are **Off**.
- Hides automatically for folders/untitled editors.

---

### 4) Exclude globs (minimatch)
- Skip heavy or noisy paths (e.g., `**/node_modules/**`, `**/.git/**`, `**/dist/**`, `**/build/**`) during folder scans.
- Uses `minimatch` with:
  - `dot: true` (matches dot-folders like `.git`)
  - `nocase` on Windows
  - Matches both **absolute** and **workspace-relative** paths
- Examples:
  - Ignore all `node_modules`:  
    `**/node_modules/**`
  - Ignore generated assets:  
    `**/dist/**`, `**/build/**`, `**/.next/**`, `**/target/**`
  - Ignore logs/temp:  
    `**/*.log`, `**/tmp/**`, `**/.cache/**`

> Tune this list per project for faster, more accurate folder sizes.

---

### 5) Caching & refresh
- Results are cached for **~15 seconds** to keep the Explorer snappy.
- The cache invalidates on file create/delete/rename/save, or when you change any of the extension’s settings.

---

### 6) Remote-friendly & safe
- Works in Local, **Remote-SSH**, WSL, and Containers.
- Reads metadata via the VS Code **FileSystem** API—no external binaries, no telemetry.

---

### Installation

**Requirements:** VS Code ≥ 1.90

**From Marketplace (recommended)**
1. Open the **Extensions** view (`Ctrl/Cmd+Shift+X`).
2. Search **Explorer File Sizes**.
3. Click **Install**.  
   > For Remote-SSH/WSL/Containers, use **Install in…** to target the remote.

**From VSIX (manual)**
- Build or download a `.vsix`:
  ```bash
  npm install
  npm run compile
  npx vsce package
  Command palette: Extensions: Install from VSIX...
  Select file

**Install via CLI**
  # VS Code Stable
  code --install-extension ./explorer-file-sizes-<version>.vsix
  # VS Code Insiders
  code-insiders --install-extension ./explorer-file-sizes-<version>.vsix

## Settings

## Settings (compact)

| Setting | Default | Type | Description |
| --- | --- | --- | --- |
| `explorerFileSizes.badgeMode` | `full` | string (`full`/`subtle`/`off`) | Controls file badges. **Full** shows 2-char size; **Subtle** shows tooltip only; **Off** disables Explorer decorations. |
| `explorerFileSizes.enableFolderSizes` | `false` | boolean | Compute folder sizes in the background; shows ⏳ while scanning (if enabled). |
| `explorerFileSizes.folderHoverIndicator` | `calculating` | string (`calculating`/`off`) | Show ⏳ on folders **only while computing**, or disable. |
| `explorerFileSizes.excludeGlobs` | see default | string[] | Globs skipped during folder scans (minimatch). Matches absolute and workspace-relative paths. |


**Quick JSON snippet**
```json
{
  "explorerFileSizes.badgeMode": "subtle",
  "explorerFileSizes.enableFolderSizes": true,
  "explorerFileSizes.folderHoverIndicator": "calculating",
  "explorerFileSizes.excludeGlobs": [
    "**/node_modules/**",
    "**/.git/**",
    "**/dist/**",
    "**/build/**",
    "**/.cache/**"
  ]
}
