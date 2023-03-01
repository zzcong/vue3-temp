import { createRouter, createWebHistory } from 'vue-router'
import { qiankunWindow } from 'vite-plugin-qiankun/dist/helper'

import { isEmpty } from 'lodash'
import useStore from '@/store'
import routes from './routes'
import { cryptoInstance } from '@/utils/persagyTools'

const history = createWebHistory(
  // eslint-disable-next-line no-underscore-dangle
  (qiankunWindow.__POWERED_BY_QIANKUN__ as boolean)
    ? `/saasweb${import.meta.env.BASE_URL}`
    : `${import.meta.env.BASE_URL}`
)

const router = createRouter({
  history,
  routes
})

// eslint-disable-next-line max-statements
router.beforeEach(async (to, _from, next) => {
  const { base } = useStore()

  if (!isEmpty(to.query.pj)) {
    const projectId = cryptoInstance.Decrypt(to.query.pj as string)
    base.project_id = projectId
    return next()
  }

  const { user_id } = base.userInfo
  if (!isEmpty(user_id)) {
    return next()
  }

  const loginName = to.query.loginName as string
  const projectId = to.query.project_id as string
  if (!isEmpty(projectId)) {
    base.project_id = projectId
  }
  if (isEmpty(loginName)) {
    // eslint-disable-next-line no-console
    console.warn('正常路由，没有登录任何用户')
    return next()
  }

  const sessionUserInfo = sessionStorage.getItem('userInfo')
  if (!isEmpty(sessionUserInfo)) {
    const parseUserInfo = JSON.parse(sessionUserInfo as string)
    if (!isEmpty(loginName) || loginName === parseUserInfo.userName) {
      base.userInfo = parseUserInfo
      return next()
    }
  }
  // 登录
  const params = {
    loginName,
    loginDevice: 'PC'
  }
  const res = await base.getUserInfoByLoginName(params)
  // 登录成功
  if (!res) {
    // eslint-disable-next-line no-console
    console.error('登录失败！')
  }
  return next()
})

export default router
