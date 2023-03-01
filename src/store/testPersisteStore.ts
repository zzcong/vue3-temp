import { defineStore } from 'pinia'

const testStore = defineStore('test', {
  state: () => ({
    test: 'test-store'
  }),
  persist: true
})

export default testStore
