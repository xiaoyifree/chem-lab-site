# Chem Lab Site

一个面向中学生的化学实验学习网站，现已升级为 Next.js App Router 结构，并支持导出为适合 GitHub Pages 的静态站点。

## 当前能力

- 完整首页，包含课程定位、分层学习、示范实验与实验目录
- 多个可点击的实验详情页
- 初阶、中阶、高阶三层教学结构
- 通过 Web Audio API 实时生成按钮音效
- 更明显的化学反应动画，包括气泡、火花、沉淀和气体扩散

## 目录结构

- `app/` 页面与路由
- `components/` 可复用交互组件
- `data/` 实验数据源
- `assets/` 预留图片、音效与动画素材目录
- `experiments/` 保留给额外资料或旧静态页迁移时使用

## 运行方式

项目依赖 `next`、`react`、`react-dom`。

常用命令：

- `npm install`
- `npm run dev`
- `pnpm run build`

如果当前机器没有 `npm`，需要先安装 Node.js 对应的包管理器，或使用其他可用的包管理工具安装依赖。

## GitHub Pages 发布

项目已配置为静态导出模式：

- `next build` 会输出到 `out/`
- `.github/workflows/deploy-github-pages.yml` 会在推送到 `main` 后自动发布
- 发布到 GitHub Pages 时会自动使用仓库名作为 `basePath`

如果你的仓库名是 `chem-lab-site`，最终页面地址通常会是：

- `https://<你的 GitHub 用户名>.github.io/chem-lab-site/`

## GitHub 仓库建议

- 仓库名：`chem-lab-site`
- 描述：`Interactive chemistry experiment website for middle school students`
