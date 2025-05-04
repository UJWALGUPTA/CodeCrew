# Contributing to CodeCrew

Thank you for your interest in contributing to CodeCrew! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for CodeCrew. Following these guidelines helps maintainers understand your report, reproduce the behavior, and find related reports.

- **Use the GitHub issue tracker** - Submit bugs using the GitHub issue tracker.
- **Use a clear and descriptive title** for the issue to identify the problem.
- **Describe the exact steps to reproduce the problem** in as much detail as possible.
- **Provide specific examples** to demonstrate the steps.
- **Describe the behavior you observed** after following the steps and point out what exactly is the problem with that behavior.
- **Explain which behavior you expected** to see instead and why.
- **Include screenshots** if possible.
- **Include details about your environment** such as OS, browser, and version.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for CodeCrew, including completely new features and minor improvements to existing functionality.

- **Use the GitHub issue tracker** - Enhancement suggestions are tracked as GitHub issues.
- **Use a clear and descriptive title** for the issue to identify the suggestion.
- **Provide a step-by-step description of the suggested enhancement** in as much detail as possible.
- **Provide specific examples to demonstrate the steps** or provide mockups.
- **Describe the current behavior** and **explain which behavior you expected to see instead** and why.
- **Explain why this enhancement would be useful** to most CodeCrew users.

### Pull Requests

- **Fill in the required template** - When you submit a pull request, a template will be included automatically.
- **Do not include issue numbers in the PR title** - Instead, include them in the body of the PR.
- **Include screenshots and animated GIFs** when possible.
- **Follow the coding style** used throughout the project.
- **Include adequate tests** for your changes.
- **Document new code** using JSDoc comment blocks.
- **End all files with a newline**.

## Development Process

### Setting Up the Development Environment

1. Fork the repository
2. Clone your fork to your local machine
3. Install dependencies with `npm install`
4. Create a new branch for your feature or bugfix
5. Make your changes
6. Run tests with `npm test`
7. Push your changes to your fork
8. Submit a pull request

### Coding Standards

- Use TypeScript for type safety
- Follow the existing code style and formatting
- Use meaningful variable and function names
- Keep functions small and focused
- Add comments for complex logic
- Use React hooks and functional components for frontend development

### Commit Guidelines

- Use clear and meaningful commit messages
- Reference issue numbers in commit messages when applicable
- Keep commits focused on a single change
- Make frequent, smaller commits rather than large, infrequent ones

### Testing

- Write unit tests for new functionality
- Ensure all tests pass before submitting a pull request
- Update existing tests if necessary

## Smart Contract Development

When working on smart contracts:

- Always prioritize security
- Target deployment to Pharos Testnet (Chain ID: 688688)
- Write comprehensive tests for all contract functionality
- Document all functions and state variables
- Follow Solidity best practices
- Run static analyzers (like Slither or Mythril) on your contracts

## Frontend Development

When working on the frontend:

- Follow the existing component structure
- Reuse existing components when possible
- Use React Query for data fetching and state management
- Add appropriate loading and error states for async operations
- Ensure the UI is responsive and works on mobile devices
- Follow accessibility best practices

## Backend Development

When working on the backend:

- Follow RESTful API design principles
- Document all APIs with comments
- Validate input data
- Handle errors gracefully and return appropriate status codes
- Use the existing database schema and ORM methods

## Documentation

- Update the README.md with any changes to installation or usage instructions
- Document new features or changes to existing features
- Keep API documentation up-to-date
- Add comments and documentation for complex code

## Questions?

If you have any questions about contributing, please reach out to the maintainers through GitHub issues or discussions.

Thank you for contributing to CodeCrew!