<template>
  <div class="dimension-wrap">
    <div v-if="!dimensions" class="dim-empty">
      <p class="label-micro">暂无维度数据</p>
    </div>
    <div v-else ref="chartRef" class="dim-chart"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  dimensions: { type: Object, default: null }
})

const chartRef = ref(null)
let chart = null

const LABELS = ['理智', '意志', '情感', '欲望', '信念', '韧性']

function getColor(val) {
  if (val >= 70) return '#DA291C'
  if (val >= 40) return '#8F8F8F'
  return '#D2D2D2'
}

function render() {
  if (!chartRef.value || !props.dimensions) return
  if (chart) { chart.dispose(); chart = null }

  chart = echarts.init(chartRef.value)
  const d = props.dimensions
  const values = [
    d.rationality || 50, d.willpower || 50, d.empathy || 50,
    d.ambition || 50, d.conviction || 50, d.resilience || 50
  ]

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(30,30,30,0.95)',
      borderColor: 'transparent',
      borderRadius: 2,
      padding: [8, 12],
      textStyle: { color: '#fff', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' },
      formatter(params) {
        const v = params.value
        return `<strong>${params.name}</strong>：${v}`
      }
    },
    radar: {
      indicator: LABELS.map((name, i) => ({
        name,
        max: 100,
        axisName: {
          color: '#8F8F8F',
          fontSize: 12,
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontWeight: '400'
        }
      })),
      radius: '68%',
      center: ['50%', '52%'],
      splitNumber: 4,
      axisTick: { show: false },
      axisLine: { show: true, lineStyle: { color: 'rgba(255,255,255,0.1)' } },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.08)', width: 1 } },
      splitArea: { show: false },
      shape: 'polygon'
    },
    series: [{
      type: 'radar',
      data: [{
        value: values,
        name: '六维度',
        lineStyle: {
          color: '#DA291C',
          width: 1.5,
          type: 'solid'
        },
        areaStyle: {
          color: 'rgba(218, 41, 28, 0.15)'
        },
        itemStyle: {
          color: '#DA291C',
          borderColor: 'transparent'
        },
        label: {
          show: true,
          formatter: '{c}',
          fontSize: 11,
          color: '#DA291C',
          fontFamily: 'Arial, Helvetica, sans-serif'
        },
        symbol: 'circle',
        symbolSize: 5
      }]
    }]
  })
}

function handleResize() {
  chart?.resize()
}

watch(() => props.dimensions, () => { render() }, { immediate: false, deep: false })

onMounted(() => {
  if (props.dimensions) render()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  if (chart) { chart.dispose(); chart = null }
})
</script>

<style scoped>
.dimension-wrap {
  width: 100%;
}

.dim-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 280px;
  color: var(--f-color-black-50);
}

.dim-chart {
  width: 100%;
  height: 300px;
}
</style>
