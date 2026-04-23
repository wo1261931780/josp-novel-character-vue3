<template>
  <div class="home-page">
    <!-- ============================================
         Section 1: Cinematic Hero — Absolute Black
         ============================================ -->
    <section class="section-hero">
      <div class="hero-inner">
        <!-- Logo mark -->
        <div class="hero-emblem" aria-hidden="true">&#9651;</div>

        <p class="label-upper hero-eyebrow">Novel Character Simulator</p>

        <h1 class="hero-title">
          赋予角色<br>灵魂与命运
        </h1>

        <p class="hero-desc">
          基于 AI 的小说角色生成引擎<br>
          从姓名到生平，从外貌到内心，全方位塑造每一个角色
        </p>

        <div class="hero-actions">
          <el-button type="primary" size="large" @click="$router.push('/character/create')">
            创建角色
          </el-button>
          <el-button size="large" @click="$router.push('/analyze')">
            分析小说文本
          </el-button>
          <el-button size="large" @click="$router.push('/library')">
            角色库
          </el-button>
        </div>
      </div>

      <!-- Decorative grid lines -->
      <div class="hero-grid-line hero-grid-line--h" aria-hidden="true"></div>
      <div class="hero-grid-line hero-grid-line--v" aria-hidden="true"></div>
    </section>

    <!-- ============================================
         Section 2: White Editorial — Features
         ============================================ -->
    <section class="section-features">
      <div class="section-inner">
        <p class="label-upper section-label">核心能力</p>
        <h2 class="section-heading">每一个角色，都是一个完整的世界</h2>

        <div class="features-grid">
          <div class="feature-item" v-for="f in features" :key="f.title">
            <div class="feature-number">{{ f.num }}</div>
            <div class="feature-body">
              <h3 class="feature-title">{{ f.title }}</h3>
              <p class="feature-desc">{{ f.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ============================================
         Section 3: Cinematic Dark — Stats / CTA
         ============================================ -->
    <section class="section-cta">
      <div class="section-inner">
        <p class="label-upper section-label-dark">开始探索</p>
        <h2 class="section-heading-light">构建你的角色宇宙</h2>
        <p class="section-desc-light">
          支持玄幻、仙侠、现代、科幻、悬疑等主流小说类型<br>
          AI 自动生成六维度性格图谱与生平时间线
        </p>
        <el-button type="primary" size="large" @click="$router.push('/character/create')">
          立即创建
        </el-button>
      </div>
    </section>

    <!-- ============================================
         Section 4: White Editorial — Novel Types
         ============================================ -->
    <section class="section-types">
      <div class="section-inner">
        <p class="label-upper section-label">支持类型</p>
        <h2 class="section-heading">覆盖主流小说类型</h2>

        <div class="types-list">
          <span class="type-chip" v-for="t in novelTypes" :key="t">{{ t }}</span>
        </div>
      </div>
    </section>

    <!-- ============================================
         Footer — Dark Surface
         ============================================ -->
    <footer class="site-footer">
      <div class="footer-inner">
        <p class="footer-brand label-upper">Novel Character Simulator</p>
        <p class="footer-copy">AI驱动的智能小说角色生成工具</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
// JOSP-novelCharacterVue3
const features = [
  {
    num: '01',
    title: '小说文本分析',
    desc: '输入任意小说片段，AI 解析题材、文风、地点、技能与世界观，构建完整角色宇宙'
  },
  {
    num: '02',
    title: '多维度角色塑造',
    desc: '从基础信息到性格特点，从背景环境到外貌描写全方位定义角色每一个切面'
  },
  {
    num: '03',
    title: 'AI 智能生成',
    desc: '基于小说类型和角色设定，AI 自动生成完整的角色档案与深度描写'
  },
  {
    num: '04',
    title: '生平时间线 & 六维雷达',
    desc: '模拟真实人生轨迹，生成重要事件；六维雷达图可视化理智、意志、情感、欲望、信念与韧性'
  }
]

const novelTypes = [
  '玄幻', '仙侠', '都市', '现代', '科幻', '悬疑',
  '历史', '武侠', '言情', '奇幻', '星际', '暗黑'
]
</script>

<style scoped>
/* ============================================
   Page wrapper
   ============================================ */
.home-page {
  background: var(--f-color-black);
  min-height: 100vh;
}

/* ============================================
   Shared section layout
   ============================================ */
.section-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--sp-24);
}

.section-label {
  margin-bottom: var(--sp-12);
}

.section-heading {
  font-size: 26px;
  font-weight: 500;
  color: var(--f-color-text-light);
  line-height: 1.2;
  margin-bottom: var(--sp-40);
}

/* ============================================
   Section 1: Hero — Absolute Black
   ============================================ */
.section-hero {
  position: relative;
  background: var(--f-color-black);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: var(--sp-80) var(--sp-24);
}

.hero-inner {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 720px;
}

.hero-emblem {
  font-size: 48px;
  color: var(--f-color-accent-100);
  margin-bottom: var(--sp-24);
  line-height: 1;
}

.hero-eyebrow {
  color: var(--f-color-black-50);
  margin-bottom: var(--sp-20);
}

.hero-title {
  font-size: clamp(36px, 6vw, 72px);
  font-weight: 500;
  color: var(--f-color-text-dark);
  line-height: 1.1;
  letter-spacing: -0.5px;
  margin-bottom: var(--sp-24);
}

.hero-desc {
  font-size: 15px;
  color: var(--f-color-black-50);
  line-height: 1.8;
  margin-bottom: var(--sp-40);
}

.hero-actions {
  display: flex;
  gap: var(--sp-16);
  justify-content: center;
  flex-wrap: wrap;
}

.hero-actions .el-button {
  min-width: 160px;
}

/* Decorative grid lines */
.hero-grid-line {
  position: absolute;
  background: rgba(255,255,255,0.03);
  pointer-events: none;
  z-index: 1;
}
.hero-grid-line--h {
  left: 0; right: 0;
  height: 1px;
  top: 33%;
}
.hero-grid-line--v {
  top: 0; bottom: 0;
  width: 1px;
  left: 66%;
}

/* ============================================
   Section 2: Features — White
   ============================================ */
.section-features {
  background: var(--f-color-ui-0);
  padding: var(--sp-80) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1px;
  background: var(--f-color-ui-20);
  border: 1px solid var(--f-color-ui-20);
}

.feature-item {
  background: var(--f-color-ui-0);
  padding: var(--sp-40) var(--sp-40);
  display: flex;
  gap: var(--sp-24);
  align-items: flex-start;
}

.feature-number {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 1px;
  color: var(--f-color-accent-100);
  font-family: var(--font-body);
  text-transform: uppercase;
  flex-shrink: 0;
  padding-top: 4px;
}

.feature-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--f-color-text-light);
  margin-bottom: var(--sp-10);
  line-height: 1.2;
}

.feature-desc {
  font-size: 14px;
  color: var(--f-color-black-60);
  line-height: 1.7;
}

/* ============================================
   Section 3: CTA — Cinematic Dark
   ============================================ */
.section-cta {
  background: var(--f-color-black);
  padding: var(--sp-80) 0;
  border-top: 1px solid rgba(255,255,255,0.06);
}

.section-label-dark {
  color: var(--f-color-black-50);
  margin-bottom: var(--sp-12);
}

.section-heading-light {
  font-size: 26px;
  font-weight: 500;
  color: var(--f-color-text-dark);
  line-height: 1.2;
  margin-bottom: var(--sp-16);
}

.section-desc-light {
  font-size: 14px;
  color: var(--f-color-black-50);
  line-height: 1.8;
  margin-bottom: var(--sp-32);
}

/* ============================================
   Section 4: Novel Types — White
   ============================================ */
.section-types {
  background: var(--f-color-ui-0);
  padding: var(--sp-80) 0;
}

.types-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-10);
}

.type-chip {
  display: inline-block;
  padding: var(--sp-8) var(--sp-16);
  border: 1px solid var(--f-color-ui-20);
  border-radius: var(--radius-default);
  font-size: 13px;
  color: var(--f-color-black-60);
  letter-spacing: 0.5px;
  transition: border-color 0.15s, color 0.15s;
}

.type-chip:hover {
  border-color: var(--f-color-accent-100);
  color: var(--f-color-accent-100);
}

/* ============================================
   Footer
   ============================================ */
.site-footer {
  background: var(--f-color-ui-90);
  padding: var(--sp-40) 0;
}

.footer-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--sp-24);
  text-align: center;
}

.footer-brand {
  color: var(--f-color-ui-0);
  margin-bottom: var(--sp-8);
  letter-spacing: 2px;
}

.footer-copy {
  font-size: 13px;
  color: var(--f-color-black-50);
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
  .section-hero {
    min-height: 100svh;
    padding: var(--sp-60) var(--sp-20);
    align-items: flex-start;
    padding-top: calc(var(--sp-80) + env(safe-area-inset-top));
  }

  .hero-inner {
    padding-top: var(--sp-40);
  }

  .hero-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .hero-actions .el-button {
    min-width: unset;
    width: 100%;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .feature-item {
    padding: var(--sp-30) var(--sp-20);
  }

  .section-features,
  .section-types {
    padding: var(--sp-48) 0;
  }

  .section-cta {
    padding: var(--sp-48) 0;
  }

  .section-heading {
    font-size: 22px;
    margin-bottom: var(--sp-30);
  }

  .section-inner {
    padding: 0 var(--sp-20);
  }
}

@media (max-width: 480px) {
  .hero-title {
    font-size: 32px;
  }

  .section-heading-light {
    font-size: 22px;
  }
}
</style>
