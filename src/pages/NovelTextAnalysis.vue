<template>
  <div class="analyze-page">

    <!-- ============================================
         Header — White
         ============================================ -->
    <header class="analyze-header">
      <div class="analyze-header-inner">
        <el-button text @click="$router.push('/')" class="back-link">
          <span aria-hidden="true">&#8592;</span>
          <span class="label-upper">返回</span>
        </el-button>
        <div class="header-title-block">
          <h1 class="header-title">小说文本分析</h1>
          <p class="label-micro header-sub">输入小说片段，AI 解析世界观与角色设定</p>
        </div>
        <div class="header-spacer"></div>
      </div>
    </header>

    <!-- ============================================
         Main — Two column: Input + Results
         ============================================ -->
    <main class="analyze-main">
      <div class="analyze-layout">

        <!-- Left: Text input -->
        <section class="input-panel">
          <div class="panel-head">
            <p class="label-micro panel-label">&#128221; 小说文本</p>
            <p class="panel-hint">粘贴小说片段，AI 将分析其题材、文风、地点、技能等维度</p>
          </div>

          <div class="textarea-wrapper">
            <textarea
              v-model="inputText"
              class="novel-textarea"
              placeholder="在此粘贴小说文本片段...

例如：青云宗坐落于九万里云海之上，终年被紫气笼罩。这一日，山门大开，无数弟子涌入演武场..."
              maxlength="10000"
              :disabled="analyzing"
            ></textarea>
            <div class="textarea-footer">
              <span class="char-count" :class="{ 'char-count--warn': inputText.length > 8000 }">
                {{ inputText.length }} / 10000
              </span>
            </div>
          </div>

          <div class="input-actions">
            <el-button @click="resetInput" :disabled="analyzing || !inputText">
              重置
            </el-button>
            <el-button
              type="primary"
              size="large"
              :loading="analyzing"
              :disabled="!inputText || inputText.length < 20"
              @click="handleAnalyze"
              style="min-width:200px"
            >
              {{ analyzing ? '分析中...' : '开始分析' }}
            </el-button>
          </div>
        </section>

        <!-- Right: Results -->
        <aside class="results-panel" :class="{ 'results-panel--active': result }">

          <!-- Empty state -->
          <div class="results-empty" v-if="!result && !analyzing">
            <div class="empty-mark" aria-hidden="true">&#9651;</div>
            <p class="label-micro empty-hint">分析结果将显示在此</p>
          </div>

          <!-- Loading state -->
          <div class="results-loading" v-if="analyzing">
            <div class="loading-pulse"></div>
            <p class="label-micro loading-text">AI 正在分析文本...</p>
          </div>

          <!-- Results -->
          <div class="results-content" v-if="result && !analyzing">

            <!-- Result header -->
            <div class="result-head">
              <p class="label-micro result-eyebrow">分析结果</p>
              <h2 class="result-title">{{ result.suggestedBackground || '世界观分析' }}</h2>
              <p class="result-setting" v-if="result.suggestedSetting">
                {{ result.suggestedSetting }}
              </p>
            </div>

            <!-- Tags grid -->
            <div class="result-section" v-if="result.genres?.length">
              <p class="label-micro section-label">&#127918; 题材类型</p>
              <div class="tag-list">
                <span class="result-tag" v-for="g in result.genres" :key="g">{{ g }}</span>
              </div>
            </div>

            <div class="result-section" v-if="result.writingStyle">
              <p class="label-micro section-label">&#127912; 文风特点</p>
              <p class="result-text">{{ result.writingStyle }}</p>
            </div>

            <div class="result-section" v-if="result.themes?.length">
              <p class="label-micro section-label">&#128161; 核心主题</p>
              <div class="tag-list">
                <span class="result-tag result-tag--accent" v-for="t in result.themes" :key="t">{{ t }}</span>
              </div>
            </div>

            <div class="result-section" v-if="result.locations?.length">
              <p class="label-micro section-label">&#128205; 主要地点</p>
              <div class="tag-list">
                <span class="result-tag result-tag--muted" v-for="l in result.locations" :key="l">{{ l }}</span>
              </div>
            </div>

            <div class="result-section" v-if="result.skills?.length">
              <p class="label-micro section-label">&#9876; 技能功法</p>
              <div class="tag-list">
                <span class="result-tag" v-for="s in result.skills" :key="s">{{ s }}</span>
              </div>
            </div>

            <div class="result-section" v-if="result.characterArchetypes?.length">
              <p class="label-micro section-label">&#128101; 典型角色</p>
              <div class="tag-list">
                <span class="result-tag result-tag--muted" v-for="a in result.characterArchetypes" :key="a">{{ a }}</span>
              </div>
            </div>

            <div class="result-section" v-if="result.typicalConflicts?.length">
              <p class="label-micro section-label">&#9878; 典型冲突</p>
              <div class="tag-list">
                <span class="result-tag result-tag--accent" v-for="c in result.typicalConflicts" :key="c">{{ c }}</span>
              </div>
            </div>

            <div class="result-section" v-if="result.recommendedSupporting?.length">
              <p class="label-micro section-label">&#129489; 推荐配角</p>
              <div class="tag-list">
                <span class="result-tag result-tag--muted" v-for="r in result.recommendedSupporting" :key="r">{{ r }}</span>
              </div>
            </div>

            <div class="result-section" v-if="result.nameStyleSuggestion">
              <p class="label-micro section-label">&#127872; 姓名风格</p>
              <p class="result-text">{{ result.nameStyleSuggestion }}</p>
            </div>

            <!-- CTA -->
            <div class="result-actions">
              <el-button type="primary" size="large" @click="goToCreate">
                以此背景创建角色
              </el-button>
              <el-button size="large" @click="handleAnalyze" :loading="analyzing">
                重新分析
              </el-button>
            </div>

          </div>
        </aside>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { analyzeNovelText } from '@/api/novelText'

const router = useRouter()
const inputText = ref('')
const analyzing = ref(false)
const result = ref(null)

async function handleAnalyze() {
  if (inputText.value.length < 20) {
    ElMessage.warning('请输入至少 20 个字符的小说文本')
    return
  }
  analyzing.value = true
  result.value = null
  try {
    result.value = await analyzeNovelText(inputText.value)
  } catch (error) {
    ElMessage.error(error.message || '分析失败，请重试')
  } finally {
    analyzing.value = false
  }
}

function resetInput() {
  inputText.value = ''
  result.value = null
}

function goToCreate() {
  if (!result.value) return
  // 将分析结果编码为 base64 JSON，通过 query 传递给创建页
  const encoded = btoa(encodeURIComponent(JSON.stringify(result.value)))
  router.push({
    path: '/character/create',
    query: { context: encoded }
  })
}
</script>

<style scoped>
/* ============================================
   Page
   ============================================ */
.analyze-page {
  min-height: 100vh;
  background: var(--f-color-ui-0);
}

/* ============================================
   Header
   ============================================ */
.analyze-header {
  background: var(--f-color-ui-0);
  border-bottom: 1px solid var(--f-color-ui-20);
}

.analyze-header-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-24);
  display: flex;
  align-items: center;
  gap: var(--sp-20);
}

.back-link {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  color: var(--f-color-black-50) !important;
  border: none !important;
  padding: 0 !important;
  font-size: 12px !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: transparent !important;
  transition: color 0.15s !important;
  flex-shrink: 0;
}
.back-link:hover { color: var(--f-color-text-light) !important; background: transparent !important; }
.back-link span[aria-hidden] { font-size: 16px; }

.header-title-block { flex: 1; }

.header-title {
  font-size: 22px;
  font-weight: 500;
  color: var(--f-color-text-light);
  margin-bottom: var(--sp-4);
}

.header-sub { color: var(--f-color-black-50); }

.header-spacer { width: 60px; }

/* ============================================
   Main
   ============================================ */
.analyze-main {
  padding: var(--sp-40) var(--sp-24) var(--sp-60);
}

.analyze-layout {
  max-width: var(--max-w);
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-32);
  align-items: start;
}

/* ============================================
   Input panel
   ============================================ */
.input-panel {
  display: flex;
  flex-direction: column;
  gap: var(--sp-20);
}

.panel-head {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.panel-label {
  color: var(--f-color-black-50);
}

.panel-hint {
  font-size: 13px;
  color: var(--f-color-black-60);
  line-height: 1.6;
}

.textarea-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.novel-textarea {
  width: 100%;
  height: 480px;
  padding: var(--sp-16);
  border: 1px solid var(--f-color-border);
  border-radius: var(--radius-default);
  background: var(--f-color-ui-0);
  color: var(--f-color-text-light);
  font-family: var(--font-body);
  font-size: 14px;
  line-height: 1.8;
  resize: vertical;
  transition: border-color 0.15s;
  box-sizing: border-box;
}

.novel-textarea:focus {
  outline: none;
  border-color: var(--f-color-accent-100);
}

.novel-textarea:disabled {
  background: var(--f-color-ui-0);
  opacity: 0.6;
}

.novel-textarea::placeholder {
  color: var(--f-color-black-55);
  line-height: 1.8;
}

.textarea-footer {
  display: flex;
  justify-content: flex-end;
  padding: var(--sp-6) 0;
}

.char-count {
  font-size: 12px;
  color: var(--f-color-black-50);
  font-family: var(--font-body);
}

.char-count--warn {
  color: var(--f-color-accent-100);
}

.input-actions {
  display: flex;
  gap: var(--sp-12);
  justify-content: flex-end;
}

/* ============================================
   Results panel
   ============================================ */
.results-panel {
  background: var(--f-color-black);
  border-radius: var(--radius-default);
  border: 1px solid rgba(255,255,255,0.06);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.results-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-12);
  padding: var(--sp-60);
}

.empty-mark {
  font-size: 40px;
  color: rgba(255,255,255,0.1);
  line-height: 1;
}

.empty-hint {
  color: rgba(255,255,255,0.25);
  text-align: center;
}

.results-loading {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-16);
  padding: var(--sp-60);
}

.loading-pulse {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid rgba(218,41,28,0.2);
  border-top-color: var(--f-color-accent-100);
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-text {
  color: rgba(255,255,255,0.4);
}

.results-content {
  padding: var(--sp-28);
  display: flex;
  flex-direction: column;
  gap: var(--sp-24);
  overflow-y: auto;
  max-height: 640px;
}

/* ============================================
   Result sections
   ============================================ */
.result-head {
  border-bottom: 1px solid rgba(255,255,255,0.08);
  padding-bottom: var(--sp-20);
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.result-eyebrow {
  color: var(--f-color-accent-100);
  font-size: 10px;
}

.result-title {
  font-size: 18px;
  font-weight: 500;
  color: #FFFFFF;
  letter-spacing: 0;
  text-transform: none;
}

.result-setting {
  font-size: 13px;
  color: #BFBFBB;
  line-height: 1.6;
}

.result-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.section-label {
  color: rgba(255,255,255,0.35);
}

.result-text {
  font-size: 13px;
  color: #D1D1D1;
  line-height: 1.7;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-6);
}

.result-tag {
  display: inline-block;
  padding: var(--sp-4) var(--sp-10);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-default);
  font-size: 12px;
  font-family: var(--font-body);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #D1D1D1;
}

.result-tag--accent {
  border-color: rgba(218,41,28,0.5);
  color: var(--f-color-accent-100);
}

.result-tag--muted {
  color: rgba(255,255,255,0.5);
  border-color: rgba(255,255,255,0.08);
}

.result-actions {
  display: flex;
  gap: var(--sp-12);
  padding-top: var(--sp-8);
  border-top: 1px solid rgba(255,255,255,0.08);
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 960px) {
  .analyze-layout {
    grid-template-columns: 1fr;
  }

  .novel-textarea {
    height: 300px;
  }

  .results-content {
    max-height: none;
  }
}

@media (max-width: 768px) {
  .analyze-header-inner {
    flex-wrap: wrap;
    gap: var(--sp-12);
    padding: var(--sp-16) var(--sp-20);
  }

  .header-spacer { display: none; }
  .header-title { font-size: 18px; }

  .analyze-main {
    padding: var(--sp-30) var(--sp-20) var(--sp-48);
  }

  .input-actions {
    flex-direction: column;
  }

  .input-actions .el-button {
    width: 100%;
  }

  .result-actions {
    flex-direction: column;
  }

  .result-actions .el-button {
    width: 100%;
  }
}
</style>
