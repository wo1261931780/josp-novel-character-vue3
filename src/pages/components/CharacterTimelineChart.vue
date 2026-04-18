<template>
  <div class="timeline-chart-wrapper">
    <div v-if="!events || events.length === 0" class="chart-empty">
      <p>暂无事件数据</p>
    </div>
    <div v-show="events && events.length > 0" ref="chartRef" class="timeline-chart"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  events: { type: Array, default: () => [] },
  maxAge: { type: Number, default: 100 }
})

const chartRef = ref(null)
let chart = null

// 事件类型配置（顺序与 y 轴对齐）
const CATEGORIES = ['成长', '转折', '冲突', '成就', '悲剧']
const COLORS = {
  '成长': '#409eff',
  '转折': '#e6a23c',
  '冲突': '#f56c6c',
  '成就': '#67c23a',
  '悲剧': '#909399'
}

function getTypeIndex(type) {
  if (!type) return 0
  const idx = CATEGORIES.indexOf(type)
  return idx >= 0 ? idx : 0
}

function buildChart() {
  if (!chartRef.value) return
  if (chart) {
    chart.dispose()
    chart = null
  }

  const validEvents = (props.events || []).filter(e => e && e.age != null)
  if (validEvents.length === 0) return

  chart = echarts.init(chartRef.value)

  // 计算 x 轴范围
  const ages = validEvents.map(e => Number(e.age) || 0)
  const maxEventAge = Math.max(...ages)
  // 至少显示到 maxAge + 10，且最小为 40（确保有足够空间展示）
  const chartMaxAge = Math.max(maxEventAge + 10, Number(props.maxAge) || 0, 40)

  // 计算合适的刻度间隔：让 x 轴显示约 6-8 个刻度
  const niceMax = chartMaxAge
  // 用 ECharts 内部算法找"漂亮数字"作为 interval
  const rawInterval = niceMax / 6
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawInterval)))
  const normalized = rawInterval / magnitude
  let niceInterval = magnitude
  if (normalized <= 1) niceInterval = 1 * magnitude
  else if (normalized <= 2) niceInterval = 2 * magnitude
  else if (normalized <= 5) niceInterval = 5 * magnitude
  else niceInterval = 10 * magnitude

  // 按类型分组计算组内偏移，避免同类型事件重叠
  const scatterData = validEvents.map(e => {
    const baseY = getTypeIndex(e.eventType)
    // 统计同类型中年龄 ≤ 当前事件的个数（用于垂直偏移）
    const sameTypeCount = validEvents.filter(
      o => o.eventType === e.eventType && Number(o.age) <= Number(e.age)
    ).length
    // 组内偏移：从 0 开始，每个同类型事件向下偏移 0.35
    const yOffset = (sameTypeCount - 1) * 0.35
    return {
      name: String(e.eventName || '未知事件'),
      value: [
        Number(e.age),              // x = 年龄（数值）
        baseY + yOffset,           // y = 类型index + 组内偏移
        String(e.eventName || ''),
        String(e.eventType || ''),
        Number(e.importance) || 3
      ],
      itemStyle: {
        color: COLORS[e.eventType] || '#909399'
      }
    }
  })

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(255,255,255,0.97)',
      borderColor: '#e4e7ed',
      borderWidth: 1,
      borderRadius: 6,
      padding: [10, 14],
      textStyle: { color: '#333', fontSize: 13 },
      formatter(params) {
        const v = params.data.value
        const stars = '★'.repeat(v[4]) + '☆'.repeat(5 - v[4])
        return `<strong>${v[2]}</strong><br/>
                类型：<span style="color:${COLORS[v[3]] || '#666'}">${v[3]}</span><br/>
                年龄：${v[0]}岁<br/>
                重要度：${stars}`
      }
    },
    legend: {
      data: CATEGORIES,
      top: 36,
      textStyle: { fontSize: 12 },
      itemWidth: 14,
      itemHeight: 10
    },
    grid: {
      left: 70,
      right: 80,
      top: 80,
      bottom: 60,
      containLabel: false
    },
    xAxis: {
      type: 'value',
      name: '年龄（岁）',
      nameLocation: 'middle',
      nameGap: 32,
      nameTextStyle: { fontSize: 13 },
      min: 0,
      max: niceMax,
      // 关键！显式设置 interval，并加 boundaryGap: false
      interval: niceInterval,
      boundaryGap: false,
      axisLine: { lineStyle: { color: '#c0c4cc' } },
      axisTick: { lineStyle: { color: '#c0c4cc' } },
      axisLabel: {
        fontSize: 12,
        color: '#666',
        formatter: val => String(val)
      },
      splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } }
    },
    yAxis: {
      type: 'category',
      data: CATEGORIES,
      name: '事件类型',
      nameLocation: 'middle',
      nameGap: -50,
      nameTextStyle: { fontSize: 13 },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 13, color: '#333' }
    },
    series: [{
      type: 'scatter',
      name: '角色事件',
      data: scatterData,
      symbolSize(data) {
        const imp = Number(data[4]) || 3
        return 8 + imp * 4  // importance 3→20px, 4→24px, 5→28px
      },
      label: {
        show: true,
        position: 'right',
        distance: 10,
        formatter(p) {
          return p.data.value[0] + '岁'
        },
        fontSize: 11,
        color: '#909399'
      }
    }]
  }

  try {
    chart.setOption(option, true)
  } catch (err) {
    console.error('ECharts 渲染失败:', err)
  }
}

function handleResize() {
  if (chart) {
    chart.resize()
  }
}

watch(
  () => [props.events, props.maxAge],
  async () => {
    await nextTick()
    buildChart()
  },
  { immediate: false, deep: false }
)

onMounted(async () => {
  await nextTick()
  buildChart()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
.timeline-chart-wrapper {
  width: 100%;
  min-height: 400px;
}

.timeline-chart {
  width: 100%;
  height: 420px;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
  fontSize: 15px;
}
</style>
