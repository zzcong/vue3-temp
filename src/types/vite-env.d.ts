/// <reference types="vite/client" />

declare interface Window {
  __POWERED_BY_QIANKUN__: boolean
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<any, any, any>
  export default component
}
