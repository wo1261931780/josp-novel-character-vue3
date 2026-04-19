<template>
  <div class="dashboard-page">
    <!-- ============================================
         Header — Dark Surface
         ============================================ -->
    <header class="dash-header">
      <div class="dash-header-inner">
        <el-button text @click="$router.push('/')" class="back-btn">
          <span aria-hidden="true">&#8592;</span>
          <span class="label-upper">返回首页</span>
        </el-button>
        <div class="header-center">
          <h1 class="dash-title">数据看板</h1>
          <p class="label-micro dash-sub">角色库统计概览</p>
        </div>
        <div class="header-spacer"></div>
      </div>
    </header>

    <!-- ============================================
         Stats Cards — Dark Surface
         ============================================ -->
    <section class="stats-section" v-if="stats.totalCharacters">
      <div class="stats-inner">
        <div class="stat-card" v-for="s in statCards" :key="s.label">
          <p class="label-micro stat-label">{{ s.label }}</p>
          <p class="stat-value">{{ s.value }}</p>
          <p class="stat-note" v-if="s.note">{{ s.note }}</p>
        </div>
      </div>
    </section>

    <!-- ============================================
         Charts — White editorial panels
         ============================================ -->
    <main class="dash-main">
      <div class="dash-main-inner" v-loading="loading">

        <!-- Section: Type Distribution -->
        <section class="chart-section">
          <div class="chart-section-head">
            <p class="label-micro chart-label">分布统计</p>
            <h2 class="chart-title">小说类型分布</h2>
          </div>
          <div class="chart-container">
            <div ref="typeChartRef" class="chart-canvas"></div>
          </div>
        </section>

        <!-- Section: Personality -->
        <section class="chart-section">
          <div class="chart-section-head">
            <p class="label-micro chart-label">性格分布</p>
            <h2 class="chart-title">性格特点统计</h2>
          </div>
          <div class="chart-container">
            <div ref="personalityChartRef" class="chart-canvas"></div>
          </div>
        </section>

        <!-- Section: Monthly Trend — full width -->
        <section class="chart-section chart-section--wide">
          <div class="chart-section-head">
            <p class="label-micro chart-label">趋势分析</p>
            <h2 class="chart-title">月度新增角色</h2>
          </div>
          <div class="chart-container">
            <div ref="trendChartRef" class="chart-canvas"></div>
          </div>
        </section>

        <!-- Empty state -->
        <div class="dash-empty" v-if="!loading && !stats.totalCharacters">
          <div class="empty-mark" aria-hidden="true">&#9651;</div>
          <p class="label-upper empty-title">暂无数据</p>
          <p class="empty-desc">创建角色后数据将显示在这里</p>
          <el-button type="primary" @click="$router.push('/character/create')">
            创建角色
          </el-button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import { getStatsOverview } from '@/api/stats'
import * as echarts from 'echarts'

const loading = ref(false)
const stats = ref({})
const typeChartRef = ref(null)
const personalityChartRef = ref(null)
const trendChartRef = ref(null)

let typeChart = null
let personalityChart = null
let trendChart = null

const statCards = [
  { label: '总角色数', value: 0, note: '' },
  { label: '本月新增', value: 0, note: '' },
  { label: '已完善', value: 0, note: '' },
  { label: '草稿', value: 0, note: '' }
]

async function loadStats() {
  loading.value = true
  try {
    stats.value = await getStatsOverview()
    statCards[0].value = stats.value.totalCharacters || 0
    statCards[1].value = stats.value.monthNewCharacters || 0
    statCards[2].value = stats.value.refinedCount || 0
    statCards[3].value = stats.value.draftCount || 0
    await initCharts()
  } catch (error) {
    console.error('加载失败', error)
  } finally {
    loading.value = false
  }
}

async function initCharts() {
  await new Promise(r => setTimeout(r, 80))
  renderTypeChart()
  renderPersonalityChart()
  renderTrendChart()
}

const FERRARI_COLORS = ['#DA291C', '#8F8F8F', '#666666', '#B01E0A', '#D2D2D2', '#303030', '#F6E500']

function renderTypeChart() {
  if (!typeChartRef.value) return
  if (typeChart) typeChart.dispose()
  typeChart = echarts.init(typeChartRef.value)

  const raw = stats.value.byNovelType || {}
  const data = Object.entries(raw).map(([name, value]) => ({ name, value }))
  const total = data.reduce((s, d) => s + d.value, 0) || 1

  typeChart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(20,20,20,0.97)',
      borderColor: 'transparent',
      borderRadius: '2px',
      padding: [8, 12],
      textStyle: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' },
      formatter: p => `<strong>${p.name}</strong><br/>${p.value} 个角色 (${p.percent}%)`
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      itemWidth: 12,
      itemHeight: 12,
      itemGap: 16,
      textStyle: { color: '#D1D1D1', fontSize: 13, fontFamily: 'Arial, Helvetica, sans-serif' }
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      data: data.length ? data : [{ name: '暂无数据', value: 1 }],
      label: { show: false },
      emphasis: {
        itemStyle: { shadowBlur: 0, shadowOffsetX: 0 }
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 2,
        borderRadius: 2
      }
    }],
    color: FERRARI_COLORS
  })
}

function renderPersonalityChart() {
  if (!personalityChartRef.value) return
  if (personalityChart) personalityChart.dispose()
  personalityChart = echarts.init(personalityChartRef.value)

  const raw = stats.value.byPersonality || {}
  const xData = Object.keys(raw)
  const yData = Object.values(raw)

  personalityChart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20,20,20,0.97)',
      borderColor: 'transparent',
      borderRadius: '2px',
      padding: [8, 12],
      textStyle: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' }
    },
    grid: { left: '3%', right: '8%', bottom: '10%', top: '8%', containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisLine: { lineStyle: { color: '#D2D2D2' } },
      axisTick: { show: false },
      axisLabel: { color: '#BFBFBB', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#BFBFBB', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' }
    },
    series: [{
      type: 'bar',
      data: yData,
      barWidth: '40%',
      itemStyle: {
        color: '#DA291C',
        borderRadius: [2, 2, 0, 0]
      }
    }]
  })
}

function renderTrendChart() {
  if (!trendChartRef.value) return
  if (trendChart) trendChart.dispose()
  trendChart = echarts.init(trendChartRef.value)

  const raw = stats.value.monthlyTrend || {}
  const xData = Object.keys(raw)
  const yData = Object.values(raw)

  trendChart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(20,20,20,0.97)',
      borderColor: 'transparent',
      borderRadius: '2px',
      padding: [8, 12],
      textStyle: { color: '#FFFFFF', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' }
    },
    grid: { left: '3%', right: '6%', bottom: '10%', top: '10%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData,
      axisLine: { lineStyle: { color: '#D2D2D2' } },
      axisTick: { show: false },
      axisLabel: { color: '#BFBFBB', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' }
    },
    yAxis: {
      type: 'value',
      axisLine: { show: false },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(255,255,255,0.06)' } },
      axisLabel: { color: '#BFBFBB', fontSize: 12, fontFamily: 'Arial, Helvetica, sans-serif' }
    },
    series: [{
      type: 'line',
      smooth: false,
      data: yData,
      lineStyle: { color: '#DA291C', width: 2 },
      areaStyle: { color: 'rgba(218,41,28,0.12)' },
      itemStyle: { color: '#DA291C', borderWidth: 2 },
      symbol: 'circle',
      symbolSize: 6
    }]
  })
}

function handleResize() {
  typeChart?.resize()
  personalityChart?.resize()
  trendChart?.resize()
}

onMounted(() => {
  loadStats()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  typeChart?.dispose()
  personalityChart?.dispose()
  trendChart?.dispose()
})
</script>

<style scoped>
/* ============================================
   Page
   ============================================ */
.dashboard-page {
  min-height: 100vh;
  background: var(--f-color-black);
}

/* ============================================
   Header
   ============================================ */
.dash-header {
  background: var(--f-color-ui-90);
  border-bottom: 1px solid rgba(255,255,255,0.06);
}

.dash-header-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: var(--sp-24);
  display: flex;
  align-items: center;
  gap: var(--sp-24);
}

.back-btn {
  display: flex;
  align-items: center;
  gap: var(--sp-8);
  color: #BFBFBB !important;
  border: none !important;
  padding: 0 !important;
  background: transparent !important;
  font-size: 12px !important;
  letter-spacing: 1px;
  text-transform: uppercase;
  transition: color 0.15s !important;
  flex-shrink: 0;
}
.back-btn:hover { color: #FFFFFF !important; background: transparent !important; }
.back-btn span[aria-hidden] { font-size: 16px; }

.header-center { flex: 1; }

.dash-title {
  font-size: 22px;
  font-weight: 500;
  color: var(--f-color-text-dark);
  margin-bottom: var(--sp-4);
}

.dash-sub { color: #BFBFBB; }

.header-spacer { width: 80px; }

/* ============================================
   Stats section
   ============================================ */
.stats-section {
  background: var(--f-color-black);
  padding: var(--sp-32) 0 var(--sp-24);
  border-bottom: 1px solid rgba(255,255,255,0.04);
}

.stats-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--sp-24);
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--sp-20);
}

.stat-card {
  background: var(--f-color-ui-90);
  border-radius: var(--radius-default);
  padding: var(--sp-24);
  border: 1px solid rgba(255,255,255,0.06);
}

.stat-label {
  color: #BFBFBB;
  margin-bottom: var(--sp-10);
}

.stat-value {
  font-size: 40px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1;
  margin-bottom: var(--sp-6);
}

.stat-note {
  font-size: 12px;
  color: #8F8F8F;
}

/* ============================================
   Main content — White panels
   ============================================ */
.dash-main {
  background: var(--f-color-ui-0);
  padding: var(--sp-40) 0 var(--sp-60);
}

.dash-main-inner {
  max-width: var(--max-w);
  margin: 0 auto;
  padding: 0 var(--sp-24);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--sp-24);
}

/* ============================================
   Chart section
   ============================================ */
.chart-section {
  display: flex;
  flex-direction: column;
  gap: var(--sp-20);
}

.chart-section-head {
  display: flex;
  flex-direction: column;
  gap: var(--sp-6);
}

.chart-label {
  color: var(--f-color-black-50);
}

.chart-title {
  font-size: 18px;
  font-weight: 700;
  color: var(--f-color-text-light);
}

.chart-container {
  background: var(--f-color-ui-0);
  border: 1px solid var(--f-color-ui-20);
  border-radius: var(--radius-default);
  padding: var(--sp-20);
}

.chart-canvas {
  width: 100%;
  height: 280px;
}

.chart-section--wide {
  grid-column: 1 / -1;
}

.chart-section--wide .chart-canvas {
  height: 260px;
}

/* ============================================
   Empty
   ============================================ */
.dash-empty {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--sp-80) var(--sp-24);
  text-align: center;
  gap: var(--sp-12);
}

.empty-mark {
  font-size: 40px;
  color: var(--f-color-accent-100);
  margin-bottom: var(--sp-8);
}

.empty-title {
  color: var(--f-color-black-50);
}

.empty-desc {
  font-size: 14px;
  color: var(--f-color-black-60);
  margin-bottom: var(--sp-8);
}

/* ============================================
   Responsive
   ============================================ */
@media (max-width: 960px) {
  .stats-inner {
    grid-template-columns: repeat(2, 1fr);
  }

  .dash-main-inner {
    grid-template-columns: 1fr;
  }

  .chart-section--wide {
    grid-column: 1;
  }
}

@media (max-width: 768px) {
  .dash-header-inner {
    flex-wrap: wrap;
    gap: var(--sp-12);
    padding: var(--sp-16) var(--sp-20);
  }

  .header-spacer { display: none; }

  .stats-inner {
    grid-template-columns: repeat(2, 1fr);
    padding: 0 var(--sp-20);
  }

  .dash-main-inner {
    padding: 0 var(--sp-20);
  }

  .stat-value {
    font-size: 30px;
  }
}

@media (max-width: 480px) {
  .stats-inner {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
