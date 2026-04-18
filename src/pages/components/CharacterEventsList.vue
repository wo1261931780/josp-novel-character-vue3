<template>
  <div class="events-timeline">
    <div
      v-for="(event, index) in events"
      :key="event.id"
      class="timeline-item"
    >
      <div class="timeline-marker" :class="markerClass(event.eventType)">
        {{ index + 1 }}
      </div>
      <div class="timeline-content">
        <div class="event-header">
          <h4 class="event-name">{{ event.eventName }}</h4>
          <el-tag size="small" :type="tagType(event.eventType)">
            {{ event.eventType }}
          </el-tag>
        </div>
        <p class="event-desc">{{ event.eventDesc }}</p>
        <div class="event-meta">
          <span class="event-age">年龄：{{ event.age }}岁</span>
          <span class="event-importance">
            重要度：
            <el-rate :model-value="event.importance" disabled size="small" />
          </span>
        </div>
      </div>
    </div>
    <div v-if="events.length === 0" class="empty-events">
      <p>暂无生平经历</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  events: { type: Array, default: () => [] }
})

function markerClass(type) {
  const map = {
    '成长': 'growth', '转折': 'turning', '冲突': 'conflict',
    '成就': 'achievement', '悲剧': 'tragedy'
  }
  return map[type] || 'default'
}

function tagType(type) {
  const map = {
    '成长': 'primary', '转折': 'warning', '冲突': 'danger',
    '成就': 'success', '悲剧': 'info'
  }
  return map[type] || 'info'
}
</script>

<style scoped>
.events-timeline {
  padding: 20px 0;
}

.timeline-item {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  position: relative;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 19px;
  top: 40px;
  bottom: -30px;
  width: 2px;
  background: #e4e7ed;
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-marker {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
  font-size: 16px;
}

.timeline-marker.growth { background: #409eff; }
.timeline-marker.turning { background: #e6a23c; }
.timeline-marker.conflict { background: #f56c6c; }
.timeline-marker.achievement { background: #67c23a; }
.timeline-marker.tragedy { background: #909399; }
.timeline-marker.default { background: #909399; }

.timeline-content {
  flex: 1;
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.event-name {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin: 0;
}

.event-desc {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.event-meta {
  display: flex;
  gap: 20px;
  font-size: 13px;
  color: #999;
}

.event-importance {
  display: flex;
  align-items: center;
  gap: 5px;
}

.event-importance :deep(.el-rate) {
  display: inline-flex;
}

.empty-events {
  text-align: center;
  padding: 60px 0;
  color: #999;
}
</style>
