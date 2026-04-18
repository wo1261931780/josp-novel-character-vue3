import request from '@/utils/request'

export function getGenderEnums() {
  return request({ url: '/v1/enums/gender', method: 'get' })
}

export function getPersonalityEnums() {
  return request({ url: '/v1/enums/personality', method: 'get' })
}

export function getBackgroundEnums() {
  return request({ url: '/v1/enums/background', method: 'get' })
}

export function getAppearanceEnums() {
  return request({ url: '/v1/enums/appearance', method: 'get' })
}

export function getBirthplaces(background) {
  return request({ url: '/v1/enums/birthplaces', method: 'get', params: { background } })
}
