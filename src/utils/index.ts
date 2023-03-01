import qs from 'qs'
import { isString } from 'lodash'
import { cryptoInstance } from './persagyTools'

/**
 * 获取project id
 * @returns string
 */
export const getProjectIdByUrl = () => {
  const search = location.search.slice(1)
  const searchObj = qs.parse(search)
  if (isString(searchObj.pj)) {
    return cryptoInstance.Decrypt(searchObj.pj)
  }
  if (isString(searchObj.project_id)) {
    return searchObj.project_id
  }
  return ''
}

/**
 * 现代浏览器下载
 * @param blob {blob} 文件流
 * @param fileName {string} 文件名
 */
const downloadByATag = function downloadByATag(blob: Blob, fileName: string) {
  // 支持a标签download的浏览器/rules/strict-boolean-expressions
  const link = document.createElement('a') // 创建a标签
  link.download = fileName // A标签添加属性
  link.style.display = 'none'
  link.href = URL.createObjectURL(blob)
  document.body.appendChild(link)
  link.click() // 执行下载
  URL.revokeObjectURL(link.href) // 释放url
  document.body.removeChild(link) // 释放标签
}
/**
 * IE浏览器下载
 * @param blob {blob} 文件流
 * @param fileName {string} 文件名
 */
const downloadByIE = function downloadByIE(blob: Blob, fileName: string) {
  ;(navigator as any).msSaveBlob(blob, fileName)
}
/**
 * 下载文件
 * @param blob {blob} 文件流
 * @param fileName {string} 文件名
 */
export const downloadFileByBlob = function downloadFileByBlob(blob: Blob, fileName: string) {
  if ('download' in document.createElement('a')) {
    downloadByATag(blob, fileName)
  } else {
    downloadByIE(blob, fileName)
  }
}
