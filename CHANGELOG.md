## [4.6.1](https://github.com/vuejs/repl/compare/v4.6.0...v4.6.1) (2025-06-13)


### Bug Fixes

* the line number offset in the DEV ([#344](https://github.com/vuejs/repl/issues/344)) ([cc292d3](https://github.com/vuejs/repl/commit/cc292d3dba25ac872edf147e14b6c9bbf6a0c577))



# [4.6.0](https://github.com/vuejs/repl/compare/v4.5.1...v4.6.0) (2025-06-13)


### Features

* add support for viewing sourcemap ([#341](https://github.com/vuejs/repl/issues/341)) ([5714d5b](https://github.com/vuejs/repl/commit/5714d5b706d7c945ee5393bef545dcf70c189db3))
* show SSR output ([#343](https://github.com/vuejs/repl/issues/343)) ([52a193a](https://github.com/vuejs/repl/commit/52a193a8a658d0059ee8c30345ca10ff52af7c04))



## [4.5.1](https://github.com/vuejs/repl/compare/v4.5.0...v4.5.1) (2025-02-19)


### Bug Fixes

* apply builtin import map after deserialize ([#315](https://github.com/vuejs/repl/issues/315)) ([e62ddda](https://github.com/vuejs/repl/commit/e62ddda06fe3339a467f88b13b0271c2a5c7e96d))
* **split-pane:** rendering order comes from the store.show-output ([0bd4c17](https://github.com/vuejs/repl/commit/0bd4c17b6dd26d4e17387f50e089dd3ffefaf054))
* ts error ([a927083](https://github.com/vuejs/repl/commit/a927083734f1d4dae5be0d200aafd26e49ce82aa))


### Features

* add core entry for node usage ([#310](https://github.com/vuejs/repl/issues/310)) ([da105a4](https://github.com/vuejs/repl/commit/da105a42618899d214701a5fb6549719f73331bb))
* **editor:** scrollbar style for firefox ([#320](https://github.com/vuejs/repl/issues/320)) ([bbc740b](https://github.com/vuejs/repl/commit/bbc740bfa840dfb6c77824470f1ffdc4a6261e85))
* export `Sandbox` as standalone output component ([#309](https://github.com/vuejs/repl/issues/309)) ([b549715](https://github.com/vuejs/repl/commit/b5497152fefe8f190eca59755bedb27b2f3178f2))
* **store:** return `setImportMap` and add `merge` parameter ([9f53bd1](https://github.com/vuejs/repl/commit/9f53bd11aee1d75984e5597878e53bec4ae168e5))
* support cache selected typescript version ([#305](https://github.com/vuejs/repl/issues/305)) ([33ca3c0](https://github.com/vuejs/repl/commit/33ca3c0317aa0418c094ec8f9e6712d81fa11465))
* support vapor template-only component ([#322](https://github.com/vuejs/repl/issues/322)) ([9ae056b](https://github.com/vuejs/repl/commit/9ae056b701ff54446c5c1ec9f29444d5239e0931))



# [4.5.0](https://github.com/vuejs/repl/compare/v4.4.3...v4.5.0) (2025-02-03)


### Features

* pass on descriptor vapor flag when compiling template ([adaaceb](https://github.com/vuejs/repl/commit/adaaceb24984435ae02ab3eda071f10dba9e0362))



## [4.4.3](https://github.com/vuejs/repl/compare/v4.4.2...v4.4.3) (2025-01-02)


### Bug Fixes

* transform jsx for entire file ([48325f9](https://github.com/vuejs/repl/commit/48325f99e010c3065c99efd4fb3e95950cda9596)), closes [#301](https://github.com/vuejs/repl/issues/301) [#300](https://github.com/vuejs/repl/issues/300)



## [4.4.2](https://github.com/vuejs/repl/compare/v4.4.1...v4.4.2) (2024-09-16)


### Bug Fixes

* output toggle button ([#279](https://github.com/vuejs/repl/issues/279)) ([93051f3](https://github.com/vuejs/repl/commit/93051f35a232b53d01dd0a40623cab5b11baa3ee))
* upgrade vue language tools ([ec393cf](https://github.com/vuejs/repl/commit/ec393cfe4b8b8008976e4fd2017bd112d98fa599))



## [4.4.1](https://github.com/vuejs/repl/compare/v4.4.0...v4.4.1) (2024-09-08)


### Bug Fixes

* cancel creating new file ([#281](https://github.com/vuejs/repl/issues/281)) ([7467f38](https://github.com/vuejs/repl/commit/7467f38f65e4b05dacc389644a8001b24f86fcdb))
* type error ([6653d0e](https://github.com/vuejs/repl/commit/6653d0e4b0b30eeee4bfe0c0c92bf00a84c0c753))


### Features

* add `autoSave` toggle button ([#283](https://github.com/vuejs/repl/issues/283)) ([83d8e48](https://github.com/vuejs/repl/commit/83d8e487de724261cf709c5648cc2512b4c33732))
* export `languageToolsVersion` ([5a92a92](https://github.com/vuejs/repl/commit/5a92a9259da01da4aa30b09ed6dcedfb4503c71d))



# [4.4.0](https://github.com/vuejs/repl/compare/v4.3.1...v4.4.0) (2024-09-07)


### Bug Fixes

* debounce reloadLanguageTools in monaco ([f9f650a](https://github.com/vuejs/repl/commit/f9f650ada945f7ea597b7e7b51c132c4594bd5cb)), closes [#275](https://github.com/vuejs/repl/issues/275) [#263](https://github.com/vuejs/repl/issues/263)
* no default value for object props ([d786626](https://github.com/vuejs/repl/commit/d78662652ec18f4610facc8f3e2a50f38c01f93f))
* rollback & pin volar version ([c6f58c7](https://github.com/vuejs/repl/commit/c6f58c7f4d04799a64f788251362f8349728bea4))


### Features

* add more customization options ([#274](https://github.com/vuejs/repl/issues/274)) ([c73b786](https://github.com/vuejs/repl/commit/c73b7868d73d3dad792c80a36507ce92234443d4))
* expose `editorOptions.monacoOptions` ([00176d0](https://github.com/vuejs/repl/commit/00176d007ff5eb74e216abff3de87e625cde543b)), closes [#277](https://github.com/vuejs/repl/issues/277) [#232](https://github.com/vuejs/repl/issues/232)
* reactivity `autoSave` option ([#266](https://github.com/vuejs/repl/issues/266)) ([d90082a](https://github.com/vuejs/repl/commit/d90082a2e44956e08fc64d296661b30ea4590506))



## [4.3.1](https://github.com/vuejs/repl/compare/v4.3.0...v4.3.1) (2024-07-03)


### Bug Fixes

* match source file ([4cf06b6](https://github.com/vuejs/repl/commit/4cf06b63fa1807ccfbf14c0ef1f1fa9b1f268717))


### Reverts

* refactor: replace assert with assert-plus ([e55baa4](https://github.com/vuejs/repl/commit/e55baa481f70c387f24cebfdfa7f143814fb0ce2))



# [4.3.0](https://github.com/vuejs/repl/compare/v4.2.1...v4.3.0) (2024-07-02)


### Bug Fixes

* alert if deserialization fails ([071b1d1](https://github.com/vuejs/repl/commit/071b1d1216fa3df2e14c9c6e5453cfe85eed4b79)), closes [#256](https://github.com/vuejs/repl/issues/256)
* move assert-plus to devDep ([dd9f1bb](https://github.com/vuejs/repl/commit/dd9f1bb74c17f19c25aa9b0e485366781094e818))


### Features

* show view size while dragging split pane ([#253](https://github.com/vuejs/repl/issues/253)) ([a6bbeea](https://github.com/vuejs/repl/commit/a6bbeea7b8ec7c1302ba08afa0c789ad198cc8e2))
* volar 2.x ([#225](https://github.com/vuejs/repl/issues/225)) ([47030b6](https://github.com/vuejs/repl/commit/47030b66a6f1811a24d8292f9f3aa5185f7e8e23))



## [4.2.1](https://github.com/vuejs/repl/compare/v4.2.0...v4.2.1) (2024-05-31)


### Bug Fixes

* don't overwrite import map from initial state ([1410b8c](https://github.com/vuejs/repl/commit/1410b8cac4dd993c5ba6a94e299b261ed84c3f12)), closes [#252](https://github.com/vuejs/repl/issues/252)



# [4.2.0](https://github.com/vuejs/repl/compare/v4.1.2...v4.2.0) (2024-05-26)


### Bug Fixes

* refine dragging view area ([#246](https://github.com/vuejs/repl/issues/246)) ([df14639](https://github.com/vuejs/repl/commit/df14639b85edc0e153ba2fd6f29656785a0af3aa))
* specify unspported pre-processors lang ([#212](https://github.com/vuejs/repl/issues/212)) ([5cea974](https://github.com/vuejs/repl/commit/5cea974451ae23b82bea0c6270ad7ac726d831a4))


### Features

* `CodeMirror` support `autoSave` option ([#249](https://github.com/vuejs/repl/issues/249)) ([ae80c5b](https://github.com/vuejs/repl/commit/ae80c5b995ffa375013b665fd9a212c5607a1236))
* add `autoSave` option ([#247](https://github.com/vuejs/repl/issues/247)) ([d47eca5](https://github.com/vuejs/repl/commit/d47eca5926dcac798171fc216fcee2e21f275dd4))
* jsx for vue ([#248](https://github.com/vuejs/repl/issues/248)) ([d5b0d40](https://github.com/vuejs/repl/commit/d5b0d40ecc7f630b89e45ebe8472bc4e7563b3e2))


### Performance Improvements

* avoid parse repeatedly ([c6b7352](https://github.com/vuejs/repl/commit/c6b735298d5ab630cdc130aad7b8acaf7c9c41bb))



## [4.1.2](https://github.com/vuejs/repl/compare/v4.1.1...v4.1.2) (2024-04-26)


### Bug Fixes

* dynamic import ([#213](https://github.com/vuejs/repl/issues/213)) ([bb6f1fe](https://github.com/vuejs/repl/commit/bb6f1fe8599f1a11cd1b8aa40a630bea09d2b577))
* fix file rename breaking ([caace63](https://github.com/vuejs/repl/commit/caace639bde964323a253bdcd252a18869973a1d))



## [4.1.1](https://github.com/vuejs/repl/compare/v4.1.0...v4.1.1) (2024-02-14)


### Bug Fixes

* add vue import maps for default import map ([c74673f](https://github.com/vuejs/repl/commit/c74673fb55d2232de55562e62a818142681bdc8b))
* reload preview style error after switching theme ([#214](https://github.com/vuejs/repl/issues/214)) ([bc4c76c](https://github.com/vuejs/repl/commit/bc4c76c3f143b5edc3546d80002cb813704b8351))



# [4.1.0](https://github.com/vuejs/repl/compare/v4.0.2...v4.1.0) (2024-02-11)


### Features

* add `previewTheme` prop ([c830fc4](https://github.com/vuejs/repl/commit/c830fc434a1781523af332d289957bc485f51a0b))



## [4.0.2](https://github.com/vuejs/repl/compare/v4.0.1...v4.0.2) (2024-02-10)


### Bug Fixes

* respect vue version at initialization ([ef22052](https://github.com/vuejs/repl/commit/ef22052055590dbbe6e85e26ce368938b0c93266))



## [4.0.1](https://github.com/vuejs/repl/compare/v4.0.0...v4.0.1) (2024-02-10)


### Bug Fixes

* save version only when serialize ([d3ee13d](https://github.com/vuejs/repl/commit/d3ee13ded3c5a162bf990ef83cb9a38991792170))


### Features

* register language configuration ([3ad7035](https://github.com/vuejs/repl/commit/3ad7035e26cb02626b06e58f53e12ffb5443a5fc))



# [4.0.0](https://github.com/vuejs/repl/compare/v4.0.0-beta.0...v4.0.0) (2024-02-10)


### Features

* expose loading status ([eee6bb3](https://github.com/vuejs/repl/commit/eee6bb38ddecbe8bf7ba3ab77d6a549e654b6313))
* save vue version ([08b4492](https://github.com/vuejs/repl/commit/08b4492fe883bdd4bbe7fd972cd3fbbd8f6416cf))



# [4.0.0-beta.0](https://github.com/vuejs/repl/compare/v4.0.0-alpha.1...v4.0.0-beta.0) (2024-02-10)


### Bug Fixes

* pass readonly in code mirror editor ([1100158](https://github.com/vuejs/repl/commit/1100158aec97dae9cf47ac04ff2bb9ec00d05e58))



# [4.0.0-alpha.1](https://github.com/vuejs/repl/compare/v4.0.0-alpha.0...v4.0.0-alpha.1) (2024-01-24)


### Bug Fixes

* don't re-create import map file ([9e6f078](https://github.com/vuejs/repl/commit/9e6f078206883821d9bc618a194cf50333f38d3d))



# [4.0.0-alpha.0](https://github.com/vuejs/repl/compare/v3.3.0...v4.0.0-alpha.0) (2024-01-21)


### Bug Fixes

* add corresponding black theme background ([#206](https://github.com/vuejs/repl/issues/206)) ([3921c85](https://github.com/vuejs/repl/commit/3921c85f90a40a871838f9740fa3588e2cfa4758))
* don't overwrite `a` tag without href ([#209](https://github.com/vuejs/repl/issues/209)) ([c7fcf38](https://github.com/vuejs/repl/commit/c7fcf381f195ffce6284cc92c26f8a90e09b484a))
* don't show tsconfig if not present ([ca548b2](https://github.com/vuejs/repl/commit/ca548b240addd4f58851a545622684a00eb09a0a))


### Features

* export `package.json` ([79a22de](https://github.com/vuejs/repl/commit/79a22deb84aa50e31cf6506a67e93f69291fb82f))



# [3.3.0](https://github.com/vuejs/repl/compare/v3.2.0...v3.3.0) (2024-01-11)


### Bug Fixes

* default to white color on dark theme ([#202](https://github.com/vuejs/repl/issues/202)) ([481035a](https://github.com/vuejs/repl/commit/481035a443031e50de26b75c8e5b86fbb8ca96f2))
* serialize import maps ([e085e30](https://github.com/vuejs/repl/commit/e085e3041a228fe0ec076056e23e8f55258120ab)), closes [#204](https://github.com/vuejs/repl/issues/204)


### Features

* add theme as classname to sandbox ([#203](https://github.com/vuejs/repl/issues/203)) ([7e9dc0f](https://github.com/vuejs/repl/commit/7e9dc0f3b1f2c488664ccfa22cdf21ba19926158))
* apply theme to preview ([#200](https://github.com/vuejs/repl/issues/200)) ([7ae1061](https://github.com/vuejs/repl/commit/7ae106129274f13393808000fd25995d919ae0bd))
* mutable sfc options ([9e83b09](https://github.com/vuejs/repl/commit/9e83b09344ecc90ad0e28024a9b260fff97ffccd))
* support custom template ([#196](https://github.com/vuejs/repl/issues/196)) ([8038b49](https://github.com/vuejs/repl/commit/8038b49cc5fb76a7dc34acffcda5b3f55ff8aa11))



# [3.2.0](https://github.com/vuejs/repl/compare/v3.1.1...v3.2.0) (2024-01-03)


### Bug Fixes

* **codemirror:** fix codemirror editor showing nothing on start on small layouts when starting in ouput mode ([#181](https://github.com/vuejs/repl/issues/181)) ([6d7598d](https://github.com/vuejs/repl/commit/6d7598d763c79d777efae4e17ef61132930ae9a0))
* **messages:** place error messages in editor in front of bottom toggles ([#183](https://github.com/vuejs/repl/issues/183)) ([b1594d0](https://github.com/vuejs/repl/commit/b1594d07dbb29d7d3c15afa4110a4005d4245297))
* **Preview:** fix style loading delay ([#191](https://github.com/vuejs/repl/issues/191)) ([ece4414](https://github.com/vuejs/repl/commit/ece4414186fab8bb19290ed047e2a4ab665ae3ef))


### Features

* **playground:** use a height of 100dvh with fallback to original 100vh ([#182](https://github.com/vuejs/repl/issues/182)) ([9e99990](https://github.com/vuejs/repl/commit/9e99990f7aa2bd8792510fcc03fda931691e8353))



## [3.1.1](https://github.com/vuejs/repl/compare/v3.1.0...v3.1.1) (2024-01-02)


### Bug Fixes

* pass sfc template options to sfc parse ([d72dfdf](https://github.com/vuejs/repl/commit/d72dfdfd2e2670592c957616fcf4e694609912a0))



# [3.1.0](https://github.com/vuejs/repl/compare/v3.0.1...v3.1.0) (2023-12-21)


### Bug Fixes

* remove onigasm dep ([e7a73ac](https://github.com/vuejs/repl/commit/e7a73ac249ce44a6f4b661f6e6ff4842f3225d6b))


### Features

* use shikiji for more accurate highlight ([#190](https://github.com/vuejs/repl/issues/190)) ([e79aa1a](https://github.com/vuejs/repl/commit/e79aa1af8dc898d9170c5f33ee031ead61f32320))



## [3.0.1](https://github.com/vuejs/repl/compare/v3.0.0...v3.0.1) (2023-12-19)


### Bug Fixes

* ensure reuse AST in non-inline mode ([5e4c710](https://github.com/vuejs/repl/commit/5e4c7101e4b6cc27fb0810390b0ca0287a101149))



# [3.0.0](https://github.com/vuejs/repl/compare/v2.9.0...v3.0.0) (2023-11-30)


### Bug Fixes

* handle main file src prefix when setting files + avoid infinite loop due to state.error push ([743b731](https://github.com/vuejs/repl/commit/743b73121dbd63f164a013c8ba722d0a8bfe5ebd))
* make main repl styles lower specificity for easier override ([fbfaa44](https://github.com/vuejs/repl/commit/fbfaa4495c9bbf3ab936bec27445c52c9521b67e))



# [2.9.0](https://github.com/vuejs/repl/compare/v2.8.1...v2.9.0) (2023-11-30)


### Bug Fixes

* **types:** fix editor prop types ([828f202](https://github.com/vuejs/repl/commit/828f2027ff3986a029de3833f521525c7ac3e1d7))


### Features

* support custom element styles ([#173](https://github.com/vuejs/repl/issues/173)) ([812730d](https://github.com/vuejs/repl/commit/812730db62b6f1865cee90b67f9f593412a0dce6))



## [2.8.1](https://github.com/vuejs/repl/compare/v2.8.0...v2.8.1) (2023-11-28)


### Bug Fixes

* new sfc file template ([79643d7](https://github.com/vuejs/repl/commit/79643d71a5eabd7e7c9c092e8501cc07f9ee5136))
* worker plugins for vite 5 ([6e66250](https://github.com/vuejs/repl/commit/6e6625084d0c9ba8c24915ebd1060b7421e0de5b))



# [2.8.0](https://github.com/vuejs/repl/compare/v2.7.0...v2.8.0) (2023-11-19)


### Features

* add template for new file ([9a0be1d](https://github.com/vuejs/repl/commit/9a0be1df8c06ffdeab2985f9e9cd5f2cde1437fe))



# [2.7.0](https://github.com/vuejs/repl/compare/v2.6.3...v2.7.0) (2023-11-12)


### Features

* support toggling between dev/prod for Vue runtime ([8d3a2e6](https://github.com/vuejs/repl/commit/8d3a2e62358104663af48531467ac8eda4bafffa))



## [2.6.3](https://github.com/vuejs/repl/compare/v2.6.2...v2.6.3) (2023-11-03)



## [2.6.2](https://github.com/vuejs/repl/compare/v2.6.1...v2.6.2) (2023-11-01)



## [2.6.1](https://github.com/vuejs/repl/compare/v2.6.0...v2.6.1) (2023-10-26)



# [2.6.0](https://github.com/vuejs/repl/compare/v2.5.8...v2.6.0) (2023-10-26)


### Features

* add layout reverse api [#162](https://github.com/vuejs/repl/issues/162) ([#163](https://github.com/vuejs/repl/issues/163)) ([c1cd77a](https://github.com/vuejs/repl/commit/c1cd77a913b050e2fb3d921d4dcd86a1db74b8b1))
* support custom display placeholder content ([#160](https://github.com/vuejs/repl/issues/160)) ([9ca27a1](https://github.com/vuejs/repl/commit/9ca27a12cf92b6ac6b7132a5c2ae667a13af4faa))



## [2.5.8](https://github.com/vuejs/repl/compare/v2.5.7...v2.5.8) (2023-08-10)


### Bug Fixes

* don't set editor value if not changed ([bd59eef](https://github.com/vuejs/repl/commit/bd59eefb1d2731179f772ab118ee642f453fa5d2)), closes [#147](https://github.com/vuejs/repl/issues/147)



## [2.5.7](https://github.com/vuejs/repl/compare/v2.5.6...v2.5.7) (2023-08-08)


### Bug Fixes

* respect value from monaco editor props ([49fdc71](https://github.com/vuejs/repl/commit/49fdc7161ec91fed617043aca0b751858a10289e)), closes [#145](https://github.com/vuejs/repl/issues/145)



## [2.5.6](https://github.com/vuejs/repl/compare/v2.5.5...v2.5.6) (2023-07-31)


### Bug Fixes

* remove preinstall ([8e41043](https://github.com/vuejs/repl/commit/8e410433eb46b45845c39aca8ad2895c3fabae12)), closes [/github.com/vuejs/repl/commit/569fe6275db45a420850cac9419b4614a51a360e#r123111912](https://github.com//github.com/vuejs/repl/commit/569fe6275db45a420850cac9419b4614a51a360e/issues/r123111912)



## [2.5.5](https://github.com/vuejs/repl/compare/v2.5.4...v2.5.5) (2023-07-09)


### Features

* expose dependency version ([aecfd8a](https://github.com/vuejs/repl/commit/aecfd8a92e6e7814dd6dbd5d5e94f71ef9fe5b1a))



## [2.5.4](https://github.com/vuejs/repl/compare/v2.5.3...v2.5.4) (2023-07-09)


### Bug Fixes

* replace NODE_ENV ([863f8f3](https://github.com/vuejs/repl/commit/863f8f39d36d25240388a9c5bc68eff0ea7e7856))



## [2.5.3](https://github.com/vuejs/repl/compare/v2.5.2...v2.5.3) (2023-07-08)


### Bug Fixes

* filename index auto-increment ([#133](https://github.com/vuejs/repl/issues/133)) ([4f55810](https://github.com/vuejs/repl/commit/4f55810f729fc61e22eafa7ea69afe79bcfe1cb6))
* make reloadLanguageTools optional ([5ab1a2d](https://github.com/vuejs/repl/commit/5ab1a2d149820ecb737c3bc97581a87f3adc83d7))
* use dev version of compiler ([#132](https://github.com/vuejs/repl/issues/132)) ([bfc3522](https://github.com/vuejs/repl/commit/bfc3522422926b0e3f18c1368111066cf268e206))



## [2.5.2](https://github.com/vuejs/repl/compare/v2.5.1...v2.5.2) (2023-07-06)


### Bug Fixes

* remove postinstall ([8167272](https://github.com/vuejs/repl/commit/816727232d0adac0c0955c1d6bee9d7be7f70d61))



## [2.5.1](https://github.com/vuejs/repl/compare/v2.5.0...v2.5.1) (2023-07-05)


### Bug Fixes

* cannot get ts module in prod env ([0cc220d](https://github.com/vuejs/repl/commit/0cc220d7efaafaaa3b8af07c34fd27c7825caa8b))
* cdn file models were accidentally disposed ([4301d86](https://github.com/vuejs/repl/commit/4301d8659ad84d9c6b66d63f1567cf31119eb9f4))


### Features

* use ts version option for ts lib dts acquire ([376fe3b](https://github.com/vuejs/repl/commit/376fe3ba2582fc128ccc4bbb2cd4b19666a5f1ec))



# [2.5.0](https://github.com/vuejs/repl/compare/v2.4.0...v2.5.0) (2023-07-05)


### Bug Fixes

* change message toggle position ([#120](https://github.com/vuejs/repl/issues/120)) ([3f7e090](https://github.com/vuejs/repl/commit/3f7e090c143ca0a40b0bff1d13f2db3e6964b17a))


### Features

* download TS dynamically ([#125](https://github.com/vuejs/repl/issues/125)) ([97f698f](https://github.com/vuejs/repl/commit/97f698f1f88690ab371e156ac2113955fdaa5fa8))
* expose TS localized languages ([a52dd14](https://github.com/vuejs/repl/commit/a52dd1468a6d6fb8ce4927a0a6771529f6a0f1ab))
* respect browser language ([f9fedcd](https://github.com/vuejs/repl/commit/f9fedcd1ca56a6965c9617a16d2fba834f8a44a1)), closes [#123](https://github.com/vuejs/repl/issues/123)
* upgrade volar ([d925ba3](https://github.com/vuejs/repl/commit/d925ba3c8a08966eab06eaf2720a7476415e7760))



# [2.4.0](https://github.com/vuejs/repl/compare/v2.3.0...v2.4.0) (2023-06-28)


### Bug Fixes

* multiple style tags ([#116](https://github.com/vuejs/repl/issues/116)) ([f0f5512](https://github.com/vuejs/repl/commit/f0f5512f49832321a6c96631025927635a834d9a))
* strip src prefix on dialog ([d29d1de](https://github.com/vuejs/repl/commit/d29d1de3f31930005dfc0b29f7d8a0435c0f94a4))


### Features

* add `reload` function ([#103](https://github.com/vuejs/repl/issues/103)) ([12ebcea](https://github.com/vuejs/repl/commit/12ebceab49c2a56702fffdfc01bb8b0bc3a708ca))
* add monaco light theme ([#121](https://github.com/vuejs/repl/issues/121)) ([ead9667](https://github.com/vuejs/repl/commit/ead9667a85c1f217dab5955ebd9a11992b3fbe65))
* memorize show error state ([#117](https://github.com/vuejs/repl/issues/117)) ([ab4b7cd](https://github.com/vuejs/repl/commit/ab4b7cd4d2c99b2750e29feaa0b3487f4bb8ed85))



# [2.3.0](https://github.com/vuejs/repl/compare/v2.2.0...v2.3.0) (2023-06-24)


### Features

* add tsconfig file ([#114](https://github.com/vuejs/repl/issues/114)) ([29f6af5](https://github.com/vuejs/repl/commit/29f6af5037826a6d37f77ba4cae748e7297152e3))



# [2.2.0](https://github.com/vuejs/repl/compare/v2.1.4...v2.2.0) (2023-06-24)


### Bug Fixes

* don't dispose in-memory files ([5f543da](https://github.com/vuejs/repl/commit/5f543da6815e30c76dc3a595b993a380043af54b))
* set page height ([ee814e7](https://github.com/vuejs/repl/commit/ee814e7313162f19d45dcff7a3ecabedfdf081d5)), closes [#112](https://github.com/vuejs/repl/issues/112)


### Features

* add default height for Repl component ([#109](https://github.com/vuejs/repl/issues/109)) ([d9673eb](https://github.com/vuejs/repl/commit/d9673eb4c7a3e20ca7d0f1e152d177c6c1f8956d))
* add error toggle ([#98](https://github.com/vuejs/repl/issues/98)) ([51819cc](https://github.com/vuejs/repl/commit/51819ccd3adcd40c189bd216f635ca6f62c4bc56))



## [2.1.4](https://github.com/vuejs/repl/compare/v2.1.3...v2.1.4) (2023-06-23)


### Bug Fixes

* default main file path ([c0184da](https://github.com/vuejs/repl/commit/c0184da073456706c44cc5e78e2d3283f4d3fe0f))
* **monaco:** enable `fixedOverflowWidgets` option ([#110](https://github.com/vuejs/repl/issues/110)) ([c7ddf12](https://github.com/vuejs/repl/commit/c7ddf12f25b23675c12c2760297c7d7d37668943))



## [2.1.3](https://github.com/vuejs/repl/compare/v2.1.2...v2.1.3) (2023-06-22)


### Bug Fixes

* actually fix editor type lol ([95ab2ab](https://github.com/vuejs/repl/commit/95ab2abc29b01a565ba7bc25ef293f1434db5ef6))



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


### Bug Fixes

* disable pug and script setup codeLens ([1c6e646](https://github.com/vuejs/repl/commit/1c6e6464bea009b279fe43ed401e722230bf95bd))
* don't delete dts models ([d04a1ed](https://github.com/vuejs/repl/commit/d04a1ed01a9f5aaeafc6845d6165dcc9b45b7a04))
* f@ck ([0aa0a24](https://github.com/vuejs/repl/commit/0aa0a24e9c196d846827623b48b5eace0b8498a0))
* larger font size ([#100](https://github.com/vuejs/repl/issues/100)) ([a1a3fe1](https://github.com/vuejs/repl/commit/a1a3fe1294cf0daa89e30902d607addbdd525b6e))
* make monaco editor works normally ([f538199](https://github.com/vuejs/repl/commit/f538199e5cd99c380b3b5468cc660d47a6910783))
* minor fix ([aacba06](https://github.com/vuejs/repl/commit/aacba0673414b759377e3cbfa764bff82d64f857))
* split monaco out ([fd0b06a](https://github.com/vuejs/repl/commit/fd0b06af78e25632ee4fd6525ae5c90ef2c51f0b))
* styles ([6aee9cf](https://github.com/vuejs/repl/commit/6aee9cfa7df19de0f60f0d9fe2ccbd2291998cbb))
* update exports and types ([e4988b0](https://github.com/vuejs/repl/commit/e4988b0a9ddbc9888e481fd8f1c000b1756a5ba5))
* use monaco-volar ([9846c8e](https://github.com/vuejs/repl/commit/9846c8e67720c2d7402d52bc1c2106a9a1b28c08))
* use worker ([e1e80b9](https://github.com/vuejs/repl/commit/e1e80b9e40805bd541ccd80d48b01228378bf2c7))


### Features

* add ls ([a7bffd6](https://github.com/vuejs/repl/commit/a7bffd64c43e8ff375f1e59b62c78ca13969c723))
* complete provideDefinition ([2035fc4](https://github.com/vuejs/repl/commit/2035fc49977e5c2f5e8c57fe80c0bb53bb85df70))
* completed provideCompletionItems ([81ef510](https://github.com/vuejs/repl/commit/81ef51028f9188fcf598e78e45836f09b9f191ae))
* completed provideHover ([3922239](https://github.com/vuejs/repl/commit/39222398316adfda107f2b00d2cc27523f6cef52))
* completed provideSignatureHelp ([c599f2b](https://github.com/vuejs/repl/commit/c599f2bdf136d0d02e0c2f50198d8f71f0e858f2))
* completed setModelMarkers ([86079ad](https://github.com/vuejs/repl/commit/86079ad2030559052cef8b32e0d4a301a62b5f65))
* implemented provideCodeActions, resolveCodeAction ([1d37f55](https://github.com/vuejs/repl/commit/1d37f55eacb4124171813d1db777496aa1bddeb3))
* implemented provideCodeLenses, resolveCodeLens ([bddb65b](https://github.com/vuejs/repl/commit/bddb65b19053f069de3a3366666e3db1fd6bd6b1))
* implemented provideDeclaration ([8e437f0](https://github.com/vuejs/repl/commit/8e437f0e8796ba3b8d7a19478fc1b9bcde6f2e43))
* implemented provideDocumentColors, provideColorPresentations ([ddde114](https://github.com/vuejs/repl/commit/ddde1140945ac819765d93c7e33b07046fca55a6))
* implemented provideDocumentFormattingEdits ([73f046d](https://github.com/vuejs/repl/commit/73f046d80cd17c9dea7051f6d488e3b757366ad9))
* implemented provideDocumentHighlights ([f782496](https://github.com/vuejs/repl/commit/f7824960cb34f4ee2b58ad37a2af1a9364367b7a))
* implemented provideDocumentRangeFormattingEdits ([0e64a81](https://github.com/vuejs/repl/commit/0e64a81a57e2e973d95bcf3bba03c43f48abc508))
* implemented provideDocumentSymbols ([1cda6c6](https://github.com/vuejs/repl/commit/1cda6c638223c3d26f1b07deb24c6ba7b699014b))
* implemented provideFoldingRanges ([dd083d3](https://github.com/vuejs/repl/commit/dd083d3b246b5db8e7a158585e0fc912c9dd03ce))
* implemented provideImplementation ([49d8d7e](https://github.com/vuejs/repl/commit/49d8d7e52b34e94956a1e93bd7c98452d96831dd))
* implemented provideInlayHints ([61d18c9](https://github.com/vuejs/repl/commit/61d18c97d9ea309a48ff50188661bcbfe97312a4))
* implemented provideLinkedEditingRanges ([1046ac8](https://github.com/vuejs/repl/commit/1046ac8a29045b7a326002cb3fec9387675d9b33))
* implemented provideLinks ([3bc4063](https://github.com/vuejs/repl/commit/3bc406352ac7ce697e7d6c4b83f7ff737adede08))
* implemented provideOnTypeFormattingEdits ([f50e1c9](https://github.com/vuejs/repl/commit/f50e1c9c1ef7ed0ea02d51cdaaa5802f69911c7f))
* implemented provideReferences ([6b05d17](https://github.com/vuejs/repl/commit/6b05d1726d3e06c36008b847a55978e1e7b99843))
* implemented provideRenameEdits ([5ca6318](https://github.com/vuejs/repl/commit/5ca63181a2beebcc180282cd70f6732e572fd51d))
* implemented provideSelectionRanges ([2037d73](https://github.com/vuejs/repl/commit/2037d73ded9944b10a4379d369aeec06a304df97))
* implemented provideTypeDefinition ([b80bb0d](https://github.com/vuejs/repl/commit/b80bb0da90481cbebb214abf4a333daa7c4a42e9))
* implemented resolveCompletionItem ([3ef6ffd](https://github.com/vuejs/repl/commit/3ef6ffdf58a66f74a8903b7479b43195b13aeb69))
* **monaco:** support to keep selection and cursor position ([#99](https://github.com/vuejs/repl/issues/99)) ([db8c1bd](https://github.com/vuejs/repl/commit/db8c1bdd13ac44c15336795387aa8e7a449dfd74))
* pass vue dts module version from store ([2a0dfc0](https://github.com/vuejs/repl/commit/2a0dfc011a547d61523e5f64d882e5ed940bbb30))
* support auto close tag / auto .value ([f765d54](https://github.com/vuejs/repl/commit/f765d54a69ef6aca5586873d19cf3f666adeb0c5))
* support omitting ts/js extensions ([130a137](https://github.com/vuejs/repl/commit/130a137dd9640ea912e68d27e390dd03664e2699))
* upgrade volar ([0783d93](https://github.com/vuejs/repl/commit/0783d93fdd310e92ae3b2e22b0dc6ea78f93beaf))
* upgrade volar ([0aac8d1](https://github.com/vuejs/repl/commit/0aac8d11632e0963e0ae3de4e02cf47a16deec60))
* use monaco ([e833cf1](https://github.com/vuejs/repl/commit/e833cf14d447063654a02a83ba12fd23c8619c77))


### Performance Improvements

* cache `ts.ScriptSnapshot.fromString` ([6f34b78](https://github.com/vuejs/repl/commit/6f34b78d7d637d8fc238ca68c8beb87884f110b0))
* preset failed node_modules paths to speed up dts acquisition ([e93f049](https://github.com/vuejs/repl/commit/e93f0499719595aad61473b0b7819ece1b46818e))



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



