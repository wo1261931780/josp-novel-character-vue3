<template>
  <!-- status=0：尚未生成详情，显示引导卡片 -->
  <div v-if="character.status === 0" class="empty-generate-card">
    <div class="empty-icon">&#128172;</div>
    <h3>角色详情尚未生成</h3>
    <p>点击下方按钮，使用 AI 为角色生成完整的详细信息</p>
    <el-button type="primary" size="large" :loading="generating" @click="$emit('generate')">
      生成详情
    </el-button>
  </div>

  <div v-else class="detail-content">
    <div class="detail-section">
      <h3 class="section-title">
        <span class="icon">&#128065;</span> 外貌描写
      </h3>
      <p class="section-text">{{ character.physicalDesc || '暂无描述' }}</p>
    </div>

    <div class="detail-section">
      <h3 class="section-title">
        <span class="icon">&#129492;</span> 行为举止
      </h3>
      <p class="section-text">{{ character.behaviorDesc || '暂无描述' }}</p>
    </div>

    <div class="detail-section">
      <h3 class="section-title">
        <span class="icon">&#128172;</span> 语言风格
      </h3>
      <p class="section-text">{{ character.speechStyle || '暂无描述' }}</p>
    </div>

    <div class="detail-section">
      <h3 class="section-title">
        <span class="icon">&#129504;</span> 心理活动
      </h3>
      <p class="section-text">{{ character.psychological || '暂无描述' }}</p>
    </div>

    <div class="detail-section">
      <h3 class="section-title">
        <span class="icon">&#128214;</span> 背景故事
      </h3>
      <p class="section-text">{{ character.backstory || '暂无描述' }}</p>
    </div>

    <div class="detail-section">
      <h3 class="section-title">
        <span class="icon">&#127942;</span> 角色弧线
      </h3>
      <p class="section-text">{{ character.characterArc || '暂无描述' }}</p>
    </div>

    <div class="detail-row">
      <div class="detail-section half">
        <h3 class="section-title">
          <span class="icon">&#9889;</span> 技能特长
        </h3>
        <div class="tags-list" v-if="character.skills">
          <el-tag v-for="(skill, idx) in parseJsonArray(character.skills)" :key="idx" type="primary">
            {{ skill }}
          </el-tag>
        </div>
        <p v-else class="section-text">暂无</p>
      </div>

      <div class="detail-section half">
        <h3 class="section-title">
          <span class="icon">&#128546;</span> 弱点软肋
        </h3>
        <p class="section-text">{{ character.weaknesses || '暂无描述' }}</p>
      </div>
    </div>

    <div class="detail-section">
      <h3 class="section-title">
        <span class="icon">&#127775;</span> 目标追求
      </h3>
      <div class="tags-list" v-if="character.goals">
        <el-tag v-for="(goal, idx) in parseJsonArray(character.goals)" :key="idx" type="success">
          {{ goal }}
        </el-tag>
      </div>
      <p v-else class="section-text">暂无</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  character: { type: Object, required: true },
  generating: { type: Boolean, default: false }
})

defineEmits(['generate'])

function parseJsonArray(str) {
  if (!str) return []
  try {
    return JSON.parse(str)
  } catch {
    return []
  }
}
</script>

<style scoped>
.detail-content {
  padding: 10px;
}

.detail-section {
  margin-bottom: 30px;
}

.section-title {
  font-size: 18px;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title .icon {
  font-size: 22px;
}

.section-text {
  font-size: 15px;
  color: #666;
  line-height: 1.8;
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  margin: 0;
}

.detail-row {
  display: flex;
  gap: 30px;
}

.detail-section.half {
  flex: 1;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-generate-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 40px;
  text-align: center;
  background: #f9fafb;
  border-radius: 12px;
  margin: 20px 0;
}

.empty-generate-card .empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-generate-card h3 {
  font-size: 22px;
  color: #333;
  margin: 0 0 12px 0;
}

.empty-generate-card p {
  font-size: 15px;
  color: #888;
  margin: 0 0 30px 0;
  max-width: 400px;
}
</style>
