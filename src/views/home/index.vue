<template>
  <div class="flex justify-center">
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img :src="viteSvg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <div>
    <RouterLink :to="{ name: 'home' }" class="home"> HOME </RouterLink>
    <RouterLink :to="{ name: 'about' }"> ABOUT </RouterLink>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <div>{{ test }}</div>
</template>

<script lang="ts">
import viteSvg from '@/assets/vue.svg'
import useStore from '@/store'
export default defineComponent({
  name: 'Home',
  setup() {
    const { test } = useStore()
    setTimeout(() => {
      test.test = 'abc'
    }, 3000)
    return { viteSvg, test: test.test }
  }
})
</script>

<style scoped lang="less">
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}

.home {
  color: red;
}
</style>
