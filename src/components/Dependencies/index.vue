<script setup lang="ts">
import {ref, shallowRef} from "vue";
import Dialog from "../Dialog/index.vue";
import Packages from "./Packages.vue";
import Install from "./Install.vue";

const visible = ref(true)
const active = ref('Packages')
const component = shallowRef({
    Packages,
    Install
})
function handleActiveTab(value:string) {
    active.value = value
}
</script>

<template>
    <button @click="visible=true">按钮</button>
  <Dialog v-model="visible" width="850" title="Dependencies">
      <div class="dep-container">
          <div class="left">
            <div :class="{active:active==='Packages'}" @click="handleActiveTab('Packages')">
                Packages
            </div>
              <div :class="{active:active==='Install'}"  @click="handleActiveTab('Install')">
                  Install
              </div>
          </div>
          <div class="right">
              <component :is="component[active]"></component>
          </div>
      </div>
  </Dialog>
</template>

<style scoped>
.dep-container{
    display: flex;
    height: 500px;
}
.left{
    width: 180px;
    border-right: 1px solid var(--border);
}
.left > div{
    padding-left: 30px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
}
.left > div:hover{
    background-color: var(--color-active);
}

.left > .active {
    background-color: var(--color-active);
}
.right{
    flex: 1;
    text-align: center;
}
</style>
