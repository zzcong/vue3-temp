import { createApp, App } from 'vue'
import AppComponent from './App.vue'
import router from './router'
import { pinia } from '@/store'

import { renderWithQiankun, qiankunWindow, QiankunProps } from 'vite-plugin-qiankun/dist/helper'
import { isUndefined } from 'lodash'

import './style.css'
import 'meri-plus/theme/index.css'

// eslint-disable-next-line init-declarations
let instance: App

function render(props: QiankunProps) {
  const { container } = props
  instance = createApp(AppComponent)
  instance
    .use(pinia)
    .use(router)
    .mount(!isUndefined(container) ? (container.querySelector('#app') as Element) : '#app')
}

const initByQiankun = () => {
  renderWithQiankun({
    mount(props) {
      render(props)
    },
    bootstrap() {
      // Pass
    },
    unmount() {
      instance.unmount()
    },
    update(): void | Promise<void> {
      throw new Error('Function not implemented.')
    }
  })
}

// 独立运行时
// eslint-disable-next-line no-underscore-dangle
if (isUndefined(qiankunWindow.__POWERED_BY_QIANKUN__)) {
  render({})
} else {
  initByQiankun()
}
