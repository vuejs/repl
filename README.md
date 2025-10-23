This is a demonstration of running a fork of the Vue SFC Sandbox with your own design system.

_This approach requires publishing your design system as a **public** npm package._

In this demonstration, our design system is the package `sample-vue-library` maintained here: https://github.com/dwjohnston/sample-vue-library
See that repository for an outline of how to create a vue package.

## How it works

1. We declare `sample-vue-library` as a dependency. [link](https://github.com/dwjohnston/vue-repl/commit/63207902627bb97e504957c01f6e9d461804ae6e#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R122-R123)
2. We re-export everything from the library in a simple barrel file: [link](https://github.com/dwjohnston/vue-repl/commit/63207902627bb97e504957c01f6e9d461804ae6e#diff-d0c67314b79fa81f28ccaed057229681b31c3cc913a00d96ebd010f2a71c9c4bR1)
