<script setup lang="ts">
import { ref } from 'vue';
import { CommandData } from '../types';
import JsonTree from './JsonTree.vue';

defineProps<{ log: CommandData }>()
const level = ref(1)
//	function toggleGroupCollapse() {
//		log.collapsed = !log.collapsed;
//	}
</script>

<template>
  <div 
    v-if="log.level === 'table'"
  >
    <ConsoleTable :data="log.args[0]" :columns="log.args[1]" />
  </div>
  <div 
    class="log console-{{ log.level }}" 
    :style="{ paddingLeft: level * 15 + 'px' }" 
  >
    <span v-if="log.count && log.count > 1" class="count">{{ log.count }}x</span>

    <div 
      v-if="log.level === 'trace' || log.level === 'assert'" 
      class="arrow" 
    >▶</div>

    <span v-if="log.level === 'assert'" class="assert">Assertion failed:</span>

    <span v-if="log.level === 'clear'" class="info">Console was cleared</span>
    <span v-if="log.level === 'unclonable'" class="info error">Message could not be cloned. Open devtools to see it</span>
    <div v-if="log.level === 'group'" class="arrow" :class="{ expand: !log.collapsed }" @click="toggleGroupCollapse">▶</div>
    <span v-if="log.level === 'group'" class="title">{{ log.label }}</span>

    <span v-if="log.level.startsWith('system')">
      <template v-for="arg in log.args">
        {{ arg }}
      </template>
    </span>

    <JSONNode v-if="log.level === 'table'" :value="log.args[0]" />
    <template v-else>
      <template v-for="arg in log.args">
        <JsonTree :data="arg" />
      </template>
    </template>

    <div 
      v-for="(_, idx) in new Array(level - 1)" 
      class="outline" 
      :style="{ left: idx * 15 + 15 + 'px' }" 
    />
  </div>

</template>

<style>
	.log {
		border-bottom: 1px solid #eee;
		padding: 5px 10px 0px;
		display: flex;
		position: relative;
		font-size: 12px;
		font-family: var(--font-mono);
	}

	.log > :global(*) {
		margin-right: 10px;
		font-family: var(--font-mono);
	}

	.console-warn, .console-system-warn {
		background: #fffbe6;
		border-color: #fff4c4;
	}

	.console-error, .console-assert {
		background: #fff0f0;
		border-color: #fed6d7;
	}

	.console-group, .arrow {
		cursor: pointer;
		user-select: none;
	}

	.console-trace, .console-assert {
		border-bottom: none;
	}

	.console-assert + .trace {
		background: #fff0f0;
		border-color: #fed6d7;
	}

	.trace {
		border-bottom: 1px solid #eee;
		font-size: 12px;
		font-family: var(--font-mono);
		padding: 4px 0 2px;
	}

	.trace > :global(div) {
		margin-left: 15px;
	}

	.count {
		color: #999;
		font-size: 12px;
		line-height: 1.2;
	}

	.info {
		color: #666;
		font-family: var(--font) !important;
		font-size: 12px;
	}

	.error {
		color: #da106e; /* todo make this a var */
	}

	.outline {
		border-left: 1px solid #9c9cab;
		position: absolute;
		top: 0;
		bottom: -1px;
	}

	.arrow {
		position: absolute;
		font-size: 0.6em;
		transition: 150ms;
		transform-origin: 50% 50%;
		transform: translateY(1px) translateX(-50%);
	}

	.arrow.expand {
		transform: translateY(1px) translateX(-50%) rotateZ(90deg);
	}

	.title {
		font-family: var(--font-mono);
		font-size: 13px;
		font-weight: bold;
		padding-left: 11px;
		height: 19px;
	}

	.assert {
		padding-left: 11px;
		font-weight: bold;
		color: #da106e;
	}
</style>
