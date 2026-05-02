# JOSP-novelCharacterVue3

小说角色生成模拟器 - Vue3 前端项目。

基于 Vue 3 + Element Plus + Pinia 构建，提供小说角色设定生成、关系管理、事件编排等功能的可视化界面。

## 技术栈

| 技术 | 版本 | 说明 |
|------|------|------|
| Vue | 3.5.32 | 渐进式 JavaScript 框架 |
| Vite | 8.0.8 | 下一代前端构建工具 |
| Element Plus | 2.13.7 | Vue3 UI 组件库 |
| Pinia | 3.0.4 | Vue3 状态管理 |
| Vue Router | 5.0.4 | Vue3 官方路由 |
| Axios | 1.15.2 | HTTP 客户端 |
| ECharts | 6.0.0 | 数据可视化库 |
| Sass | 1.99.0 | CSS 预处理器 |

## 项目结构

```
src/
├── App.vue                   # 应用根组件
├── main.js                   # 应用入口
├── api/                      # API 接口封装
│   ├── character.js          # 角色相关接口
│   ├── enum.js               # 枚举查询接口
│   ├── novelText.js          # 小说文本分析接口
│   ├── novelType.js          # 小说类型接口
│   └── stats.js             # 统计接口
├── pages/                    # 页面组件
│   ├── CharacterCreate.vue   # 角色创建
│   ├── CharacterDetail.vue   # 角色详情
│   ├── Dashboard.vue         # 仪表盘
│   ├── HomePage.vue          # 首页
│   ├── Library.vue          # 角色库
│   ├── NovelTextAnalysis.vue # 小说文本分析
│   └── components/          # 页面级组件
│       ├── CharacterDetailContent.vue  # 角色详情内容
│       ├── CharacterDimensionChart.vue # 角色维度图表
│       ├── CharacterEventsList.vue     # 角色事件列表
│       ├── CharacterHeader.vue         # 角色头部
│       └── CharacterTimelineChart.vue  # 角色时间线图表
├── stores/                   # Pinia 状态管理
│   ├── character.js          # 角色状态
│   └── novelType.js         # 小说类型状态
├── router/                  # 路由配置
│   └── index.js
└── style.css                # 全局样式（Ferrari 设计系统）

public/                      # 静态资源
dist/                        # 构建输出目录
```

## 核心功能

### 1. 角色管理
- 创建/编辑/删除小说角色
- 角色多维度设定：外貌、性格、背景、技能、弱点
- 角色状态管理：草稿 → 已生成 → 已完善

### 2. AI 智能生成
- 基于小说类型和背景环境自动生成角色
- 支持 SSE 流式响应，实时返回生成进度

### 3. 事件编排
- 为角色添加人生事件
- 事件时间线可视化
- 事件重要程度评分（1-5）

### 4. 关系管理
- 角色间关系类型定义（朋友、敌人、爱人等）
- 关系描述与角色互动

### 5. 数据可视化
- 角色六维度雷达图
- 角色发展时间线
- 统计数据仪表盘

## 快速开始

### 环境要求
- Node.js 18+
- pnpm 8+（推荐）或 npm 10+

### 安装依赖

```bash
pnpm install
# 或
npm install
```

### 开发模式

```bash
pnpm dev
# 或
npm run dev
```

### 构建生产版本

```bash
pnpm build
# 或
npm run build
```

### 预览生产构建

```bash
pnpm preview
# 或
npm run preview
```

## API 配置

项目默认代理到 `http://localhost:8080`。如需修改，编辑 `vite.config.js`:

```javascript
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

## 设计系统

本项目采用 Ferrari 设计系统作为视觉基础，详见 [DESIGN.md](./DESIGN.md)。

**核心特征：**
- 深黑与纯白的交替布局（明暗对比）
- Ferrari Red（#DA291C）作为主强调色
- 近乎零边框半径（2px 默认）
- 双字体系统：FerrariSans（标题）+ Body-Font（标签）

## License

MIT