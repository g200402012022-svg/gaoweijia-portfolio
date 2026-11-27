# 郜维佳 GAO WEIJIA · 导演 / AI 影像作品集

纯静态个人作品集网站（无构建、无依赖），部署在 **GitHub Pages**。

- 线上地址：<https://g200402012022-svg.github.io/gaoweijia-portfolio/>
- 仓库：<https://github.com/g200402012022-svg/gaoweijia-portfolio>
- 本地预览：直接双击 `index.html`，或在本目录执行 `python -m http.server 8080` 后访问 <http://127.0.0.1:8080>

---

## 一、目录结构

```
index.html                 页面骨架（开屏 / 导航 / 播放器 / 灯箱 / Toast）
css/style.css              全站样式（含 B 站嵌入播放器与占位态）
js/data.js                 全站唯一数据源：文案、作品、联系方式、播放源
js/app.js                  交互引擎：路由、转场、影院播放器、灯箱
assets/images/             剧照与海报（约 6 MB，进仓库）
assets/videos/             原始成片（约 1.16 GB，不进仓库，见下）
.nojekyll                  GitHub Pages 关闭 Jekyll 处理
```

## 二、视频为什么不在仓库里

11 支成片合计约 **1.16 GB**，其中 8 个单文件 **88–175 MB**，超过 GitHub 的
**100 MB 单文件硬上限**，push 会被直接拒绝；GitHub Pages 也明确不允许用作视频流媒体。

因此线上播放采用 **B 站官方 iframe 播放器嵌入**：

1. 把成片上传到 B 站（公开投稿，建议 1080P，标题与海报用作品名）；
2. 记下每支视频的 **BV 号**（形如 `BV1GJ411x7h7`）；
3. 打开 `js/data.js`，把它们填进 `site.media.bilibili`：

```js
media: {
  mode: 'auto',
  bilibili: {
    'mias-wild-wonderland':    'BV1xxxxxxxxx',   // EP01
    'mias-wild-wonderland#2':  'BV1xxxxxxxxx',   // EP02
    'the-king-of-sorrow':      'BV1xxxxxxxxx',
    'ceo-sweet-punishment-ep53':'BV1xxxxxxxxx',
    'xianmen':                 'BV1xxxxxxxxx',
    'xian':                    'BV1xxxxxxxxx',
    'yemiao':                  'BV1xxxxxxxxx',
    'sanjie':                  'BV1xxxxxxxxx',
    'chunri-laixin':           'BV1xxxxxxxxx',
    'rexue-qingchun':          'BV1xxxxxxxxx'
  }
}
```

键名规则：**单集用作品 slug**；**多集用 `slug#2` 表示第 2 集**。需要指定分 P 时写成
`{ bvid: 'BV1xx411c7mD', page: 2 }`。

填完后提交推送即生效，**不用改任何代码**：

```bash
git add js/data.js && git commit -m "填写 B 站播放源" && git push
```

> `mode` 说明：`auto`（默认，本地看原片、线上看 B 站）/ `local`（始终用仓库内视频）/
> `bilibili`（始终用 B 站嵌入）。本地调试时也可以在控制台执行
> `window.PORTFOLIO_MEDIA_MODE = 'bilibili'` 再刷新，预览线上形态。

## 三、部署（GitHub Pages）

仓库 **Settings → Pages**：

- Source：`Deploy from a branch`
- Branch：`main` / 目录 `/ (root)`
- 保存后约 30 秒生效

仓库里不需要 workflow，`.nojekyll` 保证 `_` 开头的文件也能正常发布。

## 四、国内访问与后续优化

`*.github.io` 在中国大陆可以访问，但速度受国际出口影响，部分运营商/地区会间歇性失败。
如果主要给国内客户、制片人看，建议按以下顺序优化：

1. **自定义域名 + Cloudflare**（免费）：Pages 绑定自定义域名后套 Cloudflare CDN，国内解析与速度明显更稳；
2. **国内对象存储 + CDN**（阿里云 OSS / 腾讯云 COS）：真正稳定，访问量大时按流量付费；
3. 若使用中国大陆服务器并绑定域名，需完成 **ICP 备案**，备案号填进 `js/data.js` 的 `site.icp` 即可显示在页脚。

## 五、已知上限

- GitHub Pages：单站 ≤ 1 GB、月流量软上限 100 GB、每小时 10 次构建；
- 单个 Git 文件：≤ 100 MB（硬限制，超过直接拒绝）；
- 图片继续进仓库没问题（当前约 6 MB），但不要再往仓库塞视频。

## 六、联系信息

手机 `15035534262` ｜ 邮箱 `1815320768@qq.com` ｜ 微信二维码 `assets/images/wechat-qr.jpg`

© 2026 郜维佳 GAO WEIJIA
