import { transform } from '@babel/standalone'
import jsx from '@vue/babel-plugin-jsx'

export async function transformJSX(src: string) {
  return transform(src, {
    plugins: [jsx],
  }).code!
}
