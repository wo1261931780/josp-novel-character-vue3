<template>
  <div class="detail-content">

    <!-- Empty generate state -->
    <div class="empty-card" v-if="character.status === 0">
      <div class="empty-mark" aria-hidden="true">&#9651;</div>
      <h3 class="empty-title">角色详情尚未生成</h3>
      <p class="empty-desc">点击下方按钮，使用 AI 为角色生成完整的详细信息</p>
      <el-button type="primary" size="large" :loading="generating" @click="$emit('generate')">
        生成详情
      </el-button>
    </div>

    <!-- Generated content -->
    <div class="content-sections" v-else>

      <div class="content-row">
        <div class="content-block">
          <p class="label-micro block-label">&#128065; 外貌描写</p>
          <p class="block-text">{{ character.physicalDesc || '暂无描述' }}</p>
        </div>
        <div class="content-block">
          <p class="label-micro block-label">&#129492; 行为举止</p>
          <p class="block-text">{{ character.behaviorDesc || '暂无描述' }}</p>
        </div>
      </div>

      <div class="content-row">
        <div class="content-block">
          <p class="label-micro block-label">&#128172; 语言风格</p>
          <p class="block-text">{{ character.speechStyle || '暂无描述' }}</p>
        </div>
        <div class="content-block">
          <p class="label-micro block-label">&#129504; 心理活动</p>
          <p class="block-text">{{ character.psychological || '暂无描述' }}</p>
        </div>
      </div>

      <div class="content-block content-block--full">
        <p class="label-micro block-label">&#128214; 背景故事</p>
        <p class="block-text">{{ character.backstory || '暂无描述' }}</p>
      </div>

      <div class="content-block content-block--full">
        <p class="label-micro block-label">&#127942; 角色弧线</p>
        <p class="block-text">{{ character.characterArc || '暂无描述' }}</p>
      </div>

      <div class="content-row">
        <div class="content-block">
          <p class="label-micro block-label">&#9889; 技能特长</p>
          <div class="tag-list" v-if="character.skills?.length">
            <span class="content-tag" v-for="(s, i) in parseJson(character.skills)" :key="i">{{ s }}</span>
          </div>
          <p class="block-text" v-else>暂无</p>
        </div>
        <div class="content-block">
          <p class="label-micro block-label">&#128546; 弱点软肋</p>
          <p class="block-text">{{ character.weaknesses || '暂无描述' }}</p>
        </div>
      </div>

      <div class="content-block content-block--full">
        <p class="label-micro block-label">&#127775; 目标追求</p>
        <div class="tag-list" v-if="character.goals?.length">
          <span class="content-tag content-tag--accent" v-for="(g, i) in parseJson(character.goals)" :key="i">{{ g }}</span>
        </div>
        <p class="block-text" v-else>暂无</p>
      </div>

    </div>
  </div>
</template>

<script setup>
defineProps({
  character: { type: Object, required: true },
  generating: { type: Boolean, default: false }
})

defineEmits(['generate'])

function parseJson(str) {
  if (!str) return []
  try {
    const parsed = JSON.parse(str)
    // 防御双重 JSON 编码：第一次解析可能返回字符串（如 AI 返回的转义内容）
    if (typeof parsed === 'string') {
      return JSON.parse(parsed)
    }
    return parsed
  } catch { return [] }
}
</script>

<style scoped>
.detail-content {
  max-width: 800px;
}

/* ============================================
   Empty state
   ============================================ */
.empty-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: var(--sp-60) var(--sp-24);
  gap: var(--sp-12);
}

.empty-mark {
  font-size: 40px;
  color: var(--f-color-accent-100);
  line-height: 1;
  margin-bottom: var(--sp-8);
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--f-color-text-light);
}

.empty-desc {
  font-size: 14px;
  color: var(--f-color-black-50);
  margin-bottom: var(--sp-8);
  max-width: 360px;
}

/* ============================================
   Content sections
   ============================================ */
.content-sections {
  display: flex;
  flex-direction: column;
  gap: var(--sp-32);
}

.content-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-24);
}

.content-block {
  display: flex;
  flex-direction: column;
  gap: var(--sp-10);
}

.content-block--full {
  grid-column: 1 / -1;
}

.block-label {
  color: var(--f-color-black-50);
}

.block-label[aria-hidden] {
  font-size: 14px;
}

.block-text {
  font-size: 14px;
  color: var(--f-color-black-60);
  line-height: 1.8;
  padding: var(--sp-16);
  border-left: 2px solid var(--f-color-ui-20);
}

/* ============================================
   Tags
   ============================================ */
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-8);
}

.content-tag {
  display: inline-block;
  padding: var(--sp-5) var(--sp-12);
  border: 1px solid var(--f-color-ui-20);
  border-radius: var(--radius-default);
  font-size: 12px;
  font-family: var(--font-body);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: var(--f-color-black-60);
}

.content-tag--accent {
  border-color: var(--f-color-accent-100);
  color: var(--f-color-accent-100);
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 768px) {
  .content-row {
    grid-template-columns: 1fr;
  }

  .content-block--full {
    grid-column: 1;
  }
}
</style>
