# 🤝 Contributing to SwapIn

Thank you for your interest in contributing to SwapIn! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Bugs](#reporting-bugs)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🚀 How Can I Contribute?

### Reporting Bugs

- Use the GitHub issue tracker
- Include detailed steps to reproduce the bug
- Provide screenshots if applicable
- Include your browser and OS information

### Suggesting Enhancements

- Use the GitHub issue tracker
- Describe the enhancement clearly
- Explain why this enhancement would be useful
- Include mockups or examples if possible

### Pull Requests

- Fork the repository
- Create a feature branch
- Make your changes
- Add tests if applicable
- Submit a pull request

## 🛠️ Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git
- Firebase CLI (for backend development)

### Local Development

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/yourusername/swapin.git
   cd swapin
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase configuration
   ```

4. **Start development server**
   ```bash
   npm start
   ```

5. **Run tests**
   ```bash
   npm test
   ```

### Backend Development

1. **Navigate to functions directory**
   ```bash
   cd functions
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start Firebase emulator**
   ```bash
   firebase emulators:start
   ```

## 📝 Coding Standards

### JavaScript/React

- Use functional components with hooks
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for complex functions
- Keep components small and focused

### CSS/Styling

- Use Tailwind CSS utility classes
- Follow BEM methodology for custom CSS
- Use CSS variables for theming
- Ensure responsive design

### File Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Shared components
│   └── features/       # Feature-specific components
├── pages/              # Page components
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
├── constants/          # Application constants
└── types/              # TypeScript type definitions
```

### Naming Conventions

- **Files**: Use PascalCase for components, camelCase for utilities
- **Components**: Use PascalCase
- **Functions**: Use camelCase
- **Constants**: Use UPPER_SNAKE_CASE
- **CSS Classes**: Use kebab-case

## 📝 Commit Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Commit Types

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

### Examples

```bash
feat: add user authentication system
fix: resolve login form validation issue
docs: update README with installation instructions
style: format code according to style guide
refactor: simplify user profile component
perf: optimize image loading performance
test: add unit tests for authentication service
chore: update dependencies to latest versions
```

## 🔄 Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow coding standards
   - Add tests if applicable
   - Update documentation

3. **Run tests and linting**
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Use the PR template
   - Describe your changes clearly
   - Link related issues
   - Request reviews from maintainers

### Pull Request Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No console errors
- [ ] Responsive design tested
```

## 🐛 Reporting Bugs

### Before Submitting

1. Check existing issues
2. Try to reproduce the bug
3. Check browser console for errors
4. Test in different browsers

### Bug Report Template

```markdown
## Bug Description
Clear and concise description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior
What you expected to happen

## Actual Behavior
What actually happened

## Environment
- OS: [e.g. Windows 10]
- Browser: [e.g. Chrome 91]
- Version: [e.g. 1.0.0]

## Additional Context
Screenshots, console logs, etc.
```

## 💡 Feature Requests

### Before Submitting

1. Check existing feature requests
2. Consider if the feature aligns with project goals
3. Think about implementation complexity

### Feature Request Template

```markdown
## Feature Description
Clear and concise description of the feature

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How would you like to see this implemented?

## Alternative Solutions
Any alternative solutions you've considered?

## Additional Context
Mockups, examples, or other context
```

## 🏷️ Issue Labels

We use the following labels to categorize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `priority: high`: High priority issue
- `priority: low`: Low priority issue
- `priority: medium`: Medium priority issue

## 📞 Getting Help

- **GitHub Issues**: For bugs and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Documentation**: Check the `docs/` folder
- **Code Examples**: Look at existing code in the repository

## 🙏 Recognition

Contributors will be recognized in:
- The project README
- Release notes
- Contributor hall of fame

Thank you for contributing to SwapIn! 🚀 