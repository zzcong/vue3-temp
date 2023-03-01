/* eslint-disable no-param-reassign */
/* eslint-disable max-statements */
/* eslint-disable no-console */
/* eslint-disable camelcase */
import qs from 'qs'
import cookie from 'js-cookie'
import axios, { AxiosResponse, CreateAxiosDefaults, AxiosInstance } from 'axios'
import { isEmpty, isNull } from 'lodash'
import { getProjectIdByUrl, downloadFileByBlob } from './index'
import { systemInstance } from '@/utils/persagyTools'

import { HttpResponse } from '@/types/common'

const jsonStringArray = [
  'ems-saas-web',
  'isagy_saas_web',
  'EMS_SaaS_Web',
  'saas-version-app',
  'environment_saas_web',
  'environment-saas-web',
  'engineeringSafety-saas-web',
  'equip-run-manager',
  'finein_saas_web',
  'gateway-server'
]

/**
 *  判断请求是否需要 formdata 提交
 * @param url 请求的地址
 */
const diffPost = function diffPost(url: string): boolean {
  return jsonStringArray.some(item => url.includes(item))
}

/**
 * 获取需合并到请求头中的参数
 * @returns params
 */
const getMergeReqParams = function getMergeReqParams() {
  const userInfoStr = systemInstance.queryUser()
  const userInfo = isNull(userInfoStr) ? {} : JSON.parse(userInfoStr)
  const { pd = '', user_id = '', person_id = '', userName = '', userId: userCode = '' } = userInfo
  const groupCode = isEmpty(userInfo.groupCode) ? cookie.get('groupCode') : userInfo.groupCode
  const token = cookie.get('token') || ''
  const project_id = getProjectIdByUrl()
  return { user_id, pd, person_id, userName, userCode, groupCode, token, project_id }
}

/**
 * 下载
 * @param response filestream
 */
const download = function download(response: AxiosResponse) {
  const { data, config } = response
  let configData: Record<string, string> = {}
  let mimeType = ''

  configData =
    Object.prototype.toString.call(response.config.data) === '[Object Object]' ? config.data : JSON.parse(config.data)
  mimeType = response.config.data.mimeType

  const blob = !isEmpty(mimeType) ? new Blob([data], { type: mimeType }) : new Blob([data])

  downloadFileByBlob(blob, configData.fileName)
}

/**
 * 错误统一处理
 */
const errHandle = function errHandle(err: any) {
  const res = err.response
  switch (res.status) {
    case 403:
      console.log('服务器拒绝请求！')
      break
    case 404:
      console.log('页面或方法不存在！')
      break
    case 405:
      console.log('请求方法出错！')
      break
    case 500:
      console.log('服务器内部错误！')
      break
    case 503:
      console.log('服务器内部错误！')
      break
    case 504:
      console.log('请求超时！')
      break
    default:
      console.log('%s', '出错了，请稍后再试！')
  }
}

class Http {
  private config: CreateAxiosDefaults<any>
  private instance: AxiosInstance
  public constructor(config: CreateAxiosDefaults) {
    this.config = config
    this.instance = axios.create(this.config)
    this.init()
  }
  public get<T>(url: string, data: Record<string, any> = {}, config: Record<string, any> = {}): HttpResponse<T> {
    config.params = data
    return new Promise((resolve, reject) => {
      this.instance.get(url, config).then(
        res => {
          resolve(res.data)
        },
        err => {
          reject(err)
        }
      )
    })
  }
  public post<T>(url: string, data: Record<string, any> = {}, config: Record<string, any> = {}): HttpResponse<T> {
    return new Promise((resolve, reject) => {
      this.instance.post(url, data, config).then(
        res => {
          resolve(res.data)
        },
        err => {
          reject(err)
        }
      )
    })
  }
  public download(url: string, data: Record<string, any> = {}, config: Record<string, any> = {}): void {
    config.responseType = 'blob'
    this.post(url, data, config)
  }
  private init() {
    this.instance.interceptors.request.use(
      (config: any) => {
        const needformdata = diffPost(config.url)
        // 公共参数
        const params = getMergeReqParams()
        Object.assign(config.headers, {
          groupcode: params.groupCode,
          userid: params.user_id,
          username: params.userName,
          token: params.token
        })

        // 运维系统需要额外的参数
        if (!isEmpty(config.url) && (config.url as string).includes('EMS_SaaS_Web')) {
          Object.assign(params, {
            puser: {
              loginDevice: 'PC',
              userId: params.user_id,
              pd: params.pd
            }
          })
        }
        // 合并参数
        if (config.headers.mergeParams !== false) {
          config.method === 'post'
            ? (config.data = Object.assign(params, config.data))
            : (config.params = Object.assign(params, config.params))
        }
        // 修改接口请求方式
        if (config.method === 'post' && needformdata) {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
          config.data = qs.stringify({ jsonString: JSON.stringify(config.data) })
        }
        return config
      },
      error => Promise.reject(error)
    )
    this.instance.interceptors.response.use(
      response => {
        // 如果responseType='blob'  则是下载文件
        if (response.request.responseType === 'blob') {
          download(response)
        }

        const { data: configData } = response.config
        if (
          (response.data.code === '00000' || response.data.resultCode === '00000') &&
          response.data.result === 'success'
        ) {
          return response
        }
        // 是否自动处理错误
        const autoHandleError = !(configData as string).includes('autoHandleError=false')
        if (autoHandleError) {
          console.error(
            isEmpty(response.data.message || response.data.ResultMsg)
              ? '服务器异常'
              : response.data.message || response.data.ResultMsg
          )
          return Promise.reject(response)
        }
        return response
      },
      error => {
        errHandle(error.response)
        return Promise.reject(error.response)
      }
    )
  }
}

const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.MODE === 'development' ? '/api' : '/',
  timeout: 24 * 60 * 60 * 1000,
  headers: {
    post: {
      'Content-Type': 'application/json'
    }
  }
}

export default new Http(config)
