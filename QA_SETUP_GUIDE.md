# QA Automation Setup Guide

This guide will help you set up comprehensive QA automation for your Design System Advisor platform with GitHub integration.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Playwright Browsers

```bash
npx playwright install
```

### 3. Set Up Environment Variables

Create a `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Tests Locally

```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui

# Run specific test suite
npx playwright test tests/accessibility.spec.ts

# Generate test report
npm run test:report
```

## 🔧 GitHub Actions Setup

### 1. Repository Secrets

Add these secrets to your GitHub repository (Settings > Secrets and variables > Actions):

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

### 2. Workflow Triggers

The QA workflow will run on:
- **Push** to main/develop branches
- **Pull requests** to main/develop branches
- **Daily at 2 AM UTC** (scheduled)
- **Manual trigger** (workflow_dispatch)

### 3. Workflow Jobs

The automation includes:

1. **Code Quality**: ESLint, TypeScript, security audit
2. **Build & Test**: Application build verification
3. **Performance Testing**: Lighthouse CI for performance metrics
4. **Visual Testing**: Playwright visual regression tests
5. **Security Scanning**: CodeQL and Trivy vulnerability scanning
6. **Report Generation**: Automated QA reports

## 📊 QA Reports

### Automatic Reports

- **Pull Request Comments**: QA results posted as PR comments
- **Artifact Storage**: Test results stored as GitHub artifacts
- **Lighthouse Reports**: Performance and accessibility metrics
- **Security Alerts**: Vulnerability scanning results

### Manual Report Generation

```bash
# Generate Lighthouse report
npm run lighthouse

# View Playwright test report
npm run test:report
```

## 🎯 QA Coverage

### Code Quality
- ✅ ESLint code linting
- ✅ TypeScript type checking
- ✅ Security vulnerability scanning
- ✅ Dependency audit

### Performance
- ✅ Lighthouse CI performance testing
- ✅ Core Web Vitals monitoring
- ✅ Accessibility compliance (WCAG)
- ✅ SEO best practices

### Visual Testing
- ✅ Cross-browser compatibility (Chrome, Firefox, Safari)
- ✅ Mobile responsiveness testing
- ✅ Visual regression detection
- ✅ Component-level testing

### Integration Testing
- ✅ User flow testing
- ✅ API integration testing
- ✅ Authentication flow testing
- ✅ File upload functionality

## 🔍 Customizing QA Tests

### Adding New Tests

1. **Accessibility Tests**: Add to `tests/accessibility.spec.ts`
2. **Visual Tests**: Add to `tests/visual.spec.ts`
3. **Integration Tests**: Add to `tests/integration.spec.ts`

### Example: Adding a New Test

```typescript
// tests/custom.spec.ts
import { test, expect } from '@playwright/test';

test('custom functionality test', async ({ page }) => {
  await page.goto('/your-page');
  await expect(page.locator('your-selector')).toBeVisible();
});
```

### Customizing Lighthouse

Edit `lighthouse.config.js` to adjust performance thresholds:

```javascript
assert: {
  assertions: {
    'categories:performance': ['warn', { minScore: 0.9 }], // Increase threshold
    'categories:accessibility': ['error', { minScore: 0.95 }], // Stricter accessibility
  },
}
```

## 📈 Monitoring & Alerts

### GitHub Integration

- **Status Checks**: Required status checks for PRs
- **Branch Protection**: Enforce QA passing before merge
- **Issue Creation**: Automatic issue creation for failed tests

### Notification Setup

1. **Slack Integration**: Add Slack webhook to GitHub Actions
2. **Email Notifications**: Configure email alerts for failures
3. **Dashboard Monitoring**: Use GitHub's built-in monitoring

## 🛠️ Advanced Configuration

### Custom QA Agents

You can extend the automation with:

1. **AI Code Review**: Integrate with GitHub Copilot or custom AI
2. **Custom Metrics**: Add business-specific quality metrics
3. **Third-party Tools**: Integrate with tools like SonarQube, CodeClimate

### Example: Custom AI Code Review

```yaml
# Add to .github/workflows/qa-automation.yml
- name: AI Code Review
  uses: actions/github-script@v7
  with:
    script: |
      // Custom AI code review logic
      const review = await aiCodeReview(context.payload);
      github.rest.pulls.createReview({
        owner: context.repo.owner,
        repo: context.repo.repo,
        pull_number: context.payload.pull_request.number,
        body: review,
        event: 'COMMENT'
      });
```

## 🚨 Troubleshooting

### Common Issues

1. **Playwright Installation**: Ensure browsers are installed
2. **Environment Variables**: Check GitHub secrets are set
3. **Test Timeouts**: Adjust timeout settings in `playwright.config.ts`
4. **Visual Test Failures**: Update baseline screenshots

### Debug Commands

```bash
# Debug specific test
npx playwright test tests/accessibility.spec.ts --debug

# Run tests in headed mode
npx playwright test --headed

# Generate trace for failed tests
npx playwright test --trace on
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)
- [GitHub Actions](https://docs.github.com/en/actions)
- [Accessibility Testing Guide](https://playwright.dev/docs/accessibility-testing)

## 🎉 Next Steps

1. **Run Initial Tests**: Execute the full test suite
2. **Review Results**: Check all QA reports
3. **Customize Thresholds**: Adjust performance and quality thresholds
4. **Set Up Monitoring**: Configure alerts and notifications
5. **Team Training**: Train your team on the QA process

Your QA automation is now ready to help maintain high code quality and catch issues early! 🚀
