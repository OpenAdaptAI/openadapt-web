const { defineConfig } = require('cypress')

module.exports = defineConfig({
    allowCypressEnv: false,
    e2e: {
        baseUrl: 'http://localhost:8888',
        supportFile: false,
    },
})
