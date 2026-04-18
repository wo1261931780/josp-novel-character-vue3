<template>
  <div class="character-header">
    <div class="avatar-placeholder">
      <span>{{ character.name?.charAt(0) }}</span>
    </div>
    <div class="header-info">
      <h1 class="character-name">{{ character.name }}</h1>
      <div class="basic-tags">
        <el-tag :type="genderType">
          {{ character.genderText }}
        </el-tag>
        <el-tag type="info">{{ character.age }}岁</el-tag>
        <el-tag type="warning">{{ character.personality }}</el-tag>
        <el-tag>{{ character.background }}</el-tag>
        <el-tag type="success">{{ character.novelTypeName || '未分类' }}</el-tag>
      </div>
      <div class="status-row">
        <span class="status-label">状态：</span>
        <el-tag :type="statusType">
          {{ character.statusText }}
        </el-tag>
        <el-button
          v-if="character.status === 0"
          type="primary"
          size="small"
          :loading="generating"
          @click="$emit('generate')"
        >
          生成详情
        </el-button>
        <el-button
          v-else-if="character.status === 1"
          type="warning"
          size="small"
          :loading="generating"
          @click="$emit('generate')"
        >
          重新生成
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="$emit('delete')"
        >
          删除角色
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  character: { type: Object, required: true },
  generating: { type: Boolean, default: false }
})

defineEmits(['generate', 'delete'])

const genderType = computed(() => {
  const map = { 0: 'danger', 1: '', 2: 'warning' }
  return map[props.character.gender] || 'info'
})

const statusType = computed(() => {
  const map = { 0: 'info', 1: 'success', 2: 'warning' }
  return map[props.character.status] || 'info'
})
</script>

<style scoped>
.character-header {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 30px;
  display: flex;
  gap: 30px;
  box-shadow: 0 10px 40px rgba(102, 126, 234, 0.3);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #fff;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
  color: #fff;
}

.character-name {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 15px 0;
}

.basic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
}

.basic-tags .el-tag {
  border: none;
}

.status-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-label {
  font-size: 14px;
  opacity: 0.9;
}
</style>
