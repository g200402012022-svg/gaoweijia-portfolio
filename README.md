# 郜维佳 GAO WEIJIA · 导演 / AI 影像作品集

纯静态个人作品集网站（无构建、无依赖），部署在 **GitHub Pages**，正片用站内自研影院播放器直接播放。

- 线上地址：<https://g200402012022-svg.github.io/gaoweijia-portfolio/>
- 仓库：<https://github.com/g200402012022-svg/gaoweijia-portfolio>
- 本地预览：直接双击 `index.html`，或在本目录执行 `python -m http.server 8080` 后访问 <http://127.0.0.1:8080>

---

## 一、目录结构

```
index.html                 页面骨架（开屏 / 导航 / 播放器 / 灯箱 / Toast）
css/style.css              全站样式（含影院播放器、无片源占位态）
js/data.js                 全站唯一数据源：文案、作品、联系方式、播放源
js/app.js                  交互引擎：路由、转场、影院播放器、灯箱
assets/images/             剧照与海报（约 6 MB）
media/                     线上播放的网页转码版成片（10 支，约 140 MB，进仓库）
assets/videos/             原始母版（1.16 GB，不进仓库，本地留档）
.nojekyll                  GitHub Pages 关闭 Jekyll 处理
```

## 二、视频是怎么处理的

原始母版 11 个文件共 **1.16 GB**，其中 8 个超过 GitHub 的 **100 MB 单文件硬上限**，
不能直接进仓库。因此做了两件事：

1. **转码**：`assets/videos/*.mp4` → `media/*.mp4`
   - H.264 **High profile / level 4.1** + AAC 128 kbps + `+faststart`（边下边播）
   - **分辨率与帧率与原片一致**，只降码率（原片 8–16 Mbps → 网页版约 0.9–2.2 Mbps）
   - 转码参数：`-crf 27 -preset medium -x264-params aq-mode=3:deblock=-1,-1 -pix_fmt yuv420p`
   - 与原始母版的 SSIM（Y）约 **0.986**，接近视觉无损；单文件均 < 100 MB
2. **原始母版留在本地** `assets/videos/`，被 `.gitignore` 排除，**不影响线上、也不会丢**

`js/data.js` 里每部作品的 `video` 指向 `media/xxx.mp4`，播放走原生 `<video>` +
自研控制栏（播放/暂停、±10 秒、进度条拖拽与时间气泡、倍速、音量、画中画、全屏、选集）。

### 想换更好的画质？

改 `.diag/encode.py`（或直接用下面命令）把 `CRF` 调小（数值越小画质越高、文件越大），
重跑后 `git add media && git commit && git push` 即可：

```bash
ffmpeg -i assets/videos/源文件.mp4 -map_metadata -1 \
  -c:v libx264 -preset medium -crf 23 \
  -x264-params "aq-mode=3:deblock=-1,-1" \
  -profile:v high -level 4.1 -pix_fmt yuv420p \
  -c:a aac -b:a 128k -ac 2 -ar 48000 -movflags +faststart \
  media/目标文件名.mp4
```

> 注意 GitHub Pages 单站上限 **1 GB**、月流量软上限 **100 GB**。按当前 140 MB 全站，
> 约可支撑 700 次完整观看；访客只点开一两支时消耗远低于此。

## 三、部署（GitHub Pages）

仓库 **Settings → Pages**：

- Source：`Deploy from a branch`
- Branch：`main` / 目录 `/ (root)`
- 保存后约 30 秒生效

不需要 workflow，`.nojekyll` 保证 `_` 开头的文件也能正常发布。

## 四、国内访问与后续优化

`*.github.io` 在中国大陆可以访问，但速度受国际出口影响，部分运营商/地区会间歇性失败。
如果主要给国内客户、制片人看，建议：

1. **自定义域名 + Cloudflare**（免费）：国内解析与速度明显更稳；
2. **国内对象存储 + CDN**（阿里云 OSS / 腾讯云 COS）：真正稳定，按流量付费；
3. 用中国大陆服务器绑域名需 **ICP 备案**，备案号填进 `js/data.js` 的 `site.icp` 即可显示在页脚。

## 五、已知上限

- GitHub Pages：单站 ≤ 1 GB、月流量软上限 100 GB、每小时 10 次构建；
- 单个 Git 文件：≤ 100 MB（硬限制，超过直接拒绝）；
- 剧照继续进仓库没问题（当前约 6 MB），但不要再往仓库塞原始母版视频。

## 六、联系信息

手机 `15035534262` ｜ 邮箱 `1815320768@qq.com` ｜ 微信二维码 `assets/images/wechat-qr.jpg`

© 2026 郜维佳 GAO WEIJIA
