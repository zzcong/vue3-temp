/* eslint-disable */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import checker from 'vite-plugin-checker'
import { createStyleImportPlugin } from 'vite-plugin-style-import'
import viteCompression from 'vite-plugin-compression'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import qiankun from 'vite-plugin-qiankun'
import { createHtmlPlugin } from 'vite-plugin-html'
import { visualizer } from 'rollup-plugin-visualizer'

import { pascalCase, camelCase } from 'change-case'

import { get_externals, get_static_urls } from 'persagy-tools'

import path from 'path'
import { name } from './package.json'

const proName = name

const resolve = (...rest: string[]) => path.resolve(__dirname, ...rest)

const imageType = 'jpg,jpeg,png,gif,webp,svg'.split(',')

const externals = Object.keys(
  get_externals([
    'vue',
    'vuex',
    'vue-router',
    'axios',
    '@antv/g2',
    'highcharts',
    'moment',
    'vue-draggable-resizable',
    'vuedraggable',
    'html2canvas',
    '@antv/f2',
    'ant-design-vue',
    'element-ui',
    'validator',
    'meri-design',
    'persagy-map'
  ])
)

const cdnList = get_static_urls().js_src.filter(url => externals.some(pck => url.includes(`${pck}@`)))

export default defineConfig(({ mode }) => {
  const plugins = [
    vue(),
    vueJsx(),
    Components({
      dts: path.resolve(__dirname, 'src', 'types', 'components.d.ts'),
      extensions: ['vue', 'jsx', 'tsx'],
      resolvers: [
        compName => {
          if (compName.startsWith('M') || compName.startsWith('m-')) {
            return { name: pascalCase(compName), from: 'meri-plus' }
          }
        }
      ]
    }),
    AutoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
      dts: path.resolve(__dirname, 'src', 'types', 'auto-imports.d.ts'),
      eslintrc: {
        enabled: true
      }
    }),
    createStyleImportPlugin({
      libs: [
        {
          libraryName: 'meri-plus',
          esModule: true,
          resolveStyle: name => `meri-plus/styles/${camelCase(name).toLowerCase()}/index.css`
        }
      ]
    }),
    createHtmlPlugin({
      minify: true,
      inject: {
        data: {
          title: proName,
          cdnList: cdnList
        }
      }
    }),
    qiankun(proName, {
      useDevMode: mode === 'micro'
    })
  ]
  if (mode === 'development' || mode === 'micro') {
    plugins.push(
      checker({
        typescript: true,
        eslint: {
          lintCommand: 'eslint "./src/**/*.{ts,tsx}"'
        }
      })
    )
  } else if (mode === 'production') {
    plugins.push(
      viteCompression({
        algorithm: 'gzip',
        threshold: 10240,
        verbose: false,
        deleteOriginFile: false
      })
    )
    plugins.push()
  } else if (mode === 'report') {
    plugins.push(
      visualizer({
        open: true,
        gzipSize: true,
        filename: 'report.html'
      })
    )
  }

  return {
    envDir: resolve('env'),
    base: mode === 'production' ? `/${proName}/` : '/',
    plugins,
    resolve: {
      alias: {
        '@': resolve('./src')
      },
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json']
    },
    server: {
      open: true,
      port: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      proxy: {
        '/api': {
          changeOrigin: true,
          target: 'https://gapmdev.persagy.com/',
          rewrite: path => path.replace(/^\/api/, '')
        }
      }
    },
    build: {
      outDir: proName,
      cssCodeSplit: true,
      sourcemap: false,
      target: 'modules',
      chunkSizeWarningLimit: 1024,
      assetsInlineLimit: 5120,
      manifest: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: false
        }
      },
      rollupOptions: {
        input: {
          main: resolve('index.html')
        },
        output: {
          external: externals,
          chunkFileNames: 'static/js/[name]-[hash].js',
          entryFileNames: 'static/js/[name]-[hash].js',
          assetFileNames: (assetInfo: any) => {
            const name = assetInfo.name as string
            const ext = (name.match(/\.(\w+)?$/) as RegExpMatchArray)[1].toLowerCase()
            if (['css', 'woff2', 'woff', 'ttf'].includes(ext)) {
              return 'static/css/[name]-[hash].[ext]'
            }
            if (imageType.includes(ext)) {
              return 'static/images/[name]-[hash].[ext]'
            }
            return 'static/other/[name]-[hash].[ext]'
          }
        }
      }
    }
  }
})
