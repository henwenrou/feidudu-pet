# 肥嘟嘟 · 草帽火尾袋鼠

[English](README.en.md) · [使用指南](docs/guide.zh.md) · [资产说明](ASSETS.md) · [网页预览说明](docs/preview.zh.md) · [交互展示](docs/index.html)

戴草帽、抱电脑、尾巴燃烧的袋鼠宠物。项目包含 **9 组原生动作、16 个视线方向**，以及 **庆祝和睡眠 2 组扩展展示**。庆祝仍为草稿；扩展动作仅用于网页演示，没有接入原生任务事件。

受到[哆啦A兔](https://github.com/mylea1/star-rabbit-pet)的启发。

## 全部动作预览

点击动作名称下载 GIF，点击分镜链接查看全部播放帧。

### 空闲 · 原生

![空闲](assets/idle.gif)

[GIF](assets/idle.gif) · [分镜 PNG](assets/storyboards/idle.png)

### 工作 · 原生

![工作](assets/work.gif)

[GIF](assets/work.gif) · [分镜 PNG](assets/storyboards/work.png)

### 等待回答 · 原生

![等待回答](assets/waiting.gif)

[GIF](assets/waiting.gif) · [分镜 PNG](assets/storyboards/waiting.png)

### 向左移动 · 原生

![向左移动](assets/walk-left.gif)

[GIF](assets/walk-left.gif) · [分镜 PNG](assets/storyboards/walk-left.png)

### 向右移动 · 原生

![向右移动](assets/walk-right.gif)

[GIF](assets/walk-right.gif) · [分镜 PNG](assets/storyboards/walk-right.png)

### 挥手 · 原生

![挥手](assets/waving.gif)

[GIF](assets/waving.gif) · [分镜 PNG](assets/storyboards/waving.png)

### 跳跃 · 原生

![跳跃](assets/jumping.gif)

[GIF](assets/jumping.gif) · [分镜 PNG](assets/storyboards/jumping.png)

### 遇到问题 · 原生

![遇到问题](assets/failed.gif)

[GIF](assets/failed.gif) · [分镜 PNG](assets/storyboards/failed.png)

### 检查工作 · 原生

![检查工作](assets/review.gif)

[GIF](assets/review.gif) · [分镜 PNG](assets/storyboards/review.png)

### 完成庆祝 · 扩展 · 草稿

![完成庆祝](assets/celebrate-draft.gif)

[GIF](assets/celebrate-draft.gif) · [分镜 PNG](assets/storyboards/celebrate-draft.png)

### 躺下睡觉 · 扩展

![躺下睡觉](assets/sleep-preview.gif)

[GIF](assets/sleep-preview.gif) · [分镜 PNG](assets/storyboards/sleep-preview.png)

## 网页预览

详细使用方法见[网页预览说明](docs/preview.zh.md)。

## 视频与交互

[下载 11 组动作汇总 MP4](assets/media/all-11-actions.mp4)（无声，每组约 3.8 秒；动作顺序同上）。打开 [交互展示页](docs/index.html) 可以体验动作、眼神跟随与分镜。

## 安装与导入

- [下载原生安装包](codex/feidudu-strawhat-mac.zip)，解压其中的 `feidudu-strawhat-mac` 文件夹到 `~/.codex/pets/`。或者在项目根目录运行 `python3 scripts/install_pet.py`。打开 Codex 设置中的 Pets，刷新并选择“草帽火尾肥嘟嘟”。
- 使用 Pets 技能导入时提供 [spritesheet.png](codex/feidudu-strawhat-mac/spritesheet.png)；该图为透明 PNG，1536 × 2288，含 9 个原生动作及 16 个视线方向。GIF 和 MP4 是预览素材。
- 桌面客户端负责原生状态及视线的显示时机。网页是模拟展示，不读取实际任务。


## 目录

- `assets/`：GIF、WebP、视线图、逐帧分镜和汇总 MP4。
- `docs/`：网页预览、使用指南和安装包下载入口。
- `codex/`：Pets 图集、配置和安装 ZIP。
- `scripts/`：本地安装与完整性校验。
- `tests/`：网页动作状态测试。
- `release-manifest.json`：文件 SHA-256。

校验：`python3 scripts/install_pet.py --check`；网页状态测试：`node tests/preview.test.cjs`。
