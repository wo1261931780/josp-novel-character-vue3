<template>
  <div class="detail-page">
    <div class="page-header">
      <el-button text @click="$router.push('/library')" class="back-btn">
        <span>&larr;</span> 返回角色库
      </el-button>
    </div>

    <div v-loading="loading" class="content-wrapper">
      <!-- 角色头部 -->
      <CharacterHeader
        v-if="character"
        :character="character"
        :generating="generating"
        @generate="handleGenerate"
        @delete="handleDelete"
      />

      <!-- 详细信息 tab -->
      <div v-if="character" class="detail-tabs-wrapper">
        <el-tabs v-model="activeTab" class="detail-tabs">
          <el-tab-pane label="详细信息" name="detail">
            <CharacterDetailContent
              :character="character"
              :generating="generating"
              @generate="handleGenerate"
            />
          </el-tab-pane>

          <el-tab-pane label="生平经历" name="events">
            <CharacterEventsList :events="events" />
          </el-tab-pane>

          <el-tab-pane label="事件时间线" name="timeline">
            <CharacterTimelineChart
              :events="events"
              :max-age="character.age"
            />
          </el-tab-pane>
        </el-tabs>
      </div>

      <!-- 六维度雷达图：只在非详情 tab 显示，固定右侧 -->
      <div
        v-if="character && dimensions && activeTab !== 'detail'"
        class="dimension-panel"
      >
        <CharacterDimensionChart :dimensions="dimensions" />
      </div>

      <!-- 无角色时显示空状态 -->
      <el-empty v-if="!character && !loading" description="角色不存在" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useCharacterStore } from '@/stores/character'
import { getCharacterEvents, getCharacterDimensions } from '@/api/character'

import CharacterHeader from './components/CharacterHeader.vue'
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
  } catch (error) {
    console.error('加载事件失败', error)
  }
}

async function loadDimensions() {
  try {
    dimensions.value = await getCharacterDimensions(route.params.id)
  } catch (error) {
    console.error('加载六维度失败', error)
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
.detail-page {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 20px;
}

.page-header {
  max-width: 1200px;
  margin: 0 auto 20px;
}

.back-btn {
  font-size: 16px;
  color: #666;
}

.back-btn:hover {
  color: #667eea;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 20px;
  align-items: start;
}

.detail-tabs-wrapper {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.detail-tabs :deep(.el-tabs__item) {
  font-size: 16px;
  font-weight: 600;
}

.detail-tabs :deep(.el-tabs__item.is-active) {
  color: #667eea;
}

.detail-tabs :deep(.el-tabs__active-bar) {
  background: #667eea;
}

.dimension-panel {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 20px;
}

@media (max-width: 768px) {
  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .character-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .dimension-panel {
    position: static;
  }
}
</style>
