# Port Configuration for QA Automation

## Overview
The QA automation pipeline uses different ports for different test suites to enable parallel execution without conflicts.

## Port Assignments

### Port 3000 - Playwright Visual Tests
- **Used by**: Playwright visual regression tests
- **Configuration**: `playwright.visual.config.ts`
- **Script**: `npm run test:visual`
- **GitHub Action**: `visual-testing` job

### Port 3001 - Lighthouse CI Performance Tests
- **Used by**: Lighthouse CI performance testing
- **Configuration**: `lighthouse.config.js`
- **Script**: `npm run lighthouse:ci`
- **GitHub Action**: `performance-testing` job

## GitHub Actions Workflow

The QA automation workflow (`qa-automation.yml`) has been updated to:

1. **Use the correct npm scripts**:
   - `npm run lighthouse:ci` for performance testing
   - `npm run test:visual` for visual regression testing

2. **Run tests in parallel**:
   - Both `performance-testing` and `visual-testing` jobs depend only on `build-and-test`
   - They can run simultaneously without port conflicts

3. **Environment variables**:
   - Both jobs use the same environment variables for Supabase configuration
   - Placeholder values are used if secrets are not available

## Configuration Files

### Lighthouse CI (`lighthouse.config.js`)
```javascript
url: ['http://localhost:3001/lighthouse-test.html']
```

### Playwright Visual (`playwright.visual.config.ts`)
```javascript
url: 'http://localhost:3000'
env: {
  PORT: '3000'
}
```

## Benefits

1. **Parallel Execution**: Tests can run simultaneously without conflicts
2. **Faster CI/CD**: Reduced total execution time
3. **Resource Efficiency**: Better utilization of CI resources
4. **Isolation**: Each test suite has its own port space

## Troubleshooting

If you encounter port conflicts:

1. **Check running processes**: `lsof -i :3000` and `lsof -i :3001`
2. **Kill conflicting processes**: Use the cleanup script if needed
3. **Verify configuration**: Ensure the correct config files are being used
4. **Check environment variables**: Make sure Supabase credentials are properly set

## Local Development

For local testing, you can run:

```bash
# Run Lighthouse CI (uses port 3001)
npm run lighthouse:ci

# Run Visual Tests (uses port 3000)
npm run test:visual

# Run both in parallel (different terminals)
npm run lighthouse:ci &
npm run test:visual
```
