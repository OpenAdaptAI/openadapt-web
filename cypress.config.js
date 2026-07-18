const { defineConfig } = require('cypress')

module.exports = defineConfig({
    allowCypressEnv: false,
    expose: {
        // Netlify exposes CONTEXT to build plugins. Keep preview and local
        // checks fail-closed while allowing the production suite to assert the
        // already-qualified live checkout contract.
        deploymentContext: process.env.CONTEXT || 'local',
    },
    e2e: {
        baseUrl: 'http://localhost:8888',
        supportFile: false,
    },
})
