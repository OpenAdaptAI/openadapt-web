import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const security = fs.readFileSync(path.join(root, 'pages/security.js'), 'utf8')

test('trust center describes the privileged MFA and account-menu contract', () => {
    assert.match(security, /two-factor authentication is[\s\S]*enforced for[\s\S]*privileged access/i)
    assert.match(security, /platform-admin console[\s\S]*server-side administrator[\s\S]*current two-factor session/i)
    assert.match(security, /one current 6-digit code[\s\S]*returns the user to the protected page/i)
    assert.match(security, /organization switching[\s\S]*explicit[\s\S]*sign-out action/i)
    assert.match(security, /docs\.openadapt\.ai\/guides\/account-security/)
})
