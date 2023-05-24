<script setup lang="ts">
import {computed, inject, ref} from "vue";
import DepItems from "./DepItems.vue";
import IconInstall from "../Icon/IconInstall.vue";
import {Store} from "../../store";
const store = inject('store') as Store
const keyword = ref('')
const deps = [
    {name:'lodash', src:'https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/+esm'},
    {name:'@vueuse/core', src:'https://cdn.jsdelivr.net/npm/@vueuse/core@10.1.2/+esm'},
    {name:'pinia', src:'https://cdn.jsdelivr.net/npm/pinia@2.1.3/+esm'},
    {name:'axios', src:'https://cdn.jsdelivr.net/npm/axios@1.4.0/+esm'},
]


const importMap = computed(() => {
    return JSON.parse(store.state.files['import-map.json']['code'])
})


const filteredDeps = computed(() => {
    return deps.filter(dep => !importMap.value.imports[dep.name])
})

function installDep(dep:typeof deps[0]) {
    const importMap = JSON.parse(store.state.files['import-map.json']['code'])
    if (importMap.imports[dep.name]) {
        store.state.errors = ['The package already exists']
    }else {
        importMap.imports[dep.name] = dep.src
        store.state.files['import-map.json']['code'] = JSON.stringify(importMap,null,2)
    }
}
</script>

<template>
    <div class="package-container">
        <DepItems :items="filteredDeps" @rightClick="installDep">
            <template #right>
                <span><IconInstall/></span>
            </template>
        </DepItems>
    </div>
</template>

