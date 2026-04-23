<template>
  <div class="library-page">
    <!-- ============================================
         Header — Dark Surface
         ============================================ -->
    <header class="lib-header">
      <div class="lib-header-inner">
        <el-button text @click="$router.push('/')" class="back-link">
          <span aria-hidden="true">&#8592;</span>
          <span class="label-upper">返回首页</span>
        </el-button>

        <div class="lib-title-block">
          <h1 class="lib-title">角色库</h1>
          <p class="label-upper lib-count" v-if="total > 0">{{ total }} 个角色</p>
        </div>

        <el-button type="primary" size="large" @click="$router.push('/character/create')">
          + 创建角色
        </el-button>
      </div>
    </header>

    <!-- ============================================
         Filter Bar — Dark Surface
         ============================================ -->
    <div class="filter-bar">
      <div class="filter-inner">
        <el-input
          v-model="filters.name"
          placeholder="搜索角色姓名"
          style="width: 180px"
          clearable
          @change="loadCharacters"
          :prefix-icon="SearchIcon"
        />
        <el-select
          v-model="filters.gender"
          placeholder="性别"
          style="width: 100px"
          clearable
          @change="loadCharacters"
        >
          <el-option label="男" :value="1" />
          <el-option label="女" :value="0" />
          <el-option label="其他" :value="2" />
        </el-select>
        <el-select
          v-model="filters.personality"
          placeholder="性格"
          style="width: 110px"
          clearable
          @change="loadCharacters"
        >
          <el-option label="正义" value="正义" />
          <el-option label="邪道" value="邪道" />
          <el-option label="中立" value="中立" />
          <el-option label="自私" value="自私" />
          <el-option label="善良" value="善良" />
        </el-select>
        <el-select
          v-model="filters.background"
          placeholder="背景"
          style="width: 110px"
          clearable
          @change="loadCharacters"
        >
          <el-option label="现代" value="现代" />
          <el-option label="古代" value="古代" />
          <el-option label="架空古代" value="架空古代" />
          <el-option label="玄幻" value="玄幻" />
          <el-option label="仙侠" value="仙侠" />
          <el-option label="近代" value="近代" />
        </el-select>
        <el-select
          v-model="filters.status"
          placeholder="状态"
          style="width: 100px"
          clearable
          @change="loadCharacters"
        >
          <el-option label="草稿" :value="0" />
          <el-option label="已生成" :value="1" />
          <el-option label="已完善" :value="2" />
        </el-select>
      </div>
    </div>

    <!-- ============================================
         Character Grid — Dark Background
         ============================================ -->
    <main class="lib-main">
      <div class="lib-main-inner">

        <div v-if="loading" class="lib-loading">
          <div class="loading-bar" v-for="i in 6" :key="i"></div>
        </div>

        <div class="char-grid" v-else-if="characters.length > 0">
          <article
            class="char-card"
            v-for="char in characters"
            :key="char.id"
            @click="$router.push(`/character/${char.id}`)"
            role="button"
            tabindex="0"
            @keydown.enter="$router.push(`/character/${char.id}`)"
          >
            <!-- Card header: avatar + name -->
            <div class="card-head">
              <div class="card-avatar">
                <span>{{ char.name?.charAt(0) || '?' }}</span>
              </div>
              <div class="card-meta">
                <h2 class="card-name">{{ char.name }}</h2>
                <p class="card-age label-micro">{{ char.genderText }} · {{ char.age }}岁</p>
              </div>
            </div>

            <!-- Tags row -->
            <div class="card-tags">
              <span class="card-tag">{{ char.personality }}</span>
              <span class="card-tag">{{ char.background }}</span>
              <span class="card-tag card-tag--status" :class="statusClass(char.status)">
                {{ char.statusText }}
              </span>
            </div>

            <!-- Backstory preview -->
            <p class="card-backstory">
              {{ char.backstory?.substring(0, 80) || '暂无背景故事' }}...
            </p>

            <!-- Card footer -->
            <div class="card-foot">
              <span class="card-date label-micro">{{ formatDate(char.createdAt) }}</span>
              <div class="card-actions">
                <el-button
                  type="danger"
                  size="small"
                  text
                  @click.stop="handleDelete(char)"
                >
                  删除
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  text
                  @click.stop="$router.push(`/character/${char.id}`)"
                >
                  查看
                </el-button>
              </div>
            </div>
          </article>
        </div>

        <!-- Empty state -->
        <div class="lib-empty" v-else>
          <div class="empty-mark" aria-hidden="true">&#9651;</div>
          <p class="label-upper empty-title">暂无角色</p>
          <p class="empty-desc">开始创建第一个角色</p>
          <el-button type="primary" @click="$router.push('/character/create')">
            创建角色
          </el-button>
        </div>

        <!-- Pagination -->
        <div class="lib-pagination" v-if="total > 0">
          <el-pagination
            v-model:current-page="pagination.page"
            :page-size="pagination.pageSize"
            :total="total"
            layout="prev, pager, next"
            @current-change="loadCharacters"
          />
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
// JOSP-novelCharacterVue3
import { ref, reactive, onMounted, h } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCharacterStore } from '@/stores/character'

const router = useRouter()
const characterStore = useCharacterStore()

const SearchIcon = h('svg', {
  xmlns: 'http://www.w3.org/2000/svg',
  width: '14',
  height: '14',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: '2',
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}, [
  h('circle', { cx: '11', cy: '11', r: '8' }),
  h('line', { x1: '21', y1: '21', x2: '16.65', y2: '16.65' })
])

const loading = ref(false)
const characters = ref([])
const total = ref(0)

const filters = reactive({
  name: '',
  gender: null,
  personality: '',
  background: '',
  status: null
})

const pagination = reactive({
  page: 1,
  pageSize: 12
})

function statusClass(status) {
  return {
    'draft': status === 0,
    'generated': status === 1,
    'refined': status === 2
  }
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

async function handleDelete(char) {
  try {
    await ElMessageBox.confirm(
      `确定要删除角色"${char.name}"吗？删除后可重新创建。`,
      '删除确认',
      { confirmButtonText: '删除', cancelButtonText: '取消', type: 'warning' }
    )
    await characterStore.remove(char.id)
    ElMessage.success('删除成功')
    loadCharacters()
  } catch (error) {
    if (error !== 'cancel') console.error('删除失败', error)
  }
}

async function loadCharacters() {
  loading.value = true
  try {
    const params = {
      page: pagination.page,
      pageSize: pagination.pageSize,
      ...filters
    }
    Object.keys(params).forEach(key => {
      if (params[key] === '' || params[key] === null) {
        delete params[key]
      }
    })
    const result = await characterStore.fetchCharacters(params)
    characters.value = result.records || []
    total.value = result.total || 0
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCharacters()
})
</script>

<style scoped>
/* ============================================
   Page wrapper
   ============================================ */
.library-page {
  min-height: 100vh;
  background: var(--f-color-black);
}

/* ============================================
   Header
   ============================================ */
.lib-header {
  background: var(--f-color-ui-90);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.lib-header-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-24) var(--sp-24);
  display: flex;
  align-items: center;
  gap: var(--sp-24);
}

.back-link {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  color: var(--f-color-black-50) !important;
  font-size: 12px !important;
  border: none !important;
  padding: 0 !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.15s !important;
}
.back-link:hover {
  color: var(--f-color-text-dark) !important;
  background: transparent !important;
}
.back-link span[aria-hidden] {
  font-size: 16px;
}

.lib-title-block {
  flex: 1;
}

.lib-title {
  font-size: 22px;
  font-weight: 500;
  color: var(--f-color-text-dark);
  line-height: 1;
}

.lib-count {
  color: var(--f-color-black-50);
  margin-top: var(--sp-4);
}

/* ============================================
   Filter bar
   ============================================ */
.filter-bar {
  background: var(--f-color-black);
  border-bottom: 1px solid rgba(255,255,255,0.04);
  padding: var(--sp-16) 0;
}

.filter-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--sp-24);
  display: flex;
  gap: var(--sp-10);
  flex-wrap: wrap;
  align-items: center;
}

/* Override input bg on dark */
.filter-inner :deep(.el-input__wrapper) {
  background: var(--f-color-ui-90) !important;
  border-color: rgba(255,255,255,0.12) !important;
}
.filter-inner :deep(.el-input__inner) {
  color: var(--f-color-text-dark) !important;
}
.filter-inner :deep(.el-input__inner::placeholder) {
  color: var(--f-color-black-55) !important;
}
.filter-inner :deep(.el-select .el-input__wrapper) {
  background: var(--f-color-ui-90) !important;
  border-color: rgba(255,255,255,0.12) !important;
}
.filter-inner :deep(.el-select .el-input__inner) {
  color: var(--f-color-text-dark) !important;
}
.filter-inner :deep(.el-select .el-input__inner::placeholder) {
  color: var(--f-color-black-55) !important;
}
.filter-inner :deep(.el-select .el-select__tags .el-tag) {
  background: rgba(255,255,255,0.1) !important;
  border-color: rgba(255,255,255,0.12) !important;
  color: var(--f-color-text-dark) !important;
}

/* ============================================
   Main content
   ============================================ */
.lib-main {
  padding: var(--sp-32) 0 var(--sp-60);
}

.lib-main-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--sp-24);
}

/* ============================================
   Loading skeleton
   ============================================ */
.lib-loading {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--sp-20);
}

.loading-bar {
  height: 220px;
  background: var(--f-color-ui-90);
  border-radius: var(--radius-default);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

/* ============================================
   Character grid
   ============================================ */
.char-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--sp-20);
}

/* ============================================
   Character card — White editorial on dark
   ============================================ */
.char-card {
  background: var(--f-color-ui-0);
  border-radius: var(--radius-default);
  padding: var(--sp-24);
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  outline: none;
  display: flex;
  flex-direction: column;
  gap: var(--sp-16);
}

.char-card:hover {
  transform: translateY(-3px);
}

.char-card:focus-visible {
  outline: 2px solid var(--f-color-accent-100);
  outline-offset: 2px;
}

/* Card head */
.card-head {
  display: flex;
  gap: var(--sp-16);
  align-items: center;
}

.card-avatar {
  width: 52px;
  height: 52px;
  background: var(--f-color-black);
  border-radius: var(--radius-default);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-avatar span {
  font-size: 22px;
  font-weight: 600;
  color: var(--f-color-text-dark);
  letter-spacing: -0.5px;
}

.card-name {
  font-size: 18px;
  font-weight: 600;
  color: var(--f-color-text-light);
  line-height: 1.2;
  margin-bottom: var(--sp-4);
}

.card-age {
  color: var(--f-color-black-50);
}

/* Tags */
.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-6);
}

.card-tag {
  display: inline-block;
  padding: var(--sp-4) var(--sp-8);
  border: 1px solid var(--f-color-ui-20);
  border-radius: var(--radius-default);
  font-size: 11px;
  color: var(--f-color-black-60);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-family: var(--font-body);
}

.card-tag--status.draft {
  border-color: var(--f-color-black-50);
  color: var(--f-color-black-50);
}
.card-tag--status.generated {
  border-color: var(--f-color-success);
  color: var(--f-color-success);
}
.card-tag--status.refined {
  border-color: var(--f-color-accent-100);
  color: var(--f-color-accent-100);
}

/* Backstory */
.card-backstory {
  font-size: 13px;
  color: var(--f-color-black-60);
  line-height: 1.7;
  flex: 1;
}

/* Footer */
.card-foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--sp-16);
  border-top: 1px solid var(--f-color-ui-20);
}

.card-date {
  color: var(--f-color-black-55);
}

.card-actions {
  display: flex;
  gap: var(--sp-4);
}

/* ============================================
   Empty state
   ============================================ */
.lib-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--sp-80) var(--sp-24);
  text-align: center;
  gap: var(--sp-12);
}

.empty-mark {
  font-size: 40px;
  color: var(--f-color-accent-100);
  margin-bottom: var(--sp-8);
}

.empty-title {
  color: var(--f-color-black-50);
}

.empty-desc {
  font-size: 14px;
  color: var(--f-color-black-60);
  margin-bottom: var(--sp-8);
}

/* ============================================
   Pagination
   ============================================ */
.lib-pagination {
  display: flex;
  justify-content: center;
  margin-top: var(--sp-40);
}

/* Override pagination on dark bg */
.lib-pagination :deep(.el-pager li) {
  background: var(--f-color-ui-90) !important;
  color: var(--f-color-text-dark) !important;
}
.lib-pagination :deep(.el-pager li.is-active) {
  background: var(--f-color-accent-100) !important;
  color: var(--f-color-text-dark) !important;
}
.lib-pagination :deep(.btn-prev),
.lib-pagination :deep(.btn-next) {
  background: var(--f-color-ui-90) !important;
  color: var(--f-color-text-dark) !important;
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
  .lib-header-inner {
    padding: var(--sp-16) var(--sp-20);
    gap: var(--sp-16);
    flex-wrap: wrap;
  }

  .lib-title {
    font-size: 18px;
  }

  .filter-inner {
    padding: 0 var(--sp-20);
  }

  .lib-main-inner {
    padding: 0 var(--sp-20);
  }

  .char-grid {
    grid-template-columns: 1fr;
  }

  .filter-inner {
    gap: var(--sp-8);
  }
}

@media (max-width: 480px) {
  .filter-inner {
    flex-direction: column;
    align-items: stretch;
  }
  .filter-inner > * {
    width: 100% !important;
  }
}
</style>
