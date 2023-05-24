<script setup lang="ts">
import { ref, shallowRef, inject } from "vue";
import { Store } from "../../store";
import Dialog from "../Dialog/index.vue";
import Packages from "./Packages.vue";
import Install from "./Install.vue";
import IconPackage from "../Icon/IconPackage.vue";
import IconInstall from "../Icon/IconInstall.vue";
const store = inject('store') as Store

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
  <Dialog v-model="visible" width="850" title="Dependencies">
      <div class="dep-container">
          <div class="left">
            <div :class="{active:active==='Packages'}" @click="handleActiveTab('Packages')">
               <IconPackage/> Packages
            </div>
              <div :class="{active:active==='Install'}"  @click="handleActiveTab('Install')">
                <IconInstall/>  Install
              </div>
          </div>
          <div class="right">
              <component :is="component[active]||'div'"></component>
          </div>
      </div>
  </Dialog>
</template>

<style scoped>
.dep-container{
    display: flex;
    height: 500px;
}
.dep-container .left{
    width: 180px;
    border-right: 1px solid var(--border);
}
.dep-container .left > div{
    padding-left: 30px;
    height: 50px;
    line-height: 50px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 16px;
}
.dep-container .left > div:hover{
    background-color: var(--color-active-bg);
}

.dep-container .left > .active {
    background-color: var(--color-active-bg);
}
.dep-container .right{
    flex: 1;
    text-align: center;
    overflow: auto;
}
.dep-container .right::-webkit-scrollbar {
    width: 10px;
    height: 10px;
}
.dep-container .right::-webkit-scrollbar-thumb {
    background-color: var(--color-scroll-bar);
    border-radius: 10px;
}
</style>
