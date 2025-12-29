# Contributing to BrandScene AI

Thank you for your interest in contributing to BrandScene AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in your interactions.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details

### Suggesting Enhancements

1. Check if the enhancement has been suggested
2. Create a new issue with:
   - Clear use case
   - Proposed solution
   - Alternative solutions considered
   - Impact on existing features

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write/update tests
5. Update documentation
6. Commit with clear messages
7. Push to your fork
8. Open a Pull Request

## Development Setup

See [README.md](./README.md#installation) for setup instructions.

## Coding Standards

### TypeScript
- Use strict TypeScript mode
- Avoid `any` types when possible
- Properly type all functions and variables
- Use interfaces for object shapes

### Code Style
- Follow existing code style
- Use Prettier for formatting
- Use ESLint for linting
- Run `npm run lint` before committing

### Naming Conventions
- `camelCase` for variables and functions
- `PascalCase` for classes and components
- `UPPER_CASE` for constants
- Descriptive names over short names

### Comments
- Write self-documenting code
- Add comments for complex logic
- Use JSDoc for public APIs

## Commit Messages

Format: `type(scope): subject`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Code style changes
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

Examples:
```
feat(api): add script approval endpoint
fix(ui): resolve glass card hover animation
docs(readme): update installation instructions
```

## Testing

- Write tests for new features
- Maintain test coverage above 80%
- Run tests before submitting PR: `npm test`

## Documentation

- Update README.md for new features
- Add/update API documentation
- Include code examples
- Update changelog

## Review Process

1. Automated checks must pass
2. At least one maintainer approval required
3. No unresolved conversations
4. Branch up to date with main

## Release Process

1. Update version in package.json
2. Update CHANGELOG.md
3. Create release notes
4. Tag release
5. Deploy to production

## Questions?

Feel free to ask questions by:
- Opening an issue
- Joining our Discord (coming soon)
- Emailing: dev@brandscene.ai

Thank you for contributing! 🎉
