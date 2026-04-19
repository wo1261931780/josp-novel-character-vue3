<template>
  <div class="create-page">
    <!-- ============================================
         Header — White
         ============================================ -->
    <header class="create-header">
      <div class="create-header-inner">
        <el-button text @click="$router.push('/')" class="back-link">
          <span aria-hidden="true">&#8592;</span>
          <span class="label-upper">返回</span>
        </el-button>
        <div class="header-title-block">
          <h1 class="header-title">创建角色</h1>
          <p class="label-micro header-sub">填写角色基础信息，AI 将自动完善档案</p>
        </div>
        <div class="header-spacer"></div>
      </div>
    </header>

    <!-- ============================================
         Analysis Context Banner
         ============================================ -->
    <div class="context-banner" v-if="analysisContext">
      <div class="context-banner-inner">
        <div class="context-info">
          <span class="label-micro context-label">&#127981; 世界观背景</span>
          <span class="context-bg">{{ analysisContext.suggestedBackground }}</span>
          <span class="context-sep" aria-hidden="true">·</span>
          <span class="context-genres" v-if="analysisContext.genres?.length">
            {{ analysisContext.genres.join(' / ') }}
          </span>
        </div>
        <el-button text size="small" @click="clearContext" class="context-clear">
          <span aria-hidden="true">&#10005;</span>
          清除背景
        </el-button>
      </div>
    </div>

    <!-- ============================================
         Form Body — White editorial
         ============================================ -->
    <main class="create-main">
      <div class="create-form-wrapper">

        <!-- Section: Basic Info -->
        <section class="form-section">
          <div class="form-section-head">
            <span class="section-num label-micro">01</span>
            <h2 class="section-title">基础信息</h2>
          </div>
          <div class="form-grid">
            <div class="form-row form-row--full">
              <label class="form-label label-micro">角色姓名</label>
              <div class="input-row">
                <el-input
                  v-model="form.name"
                  placeholder="输入角色姓名（2-20个字符）"
                  maxlength="20"
                  show-word-limit
                  style="flex:1"
                />
                <el-button @click="randomName" class="random-btn" title="随机">&#9679;</el-button>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label label-micro">性别</label>
              <el-radio-group v-model="form.gender">
                <el-radio
                  v-for="opt in genderOptions"
                  :key="opt.value"
                  :value="opt.value"
                >
                  {{ opt.label }}
                </el-radio>
              </el-radio-group>
            </div>

            <div class="form-row">
              <label class="form-label label-micro">年龄</label>
              <div class="input-row">
                <el-input-number
                  v-model="form.age"
                  :min="1"
                  :max="999"
                  style="width: 100%"
                />
                <el-button @click="randomAge" class="random-btn" title="随机">&#9679;</el-button>
              </div>
            </div>
          </div>
        </section>

        <!-- Section divider -->
        <div class="form-divider"></div>

        <!-- Section: Character Setup -->
        <section class="form-section">
          <div class="form-section-head">
            <span class="section-num label-micro">02</span>
            <h2 class="section-title">角色设定</h2>
          </div>
          <div class="form-grid">

            <div class="form-row form-row--full">
              <label class="form-label label-micro">小说类型</label>
              <div class="input-row input-row--tri">
                <el-select
                  v-model="form.category"
                  placeholder="选择大类"
                  style="flex:1"
                  @change="onCategoryChange"
                >
                  <el-option
                    v-for="cat in categories"
                    :key="cat"
                    :label="cat"
                    :value="cat"
                  />
                </el-select>
                <el-select
                  v-model="form.novelTypeId"
                  placeholder="具体类型"
                  style="flex:1"
                  :disabled="!form.category"
                  filterable
                  @focus="loadTypesByCategory"
                  @change="onNovelTypeChange"
                >
                  <el-option
                    v-for="type in typeList"
                    :key="type.id"
                    :label="type.typeName"
                    :value="type.id"
                  />
                </el-select>
                <el-button @click="randomType" class="random-btn" title="随机">&#9679;</el-button>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label label-micro">性格特点</label>
              <div class="input-row">
                <el-select v-model="form.personality" placeholder="选择性格" style="flex:1" filterable>
                  <el-option
                    v-for="opt in personalityOptions"
                    :key="opt.value"
                    :label="opt.label"
                    :value="opt.value"
                  />
                </el-select>
                <el-button @click="randomPersonality" class="random-btn" title="随机">&#9679;</el-button>
              </div>
            </div>

            <div class="form-row">
              <label class="form-label label-micro">背景环境</label>
              <div class="input-row">
                <el-select v-model="form.background" placeholder="选择背景" style="flex:1" filterable @change="onBackgroundChange">
                  <el-option
                    v-for="bg in compatibleBackgrounds"
                    :key="bg"
                    :label="bg"
                    :value="bg"
                  />
                </el-select>
                <el-button @click="randomBackground" class="random-btn" title="随机">&#9679;</el-button>
              </div>
            </div>

            <div class="form-row form-row--full">
              <label class="form-label label-micro">出生地</label>
              <div class="input-row">
                <el-select v-model="form.birthplace" placeholder="选择出生地" style="flex:1" filterable>
                  <el-option
                    v-for="place in birthplaces"
                    :key="place"
                    :label="place"
                    :value="place"
                  />
                </el-select>
                <el-button @click="randomBirthplace" class="random-btn" title="随机">&#9679;</el-button>
              </div>
            </div>

            <div class="form-row form-row--full">
              <label class="form-label label-micro">外貌类型</label>
              <div class="input-row">
                <el-radio-group v-model="form.appearance" class="appearance-group">
                  <el-radio
                    v-for="opt in appearanceOptions"
                    :key="opt.value"
                    :value="opt.value"
                  >
                    {{ opt.label }}
                  </el-radio>
                </el-radio-group>
                <el-button @click="randomAppearance" class="random-btn" title="随机">&#9679;</el-button>
              </div>
            </div>

            <!-- Analysis context hints -->
            <div class="form-row form-row--full context-hints" v-if="analysisContext">
              <div class="hint-group" v-if="analysisContext.nameStyleSuggestion">
                <p class="label-micro hint-label">&#127872; 姓名风格</p>
                <p class="hint-text">{{ analysisContext.nameStyleSuggestion }}</p>
              </div>
              <div class="hint-group" v-if="analysisContext.suggestedSetting">
                <p class="label-micro hint-label">&#127968; 世界设定</p>
                <p class="hint-text">{{ analysisContext.suggestedSetting }}</p>
              </div>
              <div class="hint-group" v-if="analysisContext.themes?.length">
                <p class="label-micro hint-label">&#128161; 核心主题</p>
                <div class="tag-list">
                  <span class="hint-tag" v-for="t in analysisContext.themes" :key="t">{{ t }}</span>
                </div>
              </div>
              <div class="hint-group" v-if="analysisContext.skills?.length">
                <p class="label-micro hint-label">&#9876; 相关技能</p>
                <div class="tag-list">
                  <span class="hint-tag hint-tag--accent" v-for="s in analysisContext.skills" :key="s">{{ s }}</span>
                </div>
              </div>
              <div class="hint-group" v-if="analysisContext.typicalConflicts?.length">
                <p class="label-micro hint-label">&#9878; 典型冲突</p>
                <div class="tag-list">
                  <span class="hint-tag hint-tag--muted" v-for="c in analysisContext.typicalConflicts" :key="c">{{ c }}</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <!-- Action row -->
        <div class="form-actions">
          <el-button @click="resetForm" style="width:140px">重置</el-button>
          <el-button
            type="primary"
            :loading="submitting"
            @click="handleSubmit"
            style="width:200px"
          >
            一键生成角色
          </el-button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useCharacterStore } from '@/stores/character'
import { getCategories, getTypesByCategory, getBirthplaces, getCompatibleBackgrounds } from '@/api/novelType'
import { getGenderEnums, getPersonalityEnums, getBackgroundEnums, getAppearanceEnums } from '@/api/enum'

const router = useRouter()
const route = useRoute()
const characterStore = useCharacterStore()

const submitting = ref(false)
const categories = ref([])
const typeList = ref([])
const birthplaces = ref([])
const compatibleBackgrounds = ref([])
const analysisContext = ref(null)

const genderOptions = ref([])
const personalityOptions = ref([])
const appearanceOptions = ref([])

const form = reactive({
  name: '',
  gender: '男',
  age: 25,
  personality: '',
  background: '',
  birthplace: '',
  appearance: '平庸',
  category: '',
  novelTypeId: null
})

// Random pools
const surnames = ['叶', '林', '萧', '苏', '白', '楚', '秦', '赵', '周', '吴', '郑', '王', '张', '刘', '陈', '杨', '黄', '李', '郭', '慕容', '上官', '欧阳', '司马', '诸葛']
const maleNames = ['尘', '天', '风', '云', '霄', '寒', '墨', '轩', '羽', '辰', '渊', '枫', '泽', '凌', '逸', '言']
const femaleNames = ['雪', '月', '灵', '瑶', '倩', '雅', '诗', '琳', '欣', '婷', '琴', '韵', '璇', '雨', '烟', '蝶', '霞', '云']
const neutralNames = ['无心', '逍遥', '醉月', '听风', '流云', '惊鸿', '落霞', '孤鸿', '凌波', '清羽', '寒烟']

function rc(arr) { return arr[Math.floor(Math.random() * arr.length)] }

function randomName() {
  const s = rc(surnames)
  const n = form.gender === '女' ? rc(femaleNames) : form.gender === '男' ? rc(maleNames) : rc(neutralNames)
  form.name = s + n
}

function randomAge() { form.age = Math.floor(Math.random() * 80) + 16 }
function randomPersonality() {
  if (personalityOptions.value.length) form.personality = rc(personalityOptions.value).value
}
function randomAppearance() {
  if (appearanceOptions.value.length) form.appearance = rc(appearanceOptions.value).value
}
function randomBirthplace() {
  if (birthplaces.value.length) form.birthplace = rc(birthplaces.value)
}

async function randomType() {
  if (!categories.value.length) return
  form.category = rc(categories.value)
  await loadTypesByCategory()
  if (typeList.value.length) {
    form.novelTypeId = rc(typeList.value).id
    await loadCompatibleBackgrounds()
  }
}

async function randomBackground() {
  const opts = compatibleBackgrounds.value.length ? compatibleBackgrounds.value : appearanceOptions.value.map(() => '')
  if (opts.length) {
    form.background = rc(compatibleBackgrounds.value.length ? compatibleBackgrounds.value : [])
    await onBackgroundChange()
  }
}

async function loadCategories() {
  try {
    categories.value = await getCategories()
    if (categories.value.length && !form.category) {
      form.category = categories.value[0]
      await loadTypesByCategory()
    }
  } catch (e) { console.error('加载类别失败', e) }
}

async function onCategoryChange() {
  form.novelTypeId = null
  compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
  form.background = ''
  form.birthplace = ''
  await loadTypesByCategory()
}

async function onNovelTypeChange() { await loadCompatibleBackgrounds() }

async function loadTypesByCategory() {
  if (!form.category) return
  try {
    typeList.value = await getTypesByCategory(form.category)
    if (typeList.value.length === 1) {
      form.novelTypeId = typeList.value[0].id
      await loadCompatibleBackgrounds()
    }
  } catch (e) { console.error('加载类型失败', e) }
}

async function loadCompatibleBackgrounds() {
  if (!form.novelTypeId) return
  try {
    compatibleBackgrounds.value = await getCompatibleBackgrounds(form.novelTypeId)
    if (form.background && !compatibleBackgrounds.value.includes(form.background)) {
      form.background = ''
      form.birthplace = ''
    }
  } catch (e) {
    console.error('加载兼容背景失败', e)
    compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
  }
}

async function onBackgroundChange() {
  form.birthplace = ''
  if (!form.background) return
  try {
    birthplaces.value = await getBirthplaces(form.background)
    if (birthplaces.value.length) form.birthplace = birthplaces.value[0]
  } catch (e) { console.error('加载出生地失败', e) }
}

async function handleSubmit() {
  submitting.value = true
  try {
    const { category, ...payload } = form
    const result = await characterStore.create(payload)
    ElMessage.success('角色创建成功')
    if (result?.id) {
      ElMessage.info('开始生成角色详情，请稍候...')
      await characterStore.generate(result.id)
      ElMessage.success('角色生成完成')
      router.push(`/character/${result.id}`)
    }
  } catch (error) {
    ElMessage.error(error.message || '创建失败')
  } finally {
    submitting.value = false
  }
}

function resetForm() {
  Object.assign(form, {
    name: '', gender: genderOptions.value[0]?.value ?? '男',
    age: 25, personality: personalityOptions.value[0]?.value ?? '',
    background: '', birthplace: '', appearance: appearanceOptions.value[0]?.value ?? '平庸',
    category: categories.value[0] || '', novelTypeId: null
  })
  typeList.value = []
  birthplaces.value = []
  compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
}

async function loadEnums() {
  try {
    const [g, p, , a] = await Promise.all([
      getGenderEnums(), getPersonalityEnums(),
      getBackgroundEnums(), getAppearanceEnums()
    ])
    genderOptions.value = g || []
    personalityOptions.value = p || []
    appearanceOptions.value = a || []
    if (genderOptions.value.length) form.gender = genderOptions.value[0].value
    if (personalityOptions.value.length) form.personality = personalityOptions.value[0].value
    if (appearanceOptions.value.length) form.appearance = appearanceOptions.value[0].value
    compatibleBackgrounds.value = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代']
  } catch (e) { console.error('加载枚举失败', e) }
}

onMounted(async () => {
  // 解析分析上下文（从"小说文本分析"页传入）
  const ctx = route.query.context
  if (ctx) {
    try {
      analysisContext.value = JSON.parse(decodeURIComponent(atob(ctx)))
      // 自动预选背景环境
      if (analysisContext.value.suggestedBackground) {
        const bg = analysisContext.value.suggestedBackground
        // 尝试匹配已知背景关键词
        const knownBackgrounds = ['现代', '古代', '架空古代', '玄幻', '仙侠', '近代', '星际科幻', '都市']
        const matched = knownBackgrounds.find(b => bg.includes(b))
        if (matched) {
          form.background = matched
          await onBackgroundChange()
        }
      }
    } catch (e) {
      console.error('解析分析上下文失败', e)
    }
  }

  await loadEnums()
  await loadCategories()
})

function clearContext() {
  analysisContext.value = null
  router.replace({ query: {} })
}
</script>

<style scoped>
/* ============================================
   Page
   ============================================ */
.create-page {
  min-height: 100vh;
  background: var(--f-color-ui-0);
}

/* ============================================
   Header
   ============================================ */
.create-header {
  background: var(--f-color-ui-0);
  border-bottom: 1px solid var(--f-color-ui-20);
}

.create-header-inner {
  max-width: 900px;
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
   Context Banner
   ============================================ */
.context-banner {
  background: var(--f-color-black);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.context-banner-inner {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--sp-14) var(--sp-24);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-16);
}

.context-info {
  display: flex;
  align-items: center;
  gap: var(--sp-10);
  flex-wrap: wrap;
}

.context-label {
  color: var(--f-color-accent-100);
  flex-shrink: 0;
}

.context-bg {
  font-size: 13px;
  font-weight: 500;
  color: #FFFFFF;
}

.context-sep {
  color: rgba(255,255,255,0.2);
}

.context-genres {
  font-size: 13px;
  color: #BFBFBB;
}

.context-clear {
  color: rgba(255,255,255,0.35) !important;
  border: none !important;
  background: transparent !important;
  font-size: 12px !important;
  padding: var(--sp-4) var(--sp-8) !important;
  flex-shrink: 0;
  transition: color 0.15s !important;
}
.context-clear:hover { color: rgba(255,255,255,0.7) !important; background: transparent !important; }
.context-clear span[aria-hidden] { font-size: 10px; }

/* ============================================
   Form body
   ============================================ */
.create-main {
  padding: var(--sp-48) var(--sp-24) var(--sp-60);
}

.create-form-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

/* ============================================
   Form section
   ============================================ */
.form-section {
  padding: var(--sp-32) 0;
}

.form-section-head {
  display: flex;
  align-items: baseline;
  gap: var(--sp-16);
  margin-bottom: var(--sp-32);
}

.section-num {
  color: var(--f-color-accent-100);
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--f-color-text-light);
  letter-spacing: 0;
  text-transform: none;
}

.form-divider {
  height: 1px;
  background: var(--f-color-ui-20);
}

/* ============================================
   Form grid
   ============================================ */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-24) var(--sp-32);
}

.form-row {
  display: flex;
  flex-direction: column;
  gap: var(--sp-8);
}

.form-row--full {
  grid-column: 1 / -1;
}

.form-label {
  color: var(--f-color-black-50);
}

/* ============================================
   Context Hints (AI analysis reference)
   ============================================ */
.context-hints {
  grid-column: 1 / -1;
  background: var(--f-color-black);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--radius-default);
  padding: var(--sp-20);
  gap: var(--sp-16);
}

.hint-group {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.hint-label {
  color: rgba(255,255,255,0.35);
}

.hint-text {
  font-size: 13px;
  color: #D1D1D1;
  line-height: 1.6;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-6);
}

.hint-tag {
  display: inline-block;
  padding: var(--sp-3) var(--sp-8);
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: var(--radius-default);
  font-size: 11px;
  font-family: var(--font-body);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.55);
}

.hint-tag--accent {
  border-color: rgba(218,41,28,0.4);
  color: var(--f-color-accent-100);
}

.hint-tag--muted {
  color: rgba(255,255,255,0.35);
  border-color: rgba(255,255,255,0.06);
}

/* ============================================
   Input row (with random btn)
   ============================================ */
.input-row {
  display: flex;
  gap: var(--sp-8);
  align-items: center;
}

.input-row > *:first-child {
  flex: 1;
}

.input-row--tri {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: var(--sp-8);
  align-items: center;
}

.random-btn {
  width: 40px !important;
  height: 40px !important;
  min-width: 40px !important;
  padding: 0 !important;
  border: 1px solid var(--f-color-ui-20) !important;
  background: var(--f-color-ui-0) !important;
  color: var(--f-color-black-50) !important;
  font-size: 18px !important;
  border-radius: var(--radius-default) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: border-color 0.15s, color 0.15s !important;
  flex-shrink: 0;
}
.random-btn:hover {
  border-color: var(--f-color-accent-100) !important;
  color: var(--f-color-accent-100) !important;
  background: var(--f-color-ui-0) !important;
  opacity: 1 !important;
}

/* ============================================
   Appearance radio group
   ============================================ */
.appearance-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-10);
}

.appearance-group :deep(.el-radio) {
  margin-right: 0 !important;
  padding: var(--sp-8) var(--sp-16);
  border: 1px solid var(--f-color-ui-20);
  border-radius: var(--radius-default);
  transition: border-color 0.15s, background 0.15s;
}
.appearance-group :deep(.el-radio.is-checked) {
  border-color: var(--f-color-accent-100);
  background: rgba(218,41,28,0.04);
}
.appearance-group :deep(.el-radio__label) {
  font-size: 13px !important;
}

/* ============================================
   Form actions
   ============================================ */
.form-actions {
  display: flex;
  gap: var(--sp-16);
  justify-content: center;
  padding-top: var(--sp-40);
  border-top: 1px solid var(--f-color-ui-20);
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
  .create-header-inner {
    flex-wrap: wrap;
    gap: var(--sp-12);
    padding: var(--sp-16) var(--sp-20);
  }
  .header-spacer { display: none; }
  .header-title { font-size: 18px; }
  .create-main { padding: var(--sp-30) var(--sp-20) var(--sp-48); }
  .form-grid { grid-template-columns: 1fr; }
  .form-row--full { grid-column: 1; }
  .input-row--tri { grid-template-columns: 1fr auto; }
  .form-actions { flex-direction: column; align-items: stretch; }
  .form-actions .el-button { width: 100% !important; }
}

@media (max-width: 480px) {
  .input-row--tri { grid-template-columns: 1fr; }
}
</style>
