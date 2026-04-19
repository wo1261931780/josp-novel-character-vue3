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

  const validEvents = (props.events || [])
    .filter(e => e && e.age != null && e.age !== undefined)
    .sort((a, b) => Number(a.age) - Number(b.age))

  if (validEvents.length === 0) return

  // ========== 核心修复1：x轴范围 = 真实数据范围，不要用角色寿命 ==========
  const ages = validEvents.map(e => Number(e.age) || 0)
  const minAge = Math.min(...ages)
  const maxEventAge = Math.max(...ages)
  // x轴从事件最小年龄-2开始，到事件最大年龄+15结束
  const xMin = Math.max(0, minAge - 2)
  const xMax = maxEventAge + 15

  // ========== 核心修复2：Y轴用数值型(category轴对小数处理有歧义) ==========
  // 每个类型占一个整数区段[0,1),[1,2),...组内用小数偏移展开
  const scatterData = validEvents.map(e => {
    const baseY = getTypeIndex(e.eventType)
    // 同年龄+同类型的事件，依次向下偏移0.2
    const sameAgeSameTypeEvents = validEvents.filter(
      o => o.eventType === e.eventType && Number(o.age) === Number(e.age)
    )
    const idxInGroup = sameAgeSameTypeEvents.findIndex(
      o => String(o.id) === String(e.id)
    )
    // 偏移量：第0个0.0，第1个0.2，第2个0.4...
    const yOffset = idxInGroup * 0.25
    const yValue = baseY + yOffset

    return {
      name: String(e.eventName || '未知事件'),
      value: [
        Number(e.age),
        yValue,
        String(e.eventName || ''),
        String(e.eventType || ''),
        Number(e.importance) || 3
      ],
      itemStyle: {
        color: COLORS[e.eventType] || '#909399'
      }
    }
  })

  // 找出需要显示label的事件（太多会乱，只显示每个年龄每个类型的第一个）
  const labelEvents = new Set(
    validEvents
      .filter(e => {
        const sameAgeSameType = validEvents.filter(
          o => o.eventType === e.eventType && Number(o.age) === Number(e.age)
        )
        return sameAgeSameType[0] === e
      })
      .map(e => String(e.id))
  )

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(50,50,50,0.95)',
      borderColor: 'transparent',
      borderRadius: 8,
      padding: [10, 14],
      textStyle: { color: '#fff', fontSize: 13 },
      formatter(params) {
        const v = params.data.value
        const stars = '★'.repeat(v[4]) + '☆'.repeat(5 - v[4])
        return `<strong>${v[2]}</strong><br/>
                类型：<span style="color:${COLORS[v[3]]}">${v[3]}</span><br/>
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
      left: 80,
      right: 60,
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
      min: xMin,
      max: xMax,
      // interval按数据范围动态计算，每10-20岁一个刻度
      minInterval: 1,
      axisLine: { lineStyle: { color: '#c0c4cc' } },
      axisTick: { lineStyle: { color: '#c0c4cc' } },
      axisLabel: {
        fontSize: 12,
        color: '#666',
        formatter: val => String(Math.round(val))
      },
      splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } }
    },
    yAxis: {
      type: 'value',
      // Y轴范围覆盖5个类型，每类型占1个单位(0-4)
      min: -0.3,
      max: CATEGORIES.length - 1 + 1,
      // 每1个单位一个刻度，刚好对齐类型
      interval: 1,
      name: '事件类型',
      nameLocation: 'middle',
      nameGap: -55,
      nameTextStyle: { fontSize: 13 },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 12,
        color: '#333',
        formatter(val) {
          const idx = Math.round(val)
          if (idx >= 0 && idx < CATEGORIES.length) {
            return CATEGORIES[idx]
          }
          return ''
        }
      },
      splitLine: { lineStyle: { color: '#f0f2f5', type: 'dashed' } }
    },
    series: [{
      type: 'scatter',
      name: '角色事件',
      data: scatterData,
      symbolSize(data) {
        const imp = Number(data[4]) || 3
        return 8 + imp * 4
      },
      label: {
        show: true,
        position: 'right',
        distance: 8,
        formatter(p) {
          return p.data.value[0] + '岁'
        },
        fontSize: 11,
        color: '#666'
      },
      labelLayout: {
        hideOverlap: true
      }
    }]
  }

  chart = echarts.init(chartRef.value)
  try {
    chart.setOption(option, true)
  } catch (err) {
    console.error('ECharts 渲染失败:', err)
  }
}

function handleResize() {
  if (chart) chart.resize()
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
  min-height: 420px;
}

.timeline-chart {
  width: 100%;
  height: 480px;
}

.chart-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  color: #999;
  font-size: 15px;
}
</style>
