import { LoginParams } from '@/types/Params'
import { UserInfo } from '@/types/common'
import http from '@/utils/http'

/**
 * 通过用户名获取用户信息
 * @param params
 * @returns
 */
export const loginByUserName = (params: LoginParams) =>
  http.post<UserInfo[]>('/EMS_SaaS_Web/Spring/MVC/entrance/unifier/getPersonByUserNameService', params)
