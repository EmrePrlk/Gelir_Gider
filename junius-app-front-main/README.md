# Junius App - Front End

## Overview

JuniusApp is an innovative collaborative platform designed to bridge the gap between developers, project ideas, and investors. Our mission is to create a dynamic ecosystem where:

- Developers can showcase their skills and find exciting projects aligned with their interests.
- Innovators can present their ideas and connect with talented developers to bring them to life.
- Investors can discover promising projects and teams to support.

By streamlining the process of matching the right people with the right resources, JuniusApp aims to catalyze the transformation of innovative ideas into successful realities.

## Project Status

JuniusApp is currently in active development and is a private project. Access is limited to authorized team members and stakeholders.

Key features implemented or in progress include:

- User authentication and authorization system
- Project and idea listing and detail views
- User profiles and management
- Dashboard for project overview and management
- Integration with backend services for data management

Upcoming features and enhancements:

- Implementation of CASL for fine-grained authorization
- Email verification for users
- Enhanced project detail pages with team management functionality
- Integration of a Markdown editor for rich content creation
- Note management system for projects and ideas
- LinkedIn integration for the landing page

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) 1.x or newer
- [Node.js](https://nodejs.org/) (version specified in `.nvmrc`)
- [Docker](https://www.docker.com/) (optional, for containerized development)

### Installation

1. Clone the repository (requires access):

   ```sh
   git clone https://github.com/juniusapp/junius-app-front
   cd junius-app-front
   ```

2. Install dependencies:

   ```sh
   bun install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env` and fill in the required values.

4. Start the development server:
   ```sh
   bun dev
   ```

## Available Scripts

- `bun dev`: Start the development server
- `bun build`: Build the production-ready application
- `bun start`: Start the production server
- `bun lint`: Run ESLint to check for linting errors
- `bun lint:fix`: Run ESLint and automatically fix linting errors
- `bun lint:export`: Run ESLint and export the results to a file
- `bun format`: Run Prettier to format the code
- `bun prepare`: Install Husky hooks
- `bun commit`: Run Commitizen to create and stage a commit
- `bun commit:stage`: Run Commitizen to create a commit
- `bun re:start`: Clean install and start development server
- `bun re:build`: Clean install and build the application
- `bun fix`: Run ESLint, Prettier, and TypeScript compiler to fix errors
- `bun rm:all`: Clean install and start development server

## Development Workflow

### Branch Naming Convention

- `main`: Main development branch
- `stage`: Pre-production branch
- `prod`: Production branch

For new features or bug fixes, create a branch using the following convention:

```sh
feature/short-description-of-feature
bugfix/short-description-of-bug
```

### Commit Guidelines

We use Commitizen for structured commit messages. Run `bun commit` to use the interactive commit message CLI.

### Code Quality

- ESLint and Prettier are configured for code linting and formatting.
- Husky is set up to run pre-commit hooks for maintaining code quality.

## Project Structure

- `/src`: Source code
  - `/app`: Next.js app directory
  - `/components`: Reusable React components by `mui`
  - `/hooks`: Custom React hooks
  - `/services`: API service functions
  - `/stores`: State management (using Zustand)
  - `/types`: TypeScript type definitions
  - `/utils`: Utility functions

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **UI Library**: Material-UI
- **State Management**: Zustand
- **Form Handling**: React Hook Form
- **API Client**: Axios
- **Data Fetching**: React Query
- **Internationalization**: i18next
- **Charting**: ApexCharts
- **Map Integration**: Mapbox GL
- **Rich Text Editor**: React Quill
- **Validation**: Yup
- **Development Tools**: ESLint, Prettier, Husky, Commitizen, Commitlint

## Contributing

As this is a private project, contributions are currently limited to authorized team members. If you're part of the development team, please refer to our internal CONTRIBUTING.md document for guidelines on how to contribute to the project.

## License

This project is proprietary and confidential. Unauthorized copying, transferring or reproduction of the contents of this project, via any medium is strictly prohibited.

## Contact

For any queries or support, please contact the project lead or refer to our internal communication channels. `info@juniusapp.com`

---

JuniusApp ❤️ - Empowering Innovation Through Collaboration
