import request from '@/utils/request'

/**
 * 分析小说文本
 * @param {string} text - 小说文本内容
 * @returns {Promise<NovelTextAnalysisDTO>}
 */
export function analyzeNovelText(text) {
  return request({
    url: '/v1/ai/analyze-novel-text',
    method: 'post',
    data: { text }
  })
}

