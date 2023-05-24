<script setup lang="ts">
defineProps<{items:Array<Record<'name'|'src', string>>}>()
defineEmits<{(e:'rightClick',dep:Record<'name'|'src', string>):void}>()
</script>

<template>
    <div>
        <div class="dep-item" v-for="item in items" :key="item.src">
            <h3>{{item.name}}</h3>
            <div class="right-click" @click="$emit('rightClick',item)">
                <slot name="right"></slot>
            </div>
        </div>
    </div>
</template>

<style scoped>

.dep-item {
    display: flex;
    align-items: center;
    padding: 10px;
    margin: 10px;
    height: 60px;
    text-align: left;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid var(--border);
}
.dep-item h3{
    margin: 0;

}
.dep-item .right-click{
    margin-left: auto;
    font-size: 18px;
    cursor: pointer;
}
</style>
