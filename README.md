# 灰叔SI造物室

灰叔的产品与项目展示页。卡片收录已上线的网站、开源项目和本地工具，提供标题、一句话介绍及预览图；有公开入口的卡片可以直接打开。

在线地址：https://paraldameta.github.io/huishu-si/

## 增删项目

所有项目都写在 [`projects.js`](projects.js) 里，一段 `{ ... }` 就是一张卡片：

```js
{
  title: "回向",                       // 卡片标题
  en: "Orison",                        // 副标题（可省）
  desc: "打开就转的在线转经筒与念珠。",  // 一句话介绍
  url: "https://orison.love/",         // 点击后打开的网站
  shot: "shots/cyber-prayer-wheel.webp", // 预览图，放在 shots/ 下，建议 960×600
  cat: "mystic",                       // 分类：mystic / life / learn / tools
  lock: "需登录",                      // 可省：需登录 / 需密码 等小标签
  status: "交互原型",                  // 可省：交互原型 / 开源 · macOS 等
  recent: true,                        // 本次新收录，出现在「最近新增」筛选
},
```

可选字段 `download`：同站点下的文件地址，卡片左上角和预览里会多一个「下载 HTML」入口。

每次更新时，先移除上一批项目的 `recent`，再给本次新增项目设置 `recent: true`，并更新页脚日期与 `index.html` 中 `projects.js?v=<本次版本>` 的版本号，避免浏览器沿用旧数据。替换预览图时使用带日期或版本号的新文件名，同步更新 `shot`，避免浏览器继续显示旧截图。筛选数量与总数由数据自动计算。

开源项目的 `url` 使用公开仓库地址；没有公开入口的本地工具省略 `url`，卡片会显示「本地运行 · 暂无公开入口」。不要将私有仓库地址填作访问入口。没有截图时可用 `cover`、`coverNote` 写文字封面；竖版截图可设 `shotFit: "contain"` 完整显示。

改完推到 `main`，GitHub Pages 会自动更新。

## 本地预览

```sh
python3 -m http.server 8000
```

打开 http://localhost:8000/
