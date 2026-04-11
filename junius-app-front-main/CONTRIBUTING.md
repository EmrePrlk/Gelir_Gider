# Contributing to Junius App

First off, thank you for considering contributing to Junius App! It's people like you that make Junius App such a great tool.

## Code of Conduct

By participating in this project, you are expected to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

This section guides you through submitting a bug report for Junius App. Following these guidelines helps maintainers and the community understand your report, reproduce the behavior, and find related reports.

- Use a clear and descriptive title for the issue to identify the problem.
- Describe the exact steps which reproduce the problem in as many details as possible.
- Provide specific examples to demonstrate the steps.

### Suggesting Enhancements

This section guides you through submitting an enhancement suggestion for Junius App, including completely new features and minor improvements to existing functionality.

- Use a clear and descriptive title for the issue to identify the suggestion.
- Provide a step-by-step description of the suggested enhancement in as many details as possible.
- Provide specific examples to demonstrate the steps or point out the part of Junius App where the enhancement could be implemented.
- Explain why this enhancement would be useful to most Junius App users.

### Your First Code Contribution

Unsure where to begin contributing to Junius App? You can start by looking through these `beginner` and `help-wanted` issues:

- [Beginner issues](https://github.com/juniusapp/junius-app-front/labels/beginner) - issues which should only require a few lines of code, and a test or two.
- [Help wanted issues](https://github.com/juniusapp/junius-app-front/labels/help%20wanted) - issues which should be a bit more involved than `beginner` issues.

### Pull Requests

- Fill in the required template
- Do not include issue numbers in the PR title
- Follow the [styleguides](#styleguides)
- End all files with a newline

## Styleguides

### Git Commit Messages

We use the `cz` (Commitizen) package to standardize our commit messages. To create a commit, run:

```bash
bun commit
```

### JavaScript Styleguide

All JavaScript must adhere to [JavaScript Standard Style](https://standardjs.com/).

### TypeScript Styleguide

All TypeScript must adhere to [TypeScript Standard Style](https://github.com/standard/ts-standard).

### Documentation Styleguide

- Use [Markdown](https://daringfireball.net/projects/markdown/).
- Reference methods and classes in markdown with the custom `{}` notation:
  - Reference classes with `{ClassName}`
  - Reference instance methods with `{ClassName::methodName}`
  - Reference class methods with `{ClassName.methodName}`

## Additional Notes

### Issue and Pull Request Labels

This section lists the labels we use to help us track and manage issues and pull requests.

[GitHub search](https://help.github.com/articles/searching-issues/) makes it easy to use labels for finding groups of issues or pull requests you're interested in.

#### Type of Issue and Issue State

- `enhancement`: Feature requests.
- `bug`: Confirmed bugs or reports that are very likely to be bugs.
- `question`: Questions more than bug reports or feature requests (e.g. how do I do X).
- `feedback`: General feedback more than bug reports or feature requests.
- `help-wanted`: The Junius App core team would appreciate help from the community in resolving these issues.
- `beginner`: Less complex issues which would be good first issues to work on for users who want to contribute to Junius App.
- `more-information-needed`: More information needs to be collected about these problems or feature requests (e.g. steps to reproduce).
- `needs-reproduction`: Likely bugs, but haven't been reliably reproduced.
- `blocked`: Issues blocked on other issues.
- `duplicate`: Issues which are duplicates of other issues, i.e. they have been reported before.
- `wontfix`: The Junius App core team has decided not to fix these issues for now, either because they're working as intended or for some other reason.
- `invalid`: Issues which aren't valid (e.g. user errors).

Thank you for your contributions to make Junius App better!
