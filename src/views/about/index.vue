<template>
  <div class="about">
    <h1>{{ title }}</h1>
    <h2>{{ count }}</h2>
    <button class="btn" @click="click">CLICK</button>
  </div>
</template>
<script lang="ts">
export default defineComponent({
  name: 'About',
  props: {
    title: {
      type: String,
      default: 'About'
    }
  },
  setup() {
    const count = ref(0)
    const click = () => {
      count.value += 1
    }
    return { count, click }
  }
})
</script>
