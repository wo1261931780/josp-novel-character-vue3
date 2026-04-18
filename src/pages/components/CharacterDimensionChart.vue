<template>
  <div class="dimension-chart" ref="chartRef"></div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'

const props = defineProps({
  dimensions: { type: Object, default: null }
})

const chartRef = ref(null)
let chart = null

const DESCS = {
  '理智': v => v > 70 ? '冷静理性，善于分析' : v > 40 ? '思考与冲动并存' : '易感情用事',
  '意志': v => v > 70 ? '百折不挠，意志如钢' : v > 40 ? '普通意志力' : '轻易动摇放弃',
  '情感': v => v > 70 ? '重情重义，人情味浓' : v > 40 ? '情感能力一般' : '冷漠疏离',
  '欲望': v => v > 70 ? '野心勃勃，渴求权力' : v > 40 ? '有目标追求' : '淡泊无欲',
  '信念': v => v > 70 ? '坚守原则，毫不动摇' : v > 40 ? '有道德底线' : '缺乏立场原则',
  '韧性': v => v > 70 ? '历经苦难，浴火重生' : v > 40 ? '能承受压力' : '脆弱易碎'
}

function render() {
  if (!chartRef.value || !props.dimensions) return
  if (chart) { chart.dispose(); chart = null }

  chart = echarts.init(chartRef.value)
  const d = props.dimensions

  chart.setOption({
    title: {
      text: '命运六维度',
      left: 'center',
      textStyle: { fontSize: 16, fontWeight: 600 }
    },
    tooltip: {
      trigger: 'item',
      formatter(params) {
        const v = params.value
        return `<strong>${params.name}</strong><br/>
                指数：${v} / 100<br/>
                <span style="color:#888">${DESCS[params.name]?.(v) || ''}</span>`
      }
    },
    radar: {
      indicator: [
        { name: '理智', max: 100 }, { name: '意志', max: 100 },
        { name: '情感', max: 100 }, { name: '欲望', max: 100 },
        { name: '信念', max: 100 }, { name: '韧性', max: 100 }
      ],
      radius: '65%',
      center: ['50%', '55%'],
      axisName: { color: '#333', fontSize: 13, fontWeight: 600 },
      splitNumber: 4,
      axisTick: { show: false },
      axisLine: { show: true },
      splitLine: { lineStyle: { color: '#e4e7ed', width: 1 } },
      splitArea: {
        areaStyle: { color: ['#fafafa', '#f5f5f5', '#eeeeee', '#e8e8e8'] }
      }
    },
    series: [{
      type: 'radar',
      data: [{
        value: [
          d.rationality || 50, d.willpower || 50, d.empathy || 50,
          d.ambition || 50, d.conviction || 50, d.resilience || 50
        ],
        name: '六维度',
        lineStyle: { color: '#667eea', width: 2 },
        areaStyle: { color: 'rgba(102, 126, 234, 0.25)' },
        itemStyle: { color: '#667eea' },
        label: { show: true, formatter: '{c}', fontSize: 11, color: '#667eea' }
      }]
    }]
  })
}

watch(() => props.dimensions, () => { render() }, { deep: true })
onMounted(() => { if (props.dimensions) render() })
onBeforeUnmount(() => { if (chart) { chart.dispose(); chart = null } })
</script>

<style scoped>
.dimension-chart {
  width: 100%;
  height: 340px;
}
</style>
