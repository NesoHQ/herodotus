# Contributing to Herodotus Analytics

Thank you for your interest in contributing to Herodotus Analytics!

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/herodotus.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test your changes
6. Commit: `git commit -m "Add your feature"`
7. Push: `git push origin feature/your-feature-name`
8. Create a Pull Request

## Development Setup

### Backend
```bash
cd herodotus-backend
cp .env.example .env
go mod download
make dev
```

### Frontend
```bash
cd herodotus-frontend
cp .env.example .env.local
npm install
npm run dev
```

## Code Style

### Go
- Follow standard Go conventions
- Run `gofmt` before committing
- Add comments for exported functions
- Write tests for new features

### TypeScript/React
- Use TypeScript for type safety
- Follow React best practices
- Use functional components with hooks
- Add PropTypes or TypeScript interfaces

## Testing

### Backend
```bash
cd herodotus-backend
go test -v ./...
```

### Frontend
```bash
cd herodotus-frontend
npm test
```

## Pull Request Guidelines

- Keep PRs focused on a single feature/fix
- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Follow the existing code style
- Write clear commit messages

## Reporting Issues

- Use GitHub Issues
- Provide clear description
- Include steps to reproduce
- Add screenshots if applicable
- Specify your environment

## Questions?

Feel free to open an issue for any questions!

Thank you for contributing! 🎉
