import { defineStore } from 'pinia'
import { BaseStore } from '@/types/common'
import { LoginParams } from '@/types/Params'
import { loginByUserName } from '@/apis/common'

const baseStore = defineStore('base', {
  state: (): BaseStore => ({
    userInfo: {
      pd: '',
      user_id: '',
      person_id: '',
      userName: '',
      userId: '',
      groupCode: '',
      group_code: '',
      isAdmin: '',
      resultType: '',
      projects: [],
      authorizations: []
    },
    project_id: '',
    authId: []
  }),
  getters: {},
  actions: {
    async getUserInfoByLoginName(params: LoginParams) {
      const res = await loginByUserName(params)
      const content = res.content[0]
      let authId: Set<string> = new Set()
      if (content.authorizations.length > 0) {
        authId = new Set([...content.authorizations.map(({ authorizationId }) => authorizationId).filter(item => item)])
      }
      this.userInfo = content
      this.authId = [...authId]
      return true
    }
  }
})

export default baseStore
