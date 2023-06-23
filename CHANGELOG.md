## [2.1.3](https://github.com/vuejs/repl/compare/v2.1.2...v2.1.3) (2023-06-22)


### Bug Fixes

* actually fix editor type ([95ab2ab](https://github.com/vuejs/repl/commit/95ab2abc29b01a565ba7bc25ef293f1434db5ef6))



## [2.1.2](https://github.com/vuejs/repl/compare/v2.1.1...v2.1.2) (2023-06-22)


### Bug Fixes

* ensure imported editor can be passed as prop without type error ([414b0e6](https://github.com/vuejs/repl/commit/414b0e6cb729234ccb188332b22c184e44f162e0))



## [2.1.1](https://github.com/vuejs/repl/compare/v2.1.0...v2.1.1) (2023-06-22)


### Bug Fixes

* **types:** fix editor generated dts ([e5705df](https://github.com/vuejs/repl/commit/e5705df7d1ea4a44d9f6eba4443e28712631053a))



# [2.1.0](https://github.com/vuejs/repl/compare/v2.0.0...v2.1.0) (2023-06-22)


### Features

* support custom file go to difinition ([#102](https://github.com/vuejs/repl/issues/102)) ([519b0cc](https://github.com/vuejs/repl/commit/519b0cc079dccdb08ed00f1b5d2fb0c965fbab03))



# [2.0.0](https://github.com/vuejs/repl/compare/v1.5.0...v2.0.0) (2023-06-22)

### Features

* Support using Monaco Editor + Volar ([#34](https://github.com/vuejs/repl/pull/34))

### BREAKING CHANGES

* The main `Repl` component now requires passing in the editor to be used via the `editor` prop. This is necessary so that the unused editor can be tree-shaken.

  Example using Monaco:

  ```vue
  <script setup>
  import { Repl } from '@vue/repl'
  import Monaco from '@vue/repl/monaco-editor'
  import '@vue/repl/style.css'
  </script>

  <template>
    <Repl :editor="Monaco" />
  </template>
  ```

  Example using CodeMirror:

  ```vue
  <script setup>
  import { Repl } from '@vue/repl'
  import CodeMirror from '@vue/repl/codemirror-editor'
  import '@vue/repl/style.css'
  </script>

  <template>
    <Repl :editor="CodeMirror" />
  </template>
  ```

# [1.5.0](https://github.com/vuejs/repl/compare/v1.4.1...v1.5.0) (2023-06-14)


### Bug Fixes

* add ts and json mode ([#37](https://github.com/vuejs/repl/issues/37)) ([0e467af](https://github.com/vuejs/repl/commit/0e467afbb52c759fdad0a2bfc263812b0df285c5))
* console logging for component instance proxies ([#62](https://github.com/vuejs/repl/issues/62)) ([bb0e143](https://github.com/vuejs/repl/commit/bb0e1430bff586b5505c3e9d11e8331359ee23d2))
* css update in ssr mode ([3b7e511](https://github.com/vuejs/repl/commit/3b7e51126dd32e4ebf36b9bd492f1c117ac9de69)), closes [#91](https://github.com/vuejs/repl/issues/91) [#92](https://github.com/vuejs/repl/issues/92)
* Fix reason.message not existing case ([#54](https://github.com/vuejs/repl/issues/54)) ([2508030](https://github.com/vuejs/repl/commit/2508030241504d750a3226eb9a70fddd45d3299d))
* improve code gen when using cssVars in SSR ([#85](https://github.com/vuejs/repl/issues/85)) ([7e2bcc8](https://github.com/vuejs/repl/commit/7e2bcc864360e302d8b2a48e6904b7ec6c099f3f))
* improve code with optional chain ([#72](https://github.com/vuejs/repl/issues/72)) ([b8caeae](https://github.com/vuejs/repl/commit/b8caeaef0368609fa3c41e992304d21d526de08c))
* prevent opening new tab for a tags with javascript href ([#94](https://github.com/vuejs/repl/issues/94)) ([64906a5](https://github.com/vuejs/repl/commit/64906a529cc48869791e663ba6d203baed236f6f))
* process all files when dynamic import ([#60](https://github.com/vuejs/repl/issues/60)) ([7049ae0](https://github.com/vuejs/repl/commit/7049ae006f8687d2dafce38b7f54d7281410062a))


### Features

* add `sublime` keymap ([#45](https://github.com/vuejs/repl/issues/45)) ([29263d8](https://github.com/vuejs/repl/commit/29263d83d2d28e2ea3fc85c59de6d6d7ef92cca6))
* add file renaming ([#63](https://github.com/vuejs/repl/issues/63)) ([eb41c3a](https://github.com/vuejs/repl/commit/eb41c3a180eb720ba0959ba2da8064442f1b25e6))
* add search and replace ([#67](https://github.com/vuejs/repl/issues/67)) ([4ca3d94](https://github.com/vuejs/repl/commit/4ca3d94c98ed2029ccd61197780d45f348b2fcde))
* local JSON files ([#82](https://github.com/vuejs/repl/issues/82)) ([db076eb](https://github.com/vuejs/repl/commit/db076eb2b07e104ef460d7e2bd99769b5653e1a5))
* support for sandbox page customization ([#42](https://github.com/vuejs/repl/issues/42)) ([a22b969](https://github.com/vuejs/repl/commit/a22b96968894dcaf4fa096edf8a1dd7d7f903e5e))



## [1.4.1](https://github.com/vuejs/repl/compare/v1.4.0...v1.4.1) (2023-04-21)



# [1.4.0](https://github.com/vuejs/repl/compare/v1.3.6...v1.4.0) (2023-04-13)


### Features

* provide fs option to support 3.3 external type resolving ([f0e826a](https://github.com/vuejs/repl/commit/f0e826a1ff9eae7c008f2b92b4af35a518dd0c7f))



## [1.3.6](https://github.com/vuejs/repl/compare/v1.3.5...v1.3.6) (2023-04-13)


### Bug Fixes

* **types:** make sfc options partial ([9916f28](https://github.com/vuejs/repl/commit/9916f2862b327891604f3282fedf626759694e2c))



## [1.3.5](https://github.com/vuejs/repl/compare/v1.3.4...v1.3.5) (2023-04-06)


### Bug Fixes

* avoid including vue in import map if using default URLs ([37ce32b](https://github.com/vuejs/repl/commit/37ce32b107864332eeebbc406a817d78ae8d982a))



## [1.3.4](https://github.com/vuejs/repl/compare/v1.3.3...v1.3.4) (2023-04-06)


### Bug Fixes

* fix legacy domain in import maps ([7e7c7f9](https://github.com/vuejs/repl/commit/7e7c7f9dd62995f2f27448e72effb4c8fe879d72))



## [1.3.3](https://github.com/vuejs/repl/compare/v1.3.2...v1.3.3) (2023-03-17)


### Bug Fixes

* ignore polyfill error in Safari ([39f4ab1](https://github.com/vuejs/repl/commit/39f4ab1956af85383e6616eafec3efc616313d28))



## [1.3.2](https://github.com/vuejs/repl/compare/v1.3.1...v1.3.2) (2022-09-27)


### Bug Fixes

* reset sandbox when changing files for safari compat ([68a6197](https://github.com/vuejs/repl/commit/68a6197bbfb88dc74ec317ae50e3f686cbfeb081)), closes [vuejs/docs#1973](https://github.com/vuejs/docs/issues/1973)



## [1.3.1](https://github.com/vuejs/repl/compare/v1.3.0...v1.3.1) (2022-09-27)



# [1.3.0](https://github.com/vuejs/repl/compare/v1.2.4...v1.3.0) (2022-06-26)



## [1.2.4](https://github.com/vuejs/repl/compare/v1.2.3...v1.2.4) (2022-06-26)


### Bug Fixes

* compile error when no script ([#38](https://github.com/vuejs/repl/issues/38)) ([6b9b7bc](https://github.com/vuejs/repl/commit/6b9b7bc9ea3f89772eaf1807e3b7478d39f3ef9c))


### Features

* export Preview component ([#39](https://github.com/vuejs/repl/issues/39)) ([0b93cd6](https://github.com/vuejs/repl/commit/0b93cd66f5dc0beb2e44f271efa3868a155bff21))
* gzip serialized state ([#43](https://github.com/vuejs/repl/issues/43)) ([b12eb88](https://github.com/vuejs/repl/commit/b12eb885deb080246d372495f443fe543de1eb6d))



## [1.2.3](https://github.com/vuejs/repl/compare/v1.2.2...v1.2.3) (2022-05-25)


### Bug Fixes

* also reset import map when resetting to defauilt vue version ([5e89f07](https://github.com/vuejs/repl/commit/5e89f074ea5d33b301e079c5f4fe7860e1e5ca82))
* improve new filename logic ([9647666](https://github.com/vuejs/repl/commit/9647666554407b32f16b8b5581333542769a5ea0))
* warn versions that do not support in browser SSR ([01cb5b2](https://github.com/vuejs/repl/commit/01cb5b20cd15c3dcbe9f1b6d3dbc8797702924e9))



## [1.2.2](https://github.com/vuejs/repl/compare/v1.2.1...v1.2.2) (2022-05-25)


### Bug Fixes

* do not start compiling until sfc options are set ([b6f86d9](https://github.com/vuejs/repl/commit/b6f86d920d22d83fde3bb77b11e8f44fff1a244d))



## [1.2.1](https://github.com/vuejs/repl/compare/v1.2.0...v1.2.1) (2022-05-25)


### Bug Fixes

* fix html initialization in ssr mode ([152f2fa](https://github.com/vuejs/repl/commit/152f2fad88fa87fb617a8a69ff8f9f2c1b1eba33))



# [1.2.0](https://github.com/vuejs/repl/compare/v1.1.2...v1.2.0) (2022-05-25)


### Bug Fixes

* avoid using native crypto ([c22e216](https://github.com/vuejs/repl/commit/c22e216b1c6d8bbce3cbb4376d82ce15ce149433)), closes [#25](https://github.com/vuejs/repl/issues/25)


### Features

* **FileSelector:**  add an increment counter for new files ([#36](https://github.com/vuejs/repl/issues/36)) ([63b8f22](https://github.com/vuejs/repl/commit/63b8f22a991984ce1ce6c56d14ae4f35f8b4a436))
* support ssr + hydration ([098aa89](https://github.com/vuejs/repl/commit/098aa8992ad860c8529fb285552c6c26e7518e9e))



## [1.1.2](https://github.com/vuejs/repl/compare/v1.1.1...v1.1.2) (2022-05-20)


### Bug Fixes

* apply TS transform to template when inine is disabled ([ec2ae81](https://github.com/vuejs/repl/commit/ec2ae811bd25da4be74b9df3bb8fcf9ba5d34cfb))



## [1.1.1](https://github.com/vuejs/repl/compare/v1.1.0...v1.1.1) (2022-05-17)


### Bug Fixes

* adding file using enter emits error ([#23](https://github.com/vuejs/repl/issues/23)) ([918de7f](https://github.com/vuejs/repl/commit/918de7f3646a24db083e54301d6ac5c3a970c0df))



# [1.1.0](https://github.com/vuejs/repl/compare/v1.0.1...v1.1.0) (2022-05-17)



## [1.0.1](https://github.com/vuejs/repl/compare/f8bb46f969860539e3105ff56d092f0184a70eba...v1.0.1) (2022-05-17)


### Bug Fixes

* also generate render function if inline mode is disabled ([9a325bb](https://github.com/vuejs/repl/commit/9a325bbf66b61403cd4df5ace31d0e7e1532fddf))
* avoid reloading the iframe when switching output tabs ([20bde55](https://github.com/vuejs/repl/commit/20bde550e481c0a9c9218f8a583eae7b27ca42d2))
* css double # ([#14](https://github.com/vuejs/repl/issues/14)) ([8bcf7f0](https://github.com/vuejs/repl/commit/8bcf7f0f22553214f7936863de3d9780272781b0))
* fix module instantiation order ([879f084](https://github.com/vuejs/repl/commit/879f08495c061afa11e058a3e059365fe09277c6))
* fix rewriteDefault TS edge case ([d277d7f](https://github.com/vuejs/repl/commit/d277d7f50113c45b8ae71afcda9aa369c64fba32))
* fix setFiles with multi files cross imports ([424e00d](https://github.com/vuejs/repl/commit/424e00d2ac50636b3a2a9739620435b156f1a94a))
* force app name ([18863af](https://github.com/vuejs/repl/commit/18863af803922f3966a80922db7c8a45a0cdd78d))
* small screen error msg covered code button ([#18](https://github.com/vuejs/repl/issues/18)) ([02da79d](https://github.com/vuejs/repl/commit/02da79d0a238b8777fcd95675c8c5dbd1b626fd4))
* toggler should be absolute ([f8bb46f](https://github.com/vuejs/repl/commit/f8bb46f969860539e3105ff56d092f0184a70eba))
* update import map when setting vue versions ([15cc696](https://github.com/vuejs/repl/commit/15cc696054b49fe5ea6879b9492b96cca611c945))


### Features

* add hidden file ([#17](https://github.com/vuejs/repl/issues/17)) ([35b6f1a](https://github.com/vuejs/repl/commit/35b6f1a38611e31b9adbe7540d789be144e33bdc))
* allow starting on a specific view ([#15](https://github.com/vuejs/repl/issues/15)) ([7e63511](https://github.com/vuejs/repl/commit/7e635110bb5e11e8103b66c5d347cf959be8bd55))
* export compileFile ([#13](https://github.com/vuejs/repl/issues/13)) ([60db549](https://github.com/vuejs/repl/commit/60db54905699e005d3117a693410c0cd50f154fe))
* file-selector add horizontal scroll ([#10](https://github.com/vuejs/repl/issues/10)) ([d0c961e](https://github.com/vuejs/repl/commit/d0c961e7b20939f0e028fd0cb89ce75123f32aa7))
* support passing in compiler-sfc options ([f6c7049](https://github.com/vuejs/repl/commit/f6c7049f9bc4a5e1dd3e1c1948ba2ecb43fad3c3))
* support ts in template expressions ([a1e9881](https://github.com/vuejs/repl/commit/a1e98814699c020a2d82c8c5aad664e99bd6ef52))
* vertical mode ([d59bb6c](https://github.com/vuejs/repl/commit/d59bb6cd0eb0e03fa548595f5c64b990cecd133e))
