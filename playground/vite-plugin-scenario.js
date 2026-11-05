/**
 * Vite Scenario Plugin
 *
 * This plugin provides file system-based scenario configuration management for the Vue REPL Playground.
 * It dynamically scans the scenarios directory and generates configuration objects for REPL usage.
 *
 * Features:
 * - Automatically scans scenario directories under scenarios
 * - Supports hot updates: regenerates config when scenario files change
 * - Uses _meta.js for scenario metadata
 *
 * Usage:
 * 1. Create a scenario subdirectory under `scenarios`
 * 2. Add necessary files in each scenario directory (App.vue, main.ts, etc.)
 * 3. Add a _meta.js file to configure scenario metadata
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Get current file directory
const __dirname = path.dirname(fileURLToPath(import.meta.url))

/**
 * Scenario plugin
 * Provides the virtual module 'virtual:playground-files' for runtime dynamic scenario config generation
 */
export default function scenarioPlugin() {
  let server
  const scenariosPath = path.resolve(__dirname, 'scenarios')
  const VIRTUAL_MODULE_ID = 'virtual:playground-files'
  const RESOLVED_VIRTUAL_MODULE_ID = '\0' + VIRTUAL_MODULE_ID

  return {
    name: 'vite-plugin-scenario',

    configureServer(_server) {
      server = _server

      // Watch for changes in the scenarios directory
      const watcher = server.watcher
      watcher.add(scenariosPath)

      // On file changes in scenarios, reload the virtual module
      watcher.on('add', handleFileChange)
      watcher.on('change', handleFileChange)
      watcher.on('unlink', handleFileChange)

      function handleFileChange(file) {
        // Check if the changed file is under scenarios
        if (file.startsWith(scenariosPath)) {
          console.log(
            `[vite-plugin-scenario] Scenario file changed: ${path.relative(scenariosPath, file)}`,
          )
          // Notify client that the module needs to update
          server.moduleGraph
            .getModuleById(RESOLVED_VIRTUAL_MODULE_ID)
            ?.importers.forEach((importer) => {
              server.moduleGraph.invalidateModule(importer)
              server.ws.send({
                type: 'update',
                updates: [
                  {
                    type: 'js-update',
                    path: importer.url,
                    acceptedPath: importer.url,
                  },
                ],
              })
            })

          // Invalidate the module directly to ensure regeneration on next request
          server.moduleGraph.invalidateModule(
            server.moduleGraph.getModuleById(RESOLVED_VIRTUAL_MODULE_ID),
          )
        }
      }
    },

    resolveId(id) {
      if (id === VIRTUAL_MODULE_ID) {
        return RESOLVED_VIRTUAL_MODULE_ID
      }
    },

    async load(id) {
      if (id === RESOLVED_VIRTUAL_MODULE_ID) {
        try {
          // Scan scenario directory and generate config
          const config = await generateConfig(scenariosPath)

          // Ensure at least one scenario exists
          if (Object.keys(config).length === 0) {
            console.warn(
              '[vite-plugin-scenario] Warning: No scenarios found, providing default scenario',
            )
            // Provide a default scenario to prevent frontend errors
            return `export default {
              "demo1": {
                "files": {
                  "App.vue": "<template>\\n  <div>\\n    <h1>Welcome to Vue REPL</h1>\\n    <p>Please create scenarios in src/scenarios</p>\\n  </div>\\n</template>",
                  "main.ts": "import { createApp } from 'vue';\\nimport App from './App.vue';\\n\\nconst app = createApp(App);\\napp.mount('#app');"
                },
                "mainFile": "main.ts"
              }
            }`
          }

          return `export default ${JSON.stringify(config, null, 2)}`
        } catch (error) {
          console.error(
            '[vite-plugin-scenario] Error generating config:',
            error,
          )
          // Return a basic config to avoid frontend errors
          return `export default {
            "error": {
              "files": {
                "App.vue": "<template>\\n  <div>\\n    <h1>Error</h1>\\n    <p>An error occurred while loading scenarios. Check the console.</p>\\n  </div>\\n</template>",
                "main.ts": "import { createApp } from 'vue';\\nimport App from './App.vue';\\n\\nconst app = createApp(App);\\napp.mount('#app');"
              },
              "mainFile": "main.ts"
            }
          }`
        }
      }
    },
  }
}

/**
 * Scan scenario directory and generate config object with parallel processing
 * @param {string} scenariosPath - Path to scenarios directory
 * @returns {Promise<object>} - Config object
 */
async function generateConfig(scenariosPath) {
  const config = {}

  try {
    // Check if scenarios directory exists
    try {
      await fs.promises.access(scenariosPath)
    } catch (err) {
      console.warn(
        `[vite-plugin-scenario] Scenarios directory does not exist: ${scenariosPath}, creating it`,
      )
      // Create scenarios directory
      await fs.promises.mkdir(scenariosPath, { recursive: true })
      console.log(
        `[vite-plugin-scenario] Scenarios directory created: ${scenariosPath}`,
      )
      return config // Return empty config
    }

    const dirs = await fs.promises.readdir(scenariosPath)

    // Process all scenario directories in parallel
    const scenarioPromises = dirs.map(async (dir) => {
      const scenarioPath = path.join(scenariosPath, dir)
      const stat = await fs.promises.stat(scenarioPath)

      if (!stat.isDirectory()) return null

      // Read all files in the scenario
      const allFiles = await fs.promises.readdir(scenarioPath)
      let meta = { mainFile: 'main.ts' } // Default metadata

      // Handle metadata file first to get metadata before other files
      const metaFile = allFiles.find((file) => file === '_meta.js')
      if (metaFile) {
        const metaFilePath = path.join(scenarioPath, metaFile)
        try {
          // Use dynamic import to properly load the ES module
          // This is safer and more reliable than regex extraction
          // Convert to absolute path URL for dynamic import
          // Add timestamp to URL to bypass module cache
          const fileUrl = `file://${path.resolve(metaFilePath)}?t=${Date.now()}`

          // Dynamically import the metadata module
          const metaModule = await import(fileUrl)

          if (metaModule.default) {
            // Deep merge the metadata with defaults
            // This ensures all ReplOptions properties are properly merged
            meta = { ...(meta || {}), ...(metaModule.default || {}) }
            console.log(
              `[vite-plugin-scenario] Loaded scenario metadata: ${dir}`,
              meta,
            )
          }
        } catch (error) {
          console.error(
            `[vite-plugin-scenario] Unable to load metadata file: ${metaFilePath}`,
            error,
          )
        }
      }

      // Read all scenario files in parallel
      const filePromises = allFiles
        .filter((file) => !file.startsWith('.') && file !== '_meta.js')
        .map(async (file) => {
          const filePath = path.join(scenarioPath, file)
          try {
            const content = await fs.promises.readFile(filePath, 'utf-8')
            return [file, content] // Return as key-value pair
          } catch (error) {
            console.error(
              `[vite-plugin-scenario] Error reading file: ${filePath}`,
              error,
            )
            return [file, ''] // Return empty content on error
          }
        })

      // Wait for all file reading promises to complete
      const fileEntries = await Promise.all(filePromises)
      const files = Object.fromEntries(fileEntries)

      // Build complete scenario configuration
      // Structure it to match what REPL expects: files object + options
      const scenarioConfig = {
        // Files must be in this format for REPL
        files,
        // all meta config support extend
        ...meta,
      }

      // Return scenario name and its configuration
      return [dir, scenarioConfig]
    })

    // Wait for all scenario processing to complete
    const scenarioResults = await Promise.all(scenarioPromises)

    // Filter out null results (non-directories) and build config object
    scenarioResults
      .filter((result) => result !== null)
      .forEach(([scenarioName, scenarioConfig]) => {
        config[scenarioName] = scenarioConfig
      })

    console.log(
      `[vite-plugin-scenario] Config generated, scenarios: ${Object.keys(config).join(', ')}`,
    )
    return config
  } catch (error) {
    console.error(
      '[vite-plugin-scenario] Error generating scenario config:',
      error,
    )
    return {}
  }
}
