This is a demonstration of running a fork of the Vue SFC Sandbox with your own design system.

_This approach requires publishing your design system as a **public** npm package._

In this demonstration, our design system is the package `sample-vue-library` maintained here: https://github.com/dwjohnston/sample-vue-library
See that repository for an outline of how to create a vue package.

## How it works

1. We declare `sample-vue-library` as a dependency. [link](https://github.com/dwjohnston/vue-repl/commit/63207902627bb97e504957c01f6e9d461804ae6e#diff-7ae45ad102eab3b6d7e7896acd08c427a9b25b346470d7bc6507b6481575d519R122-R123)
2. We re-export everything from the library in a simple barrel file: [link](https://github.com/dwjohnston/vue-repl/commit/63207902627bb97e504957c01f6e9d461804ae6e#diff-d0c67314b79fa81f28ccaed057229681b31c3cc913a00d96ebd010f2a71c9c4bR1)
3. We reference this barrel file in the import maps: [link](https://github.com/dwjohnston/vue-repl/commit/63207902627bb97e504957c01f6e9d461804ae6e#diff-50b3264cd5c4b065ce292b3a12cd9877205cfc2f808ce77e2f7574b913706fb7R54)

At this point you should be able to use your component, but the CSS won't work.

The Playground does some kind of magic where it goes off to jsdelivr to fetch the typings - this is why your package needs to be published publically.

4. Create a script that will get the css from your package, and create a file exporting it as a single string variable.
   (This should be absolutely fine - [max length of a string variable](https://stackoverflow.com/a/33768639/1068446))

Update the preview template to have this css be inlined style tag.

https://github.com/dwjohnston/vue-repl/commit/a94c0c5e22623a068b9f5cac6cc532000a55980c

5. Update your template for ease of use

https://github.com/dwjohnston/vue-repl/commit/83a272ff28e62066595b32957517d4f85037f169

That's it! All the best!
