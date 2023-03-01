// eslint-disable-next-line spaced-comment
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string
  readonly VITE_DEV_MODE: string
  readonly VITE_MICRO_MODE: string
  readonly VITE_PRO_MODE: string
  readonly VITE_REPORT_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
