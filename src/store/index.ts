import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'
import { cryptoInstance } from '../utils/persagyTools'
import baseStore from './baseStore'
import testStore from './testPersisteStore'

const deserialize = function deserialize(str: string) {
  return JSON.parse(cryptoInstance.Decrypt(str))
}
const serialize = function serialize(obj: any) {
  return cryptoInstance.Encrypt(JSON.stringify(obj))
}
const persiste = createPersistedState({
  key: (id: string) => `__persagy__${id}`,
  storage: sessionStorage,
  serializer: {
    deserialize,
    serialize
  }
})

const pinia = createPinia()
pinia.use(persiste)

const defaultStore = () => ({
  test: testStore(),
  base: baseStore()
})

export { pinia, defaultStore as default }
