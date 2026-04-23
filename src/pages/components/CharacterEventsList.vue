<template>
  <div class="events-list">
    <div class="events-empty" v-if="!events || events.length === 0">
      <p class="label-upper">暂无生平经历</p>
    </div>

    <div class="events-scroll" v-else>
      <article
        class="event-card"
        v-for="(event, index) in events"
        :key="event.id"
      >
        <div class="event-card-left">
          <div class="event-num label-micro">{{ String(index + 1).padStart(2, '0') }}</div>
          <div class="event-line" v-if="index < events.length - 1"></div>
        </div>

        <div class="event-card-body">
          <div class="event-card-head">
            <h4 class="event-name">{{ event.eventName }}</h4>
            <span class="event-type-tag" :class="typeClass(event.eventType)">
              {{ event.eventType }}
            </span>
          </div>
          <p class="event-desc">{{ event.eventDesc }}</p>
          <div class="event-meta">
            <span class="label-micro event-age">&#9679; {{ event.age }}岁</span>
            <div class="event-stars">
              <span
                v-for="s in 5"
                :key="s"
                class="star"
                :class="{ filled: s <= (Number(event.importance) || 3) }"
                aria-hidden="true"
              >&#9733;</span>
            </div>
          </div>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
// JOSP-novelCharacterVue3
defineProps({
  events: { type: Array, default: () => [] }
})

const TYPE_CLASS = {
  '成长': 'type--growth',
  '转折': 'type--turning',
  '冲突': 'type--conflict',
  '成就': 'type--achievement',
  '悲剧': 'type--tragedy'
}

function typeClass(type) {
  return TYPE_CLASS[type] || 'type--default'
}
</script>

<style scoped>
.events-list {
  max-width: 800px;
}

.events-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--sp-60) 0;
  color: var(--f-color-black-50);
}

.events-scroll {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* ============================================
   Event card
   ============================================ */
.event-card {
  display: flex;
  gap: var(--sp-20);
}

.event-card-left {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex-shrink: 0;
  width: 40px;
}

.event-num {
  width: 40px;
  height: 40px;
  background: var(--f-color-black);
  color: var(--f-color-text-dark);
  border-radius: var(--radius-default);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-family: var(--font-body);
  letter-spacing: 1px;
  flex-shrink: 0;
  z-index: 1;
}

.event-line {
  flex: 1;
  width: 1px;
  background: var(--f-color-ui-20);
  margin: var(--sp-4) 0;
  min-height: var(--sp-20);
}

.event-card-body {
  flex: 1;
  padding-bottom: var(--sp-30);
}

.event-card-head {
  display: flex;
  align-items: baseline;
  gap: var(--sp-12);
  margin-bottom: var(--sp-10);
  flex-wrap: wrap;
}

.event-name {
  font-size: 16px;
  font-weight: 700;
  color: var(--f-color-text-light);
  line-height: 1.3;
}

/* Event type tag */
.event-type-tag {
  display: inline-block;
  padding: var(--sp-3) var(--sp-8);
  border: 1px solid;
  border-radius: var(--radius-default);
  font-size: 10px;
  font-family: var(--font-body);
  letter-spacing: 1px;
  text-transform: uppercase;
}

.type--growth   { border-color: #409EFF; color: #409EFF; }
.type--turning  { border-color: #E6A23C; color: #E6A23C; }
.type--conflict { border-color: var(--f-color-accent-100); color: var(--f-color-accent-100); }
.type--achievement { border-color: var(--f-color-success); color: var(--f-color-success); }
.type--tragedy  { border-color: var(--f-color-black-50); color: var(--f-color-black-50); }
.type--default  { border-color: var(--f-color-ui-20); color: var(--f-color-black-50); }

.event-desc {
  font-size: 14px;
  color: var(--f-color-black-60);
  line-height: 1.7;
  margin-bottom: var(--sp-12);
}

.event-meta {
  display: flex;
  align-items: center;
  gap: var(--sp-16);
}

.event-age {
  color: var(--f-color-black-55);
}

.event-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 12px;
  color: var(--f-color-ui-20);
}

.star.filled {
  color: var(--f-color-accent-100);
}
</style>
