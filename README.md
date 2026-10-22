# 灰叔SI · 产品库

灰叔的产品展示页。每张卡片是一个上线的项目：标题、一句话介绍、网站截图，点开直接进入网站。

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
  cat: "mystic",                       // 分类：mystic / life / tools
  lock: "需登录",                      // 可省：需登录 / 受邀 / 内部
},
```

改完推到 `main`，GitHub Pages 会自动更新。

## 本地预览

```sh
python3 -m http.server 8000
```

打开 http://localhost:8000/
