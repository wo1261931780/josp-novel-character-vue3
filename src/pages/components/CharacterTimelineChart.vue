<template>
  <div class="timeline-chart-wrapper">
    <div v-if="!events || events.length === 0" class="chart-empty">
      <div class="empty-mark" aria-hidden="true">&#9651;</div>
      <p>暂无事件数据</p>
    </div>
    <div v-show="events && events.length > 0" ref="wrapperRef" class="timeline-chart"></div>
  </div>
</template>

<script setup>
// JOSP-novelCharacterVue3
import { ref, watch, onMounted, onUpdated, onBeforeUnmount, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  events: { type: Array, default: () => [] },
  maxAge: { type: Number, default: 100 }
})

const wrapperRef = ref(null)
let chart = null
let resizeObserver = null
let pendingRender = false

const CATEGORIES = ['成长', '转折', '冲突', '成就', '悲剧']

// Ferrari Design: 只用 #DA291C + 白/灰。5个类型用透明度区分
const TYPE_ALPHA = {
  '成长': 0.95,
  '转折': 0.75,
  '冲突': 0.60,
  '成就': 0.85,
  '悲剧': 0.50,
}
const TYPE_LABEL_COLOR = {
  '成长': '#FFFFFF',
  '转折': '#D1D1D1',
  '冲突': '#BFBFBB',
  '成就': '#E8E8E8',
  '悲剧': '#8F8F8F',
}

function getTypeIndex(type) {
  const idx = CATEGORIES.indexOf(type || '')
  return idx >= 0 ? idx : 0
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}

function buildChart() {
  if (!wrapperRef.value) return

  // 延迟到 DOM 可见（v-show="false" → true 时立即调用会得到 0 尺寸）
  const { width, height } = wrapperRef.value.getBoundingClientRect()
  if (width === 0 || height === 0) {
    pendingRender = true
    return
  }

  if (chart) {
    chart.dispose()
    chart = null
  }

  const validEvents = (props.events || [])
    .filter(e => e && e.age != null)
    .sort((a, b) => Number(a.age) - Number(b.age))

  if (validEvents.length === 0) return

  // X轴范围：按事件实际年龄范围，而非角色寿命
  const ages = validEvents.map(e => Number(e.age) || 0)
  const minAge = Math.min(...ages)
  const maxEventAge = Math.max(...ages)
  const xMin = Math.max(0, minAge - 2)
  const xMax = maxEventAge + 15

  // 散点数据：Y轴按类型分组，组内同年龄事件用小数偏移展开
  const scatterData = validEvents.map(e => {
    const baseY = getTypeIndex(e.eventType)
    const sameGroup = validEvents.filter(
      o => o.eventType === e.eventType && Number(o.age) === Number(e.age)
    )
    const idxInGroup = sameGroup.findIndex(
      o => String(o.id) === String(e.id)
    )
    const yValue = baseY + idxInGroup * 0.25
    const imp = Number(e.importance) || 3
    const typeKey = e.eventType || '成长'

    return {
      name: String(e.eventName || '未知事件'),
      value: [Number(e.age), yValue, String(e.eventName || ''), typeKey, imp],
      itemStyle: {
        color: hexToRgba('#DA291C', TYPE_ALPHA[typeKey] || 0.80)
      },
      // 重要事件 symbolSize 更大
      symbolSize: 8 + imp * 4
    }
  })

  // Y轴刻度标签：每个类型只显示整数位置的名字
  const yAxisLabelData = CATEGORIES.map((cat, i) => ({
    value: i,
    textStyle: { color: TYPE_LABEL_COLOR[cat] || '#D1D1D1' }
  }))

  chart = echarts.init(wrapperRef.value)
  chart.setOption({
    backgroundColor: 'transparent',

    // Tooltip — 深色背景，高对比度白色文字
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(15,15,15,0.97)',
      borderColor: 'rgba(255,255,255,0.08)',
      borderWidth: 1,
      borderRadius: 2,
      padding: [10, 14],
      textStyle: {
        color: '#FFFFFF',
        fontSize: 13,
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      formatter(params) {
        const v = params.data.value
        const stars = '★'.repeat(v[4]) + '☆'.repeat(5 - v[4])
        return `<strong style="color:#DA291C">${v[2]}</strong><br/>
                <span style="color:#BFBFBB">类型：${v[3]}</span><br/>
                <span style="color:#BFBFBB">年龄：${v[0]}岁</span><br/>
                <span style="color:#BFBFBB">重要度：${stars}</span>`
      }
    },

    // 图例 — 深色背景白色文字
    legend: {
      data: CATEGORIES,
      top: 36,
      textStyle: { color: '#BFBFBB', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' },
      itemWidth: 14,
      itemHeight: 10,
      itemGap: 20
    },

    grid: {
      left: 88,
      right: 72,
      top: 88,
      bottom: 60,
      containLabel: false
    },

    // X轴 — 年龄（白色文字，高对比度）
    xAxis: {
      type: 'value',
      name: '年龄（岁）',
      nameLocation: 'middle',
      nameGap: 34,
      nameTextStyle: {
        color: '#D1D1D1',
        fontSize: 13,
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      min: xMin,
      max: xMax,
      minInterval: 1,
      axisLine: {
        lineStyle: { color: 'rgba(255,255,255,0.18)' }
      },
      axisTick: {
        lineStyle: { color: 'rgba(255,255,255,0.18)' }
      },
      axisLabel: {
        fontSize: 12,
        color: '#D1D1D1',
        fontFamily: 'Arial, Helvetica, sans-serif',
        formatter: val => String(Math.round(val))
      },
      // 极淡网格线，不干扰阅读
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.06)', type: 'dashed', width: 1 }
      }
    },

    // Y轴 — 事件类型（白色文字，隐藏轴线）
    yAxis: {
      type: 'category',
      data: CATEGORIES,
      name: '事件类型',
      nameLocation: 'middle',
      nameGap: -62,
      nameTextStyle: {
        color: '#D1D1D1',
        fontSize: 13,
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: {
        fontSize: 12,
        color: '#D1D1D1',
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      // 细网格线
      splitLine: {
        lineStyle: { color: 'rgba(255,255,255,0.04)', type: 'dashed', width: 1 }
      }
    },

    series: [{
      type: 'scatter',
      name: '角色事件',
      data: scatterData,
      symbolSize(data) {
        return data.symbolSize || 18
      },
      // 重要事件加光晕
      emphasis: {
        itemStyle: {
          shadowBlur: 12,
          shadowColor: 'rgba(218,41,28,0.6)'
        },
        scale: 1.3
      },
      label: {
        show: true,
        position: 'right',
        distance: 8,
        formatter(p) {
          return p.data.value[0] + '岁'
        },
        fontSize: 11,
        color: '#D1D1D1',
        fontFamily: 'Arial, Helvetica, sans-serif'
      },
      labelLayout: {
        hideOverlap: true,
        moveOverlap: 'shiftRight'
      }
    }]
  }, true)
}

function scheduleRender() {
  pendingRender = true
}

watch(
  () => [props.events, props.maxAge],
  async () => {
    await nextTick()
    if (pendingRender) {
      pendingRender = false
      // 等 v-show 真正让元素可见后再渲染
      requestAnimationFrame(() => {
        requestAnimationFrame(() => buildChart())
      })
    } else {
      buildChart()
    }
  },
  { immediate: false, deep: false }
)

onMounted(async () => {
  await nextTick()
  // DOM 可能刚从 v-show=false 变为可见，立即取尺寸仍为0
  requestAnimationFrame(() => {
    requestAnimationFrame(() => buildChart())
  })

  // 监听容器尺寸变化（窗口resize或tab切换后重新渲染）
  if (wrapperRef.value) {
    resizeObserver = new ResizeObserver(() => {
      if (chart) {
        chart.resize()
      } else if (wrapperRef.value) {
        const { width, height } = wrapperRef.value.getBoundingClientRect()
        if (width > 0 && height > 0) {
          pendingRender = true
          buildChart()
        }
      }
    })
    resizeObserver.observe(wrapperRef.value)
  }

  window.addEventListener('resize', handleResize)
})

// 捕获 tab 切换后 v-show 变为可见的时机（props 不变，watch 不触发）
onUpdated(async () => {
  await nextTick()
  if (!chart && wrapperRef.value) {
    const { width, height } = wrapperRef.value.getBoundingClientRect()
    if (width > 0 && height > 0) {
      buildChart()
    }
  }
})

function handleResize() {
  if (chart) chart.resize()
}

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  resizeObserver?.disconnect()
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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-12);
  height: 400px;
  color: var(--f-color-black-50);
  font-size: 15px;
  font-family: var(--font-body);
}

.empty-mark {
  font-size: 36px;
  color: var(--f-color-accent-100);
  line-height: 1;
}
</style>
