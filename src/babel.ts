// @ts-ignore
import { registerPlugin, transform } from '@babel/standalone'

import BabelPluginJsx from '@vue/babel-plugin-jsx'
registerPlugin('@vue/babel-plugin-jsx', BabelPluginJsx)

export {transform}
