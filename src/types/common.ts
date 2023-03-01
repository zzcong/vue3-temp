/* eslint-disable camelcase */
export interface BaseResponse<T> {
  [x: string]: any
  result: string
  code: string
  traceId: string
  timestamp: string
  data: T
  content: T
  message?: string
}
export type HttpResponse<T> = Promise<BaseResponse<T>>
/**
 * 用户项目
 */
export interface Project extends Record<string, any> {
  detailAddress: string
  functionType: string
  groupCode: string
  latitude: string
  liveStatus: string
  longitude: string
  partitionAbbr: string
  productLine: string
  projName: string
  projectId: string
  projectLocalID: string
  projectLocalName: string
  projectName: string
  projectPicture: string
  totalArea: string
}
/**
 * 用户权限R1
 */
export interface AuthorizationR1 extends Record<string, any> {
  authorizationName: string
  authorizationParentId: string
  authorizationId: string
  objType: string
}
/**
 * 用户权限F2
 */
export interface AuthorizationF2 extends AuthorizationR1 {
  productId: string
  productIconKey: string
  productOrder: string
  iconKey: string
  functionUrl: string
  type: string
  productName: string
  menuIconKey: string
  productUrl: string
}
/**
 * 用户信息
 */
export interface UserInfo extends Record<string, any> {
  pd: string
  user_id: string
  person_id: string
  userName: string
  userId: string
  groupCode: string
  group_code: string
  isAdmin: string
  resultType: string
  projects: Project[]
  authorizations: Array<AuthorizationR1 | AuthorizationF2>
}
/**
 * 基础Store
 */
export interface BaseStore extends Record<string, any> {
  userInfo: UserInfo
  project_id: string
  authId: string[] | []
}
