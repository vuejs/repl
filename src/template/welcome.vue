<script>
export default {
  data() {
    return {
      msg: 'Hello World!',
      value: 50,
    }
  },
  computed: {
    background() {
      return `linear-gradient(to right, pink ${this.value}%, crimson 100%)`
    },
  },
}
</script>

<template>
  <div>
    <h1>{{ msg }}</h1>
    <input v-model="msg" />
    <br />
    <br />
    <input v-model="value" type="range" min="0" max="100" step="1" />
    <div class="bar" :style="{ background }"></div>
  </div>
</template>

<style>
.bar {
  margin-top: 10px;
  height: 40px;
  border-radius: 5px;
}
</style>
