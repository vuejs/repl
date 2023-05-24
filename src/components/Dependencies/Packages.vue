<script setup lang="ts">
import {computed, inject, ref} from "vue";
import IconDelete from "../Icon/IconDelete.vue";
import DepItems from "./DepItems.vue";
import { Store } from "../../store";
const store = inject('store') as Store
const keyword = ref('')

const ignore = ['vue','vue/server-renderer']

const dependencies = computed({
    get(){
        const importMap = JSON.parse(store.state.files['import-map.json']['code'])
        return Object.keys(importMap.imports).map(key => {
            return {
                name: key,
                src: importMap.imports[key]
            }
        })
    },
    set(values){
        const importMap = values.reduce((pre,cur) => {
            if (pre.imports[cur.name]) {
                store.state.errors = ['The package already exists']
            }else {
                pre.imports[cur.name] = cur.src
            }
            return pre
        },{ imports:{}} as any)

        store.state.files['import-map.json']['code'] = JSON.stringify(importMap,null,2)
    }
})

function uninstallDep(dep:Record<'src' | 'name', string>) {
    dependencies.value = dependencies.value.filter(item => item.name !== dep.name)
}
</script>

<template>
<div class="package-container">
    <div >
        <DepItems :items="dependencies.filter(item=>!ignore.includes(item.name))" @rightClick="uninstallDep">
            <template #right>
                <span class="uninstall"><IconDelete/></span>
            </template>
        </DepItems>
    </div>
</div>
</template>

<style scoped>

</style>
