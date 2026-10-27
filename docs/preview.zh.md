# 网页预览说明

[English](preview.en.md) · [使用指南](guide.zh.md) · [打开展示页](index.html)

## 本地查看

直接打开 `docs/index.html`；也可在项目根目录运行 `python3 -m http.server 8000`，访问 `http://localhost:8000/`。网页使用根目录 `assets/`，所以需要保留完整目录结构。

## 交互与素材

- 顶部默认演示 16 方向视线跟随，可暂停或用方向按钮选择；这是网页交互，不能证明客户端一定跟随鼠标。
- 互动舞台和动作画廊展示 9 组原生动作、庆祝（草稿）和睡眠两组扩展。
- 展开动作分镜可逐帧查看并下载 PNG、GIF；页面还可播放和下载无声的 11 组动作汇总 MP4。
- 网页只模拟状态，不读取实际任务。庆祝和睡眠没有接入原生任务完成或闲置事件。

## GitHub Pages

上传项目根目录的内容到 GitHub 仓库根目录。在 **Settings → Pages → Deploy from a branch** 中选择默认分支和 **`/ (root)`**，保存并等待 GitHub 给出网址。根目录 `index.html` 会进入 `docs/index.html`。请选择 `/ (root)`，因为素材位于 `assets/`。
