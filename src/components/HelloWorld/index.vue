<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <MButton @click="click">count is {{ count }}</MButton>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"> create-vue </a>
    , the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/johnsoncodehk/volar" target="_blank"> Volar </a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<script setup lang="ts">
defineProps<{
  msg: string
}>()
const count = ref(0)
const click = () => {
  count.value += 1
}
</script>

<style lang="less" scoped>
@import url('./index.less');
</style>
