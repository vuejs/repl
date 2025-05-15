# Vue REPL Playground

Optimize `test/main` to support dynamically adding scenario validations for the REPL. Use `npm run dev:playground` to try it out.

## Playground Architecture

### Directory Structure

```
playground/
├── index.html                # HTML entry file with scenario switcher
├── vite.config.ts            # Standalone Vite config
├── vite-plugin-scenario.js   # Parse scenarios directory and generate REPL configuration
├── scenarios/                # Scenario directory, add dynamically
│   ├── basic/                # Basic example
│   ├── customMain/           # Custom main entry
│   ├── pinia/                # Pinia state management example
│   └── vueRouter/            # Vue Router example
└── src/
  └── App.vue               # Main application component
```

### How It Works

The playground uses a directory-based scenario system, where each scenario is an independent folder under `scenarios/`. Core features include:

- **Virtual Module System**: A Vite plugin scans the scenario directory and generates a virtual module `virtual:playground-files`
- **Dynamic Scenario Loading**: Users can switch scenarios via the UI, which automatically loads the corresponding configuration

### Scenario Structure

Each scenario directory typically contains the following files:

```
scenarios/example-scenario/
├── App.vue          # Main component
├── main.ts          # Entry file
├── import-map.json  # Dependency mapping
├── tsconfig.json    # TypeScript config
└── _meta.js         # Metadata config for REPL settings
```

The `_meta.js` file exports the scenario configuration:

```javascript
export default {
  mainFile: 'main.ts', // Specify the main entry file
}
```

## Usage Example

### Start the Playground

```bash
# Enter the project directory
cd vue-repl

# Install dependencies
npm install

# Start the development server
npm run dev:playground
```

Visit the displayed local address (usually http://localhost:5174/) to use the playground.

### Add a New Scenario

1. Create a new folder under the `scenarios/` directory, e.g. `myScenario`
2. Add the required files:

   ```
   myScenario/
   ├── App.vue          # Main component
   ├── main.ts          # Entry file (default entry)
   ├── import-map.json  # Dependency config
   ├── tsconfig.json    # TypeScript config
   └── _meta.js         # Config with mainFile: 'main.ts'
   ```

3. Refresh the browser, and the new scenario will automatically appear in the dropdown menu.
