<template>
  <div class="detail-page">
    <div v-loading="loading" class="detail-layout">

      <!-- ============================================
           Character Header — Absolute Black
           ============================================ -->
      <header class="char-header" v-if="character">
        <div class="char-header-inner">
          <div class="header-left">
            <el-button text @click="$router.push('/library')" class="back-btn">
              <span aria-hidden="true">&#8592;</span>
              <span class="label-upper">角色库</span>
            </el-button>
          </div>

          <div class="header-center">
            <div class="char-avatar">
              <span>{{ character.name?.charAt(0) || '?' }}</span>
            </div>
            <div class="char-identity">
              <h1 class="char-name">{{ character.name }}</h1>
              <div class="char-tags">
                <span class="char-tag">{{ character.genderText }}</span>
                <span class="char-tag">{{ character.age }}岁</span>
                <span class="char-tag">{{ character.personality }}</span>
                <span class="char-tag">{{ character.background }}</span>
                <span class="char-tag char-tag--type" v-if="character.novelTypeName">
                  {{ character.novelTypeName }}
                </span>
              </div>
            </div>
          </div>

          <div class="header-right">
            <el-button
              v-if="character.status === 0"
              type="primary"
              size="small"
              :loading="generating"
              @click="handleGenerate"
            >
              生成详情
            </el-button>
            <el-button
              v-else
              size="small"
              :loading="generating"
              @click="handleGenerate"
            >
              重新生成
            </el-button>
            <el-button
              type="danger"
              size="small"
              text
              @click="handleDelete"
            >
              删除
            </el-button>
          </div>
        </div>
      </header>

      <!-- ============================================
           Content Area — White + Dark alternating
           ============================================ -->
      <main class="detail-main" v-if="character">

        <!-- Tabs nav -->
        <nav class="detail-tabs-nav">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="tab-btn"
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            <span class="label-upper">{{ tab.label }}</span>
          </button>
        </nav>

        <!-- Tab: 详细信息 -->
        <section class="tab-panel" v-show="activeTab === 'detail'">
          <CharacterDetailContent
            :character="character"
            :generating="generating"
            @generate="handleGenerate"
          />
        </section>

        <!-- Tab: 生平经历 -->
        <section class="tab-panel" v-show="activeTab === 'events'">
          <CharacterEventsList :events="events" />
        </section>

        <!-- Tab: 事件时间线 -->
        <section class="tab-panel tab-panel--dark" v-show="activeTab === 'timeline'">
          <div class="timeline-wrapper">
            <CharacterTimelineChart
              :events="events"
              :max-age="character.age"
            />
          </div>
        </section>

      </main>

      <!-- ============================================
           Six Dimension Radar — Absolute Black panel
           ============================================ -->
      <aside class="dimension-aside" v-if="character && dimensions">
        <div class="dimension-aside-inner">
          <p class="label-micro aside-label">命运六维度</p>
          <CharacterDimensionChart :dimensions="dimensions" />
        </div>
      </aside>

      <!-- No character -->
      <el-empty v-if="!character && !loading" description="角色不存在" class="detail-empty" />

    </div>
  </div>
</template>

<script setup>
// JOSP-novelCharacterVue3
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCharacterStore } from '@/stores/character'
import { getCharacterEvents, getCharacterDimensions } from '@/api/character'

import CharacterDetailContent from './components/CharacterDetailContent.vue'
import CharacterEventsList from './components/CharacterEventsList.vue'
import CharacterTimelineChart from './components/CharacterTimelineChart.vue'
import CharacterDimensionChart from './components/CharacterDimensionChart.vue'

const route = useRoute()
const router = useRouter()
const characterStore = useCharacterStore()

const loading = ref(false)
const generating = ref(false)
const character = ref(null)
const events = ref([])
const dimensions = ref(null)
const activeTab = ref('detail')

const tabs = [
  { key: 'detail',    label: '详细信息' },
  { key: 'events',    label: '生平经历' },
  { key: 'timeline',  label: '事件时间线' }
]

async function loadCharacter() {
  loading.value = true
  try {
    character.value = await characterStore.fetchCharacter(route.params.id)
  } catch {
    ElMessage.error('加载角色失败')
  } finally {
    loading.value = false
  }
}

async function loadEvents() {
  try {
    events.value = await getCharacterEvents(route.params.id)
  } catch (e) {
    console.error('加载事件失败', e)
  }
}

async function loadDimensions() {
  try {
    dimensions.value = await getCharacterDimensions(route.params.id)
  } catch (e) {
    console.error('加载六维度失败', e)
  }
}

async function handleGenerate() {
  generating.value = true
  try {
    await characterStore.generate(route.params.id)
    ElMessage.success('生成成功')
    await loadCharacter()
  } catch (error) {
    ElMessage.error(error.message || '生成失败')
  } finally {
    generating.value = false
  }
}

async function handleDelete() {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${character.value?.name}"吗？删除后可重新创建。`,
      '删除确认',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    )
    await characterStore.remove(route.params.id)
    ElMessage.success('删除成功')
    router.push('/library')
  } catch (error) {
    if (error !== 'cancel') console.error('删除失败', error)
  }
}

onMounted(async () => {
  await loadCharacter()
  await Promise.all([loadEvents(), loadDimensions()])
})
</script>

<style scoped>
/* ============================================
   Page wrapper
   ============================================ */
.detail-page {
  min-height: 100vh;
  background: var(--f-color-black);
}

/* ============================================
   Layout — Cinematic grid
   ============================================ */
.detail-layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  column-gap: 0;
}

/* ============================================
   Character Header — Absolute Black
   ============================================ */
.char-header {
  grid-column: 1 / -1;
  background: var(--f-color-black);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.char-header-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-24) var(--sp-24);
  display: flex;
  align-items: center;
  gap: var(--sp-24);
}

.header-left {
  flex-shrink: 0;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  color: var(--f-color-black-50) !important;
  border: none !important;
  padding: 0 !important;
  background: transparent !important;
  font-size: 12px !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.15s !important;
}
.back-btn:hover { color: var(--f-color-text-dark) !important; background: transparent !important; }
.back-btn span[aria-hidden] { font-size: 16px; }

.header-center {
  flex: 1;
  display: flex;
  align-items: center;
  gap: var(--sp-20);
}

.char-avatar {
  width: 60px;
  height: 60px;
  background: var(--f-color-ui-90);
  border-radius: var(--radius-default);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.char-avatar span {
  font-size: 28px;
  font-weight: 600;
  color: var(--f-color-text-dark);
}

.char-name {
  font-size: 24px;
  font-weight: 500;
  color: var(--f-color-text-dark);
  margin-bottom: var(--sp-8);
  letter-spacing: -0.3px;
}

.char-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-6);
}

.char-tag {
  display: inline-block;
  padding: var(--sp-4) var(--sp-10);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius-default);
  font-size: 11px;
  font-family: var(--font-body);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--f-color-black-50);
}

.char-tag--type {
  border-color: rgba(218,41,28,0.4);
  color: var(--f-color-accent-100);
}

.header-right {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
  align-items: flex-end;
  flex-shrink: 0;
}

/* ============================================
   Detail Main
   ============================================ */
.detail-main {
  background: var(--f-color-ui-0);
  min-height: 100vh;
}

/* ============================================
   Tabs nav
   ============================================ */
.detail-tabs-nav {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--f-color-ui-20);
  padding: 0 var(--sp-24);
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: var(--sp-16) var(--sp-20);
  cursor: pointer;
  color: var(--f-color-black-50);
  transition: color 0.15s, border-color 0.15s;
  margin-bottom: -1px;
}

.tab-btn:hover {
  color: var(--f-color-text-light);
}

.tab-btn.active {
  color: var(--f-color-accent-100);
  border-bottom-color: var(--f-color-accent-100);
}

.tab-btn .label-upper {
  font-size: 12px;
  letter-spacing: 1px;
}

/* ============================================
   Tab panels
   ============================================ */
.tab-panel {
  padding: var(--sp-32) var(--sp-24);
}

.tab-panel--dark {
  background: var(--f-color-black);
  padding: var(--sp-32) var(--sp-24);
}

.timeline-wrapper {
  max-width: 100%;
}

/* ============================================
   Dimension aside — Absolute Black
   ============================================ */
.dimension-aside {
  background: var(--f-color-black);
  border-left: 1px solid rgba(255,255,255,0.06);
  padding: var(--sp-32) var(--sp-20);
}

.dimension-aside-inner {
  position: sticky;
  top: var(--sp-24);
}

.aside-label {
  color: #BFBFBB;
  margin-bottom: var(--sp-20);
  display: block;
}

/* ============================================
   Empty state
   ============================================ */
.detail-empty {
  grid-column: 1 / -1;
  background: var(--f-color-ui-0);
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 960px) {
  .detail-layout {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
  }

  .char-header-inner {
    flex-wrap: wrap;
    gap: var(--sp-16);
    padding: var(--sp-16) var(--sp-20);
  }

  .header-center {
    order: 3;
    width: 100%;
  }

  .char-name {
    font-size: 20px;
  }

  .header-right {
    flex-direction: row;
    align-items: center;
  }

  .dimension-aside {
    border-left: none;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .dimension-aside-inner {
    position: static;
  }

  .tab-panel,
  .tab-panel--dark {
    padding: var(--sp-24) var(--sp-20);
  }
}

@media (max-width: 480px) {
  .char-tags {
    gap: var(--sp-4);
  }

  .tab-btn {
    padding: var(--sp-12) var(--sp-14);
  }

  .tab-btn .label-upper {
    font-size: 11px;
  }
}
</style>
