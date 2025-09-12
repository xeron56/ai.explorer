# Nextra Documentation Template

A modern, feature-rich documentation template built with Nextra 4.4.0 and Next.js 15. This template provides everything you need to create beautiful, content-focused documentation websites with zero configuration.

![Nextra](https://badgen.net/github/stars/shuding/nextra) ![Downloads](https://badgen.net/npm/dt/nextra) ![License](https://badgen.net/npm/license/nextra)

## ✨ Features

- **Zero-config setup** - Start building immediately with sensible defaults
- **Multi-language support** - Built-in i18n for English, Spanish, Russian, and Chinese
- **MDX-powered content** - Write with Markdown and embed React components
- **Full-text search** - Integrated Pagefind search functionality
- **Dark mode** - Automatic dark/light theme switching
- **SEO optimized** - Proper meta tags and structured data
- **Performance focused** - Built on Next.js 15 with Turbopack
- **TypeScript ready** - Full TypeScript support throughout
- **Customizable** - Easy to modify themes and components
- **LaTeX support** - Mathematical equations with LaTeX
- **Mermaid diagrams** - Create diagrams with Mermaid syntax
- **Accessibility** - WCAG compliant and screen reader friendly

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- pnpm, npm, or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nextra-doc-template.git
   cd nextra-doc-template
   ```

2. **Install dependencies**
   ```bash
   pnpm install  # or npm install / yarn install
   ```

3. **Start development server**
   ```bash
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start

# Analyze bundle size
pnpm analyze
```

## 📁 Project Structure

```
nextra-doc-template/
├── app/                    # Next.js App Router
│   ├── [lang]/            # Language-specific routes
│   ├── _components/       # Reusable React components
│   ├── _dictionaries/     # i18n translation files
│   └── _icons/           # SVG icons and assets
├── content/               # Documentation content
│   ├── en/               # English content
│   │   ├── about/        # About pages
│   │   ├── blog/         # Blog posts
│   │   ├── docs/         # Documentation
│   │   ├── examples/     # Code examples
│   │   └── _meta.ts      # Navigation metadata
│   ├── es/               # Spanish content
│   ├── ru/               # Russian content
│   └── zh/               # Chinese content
├── public/               # Static assets
│   └── img/             # Images and media
├── next.config.ts        # Next.js configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Customization

### Adding New Pages

1. **Create content files** in the appropriate language directory:
   ```bash
   # Create a new documentation page
   touch content/en/docs/new-feature.mdx
   ```

2. **Add frontmatter** to your MDX files:
   ```mdx
   ---
   title: New Feature
   description: Learn about our amazing new feature
   ---
   
   # New Feature Content
   ```

3. **Update navigation** in `_meta.ts`:
   ```typescript
   export default {
     // ... existing navigation
     'new-feature': 'New Feature',
   }
   ```

### Custom Components

Create reusable components in `app/_components/`:

```typescript filename="app/_components/CustomComponent.tsx"
import React from 'react'

export function CustomComponent({ children }: { children: React.ReactNode }) {
  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      {children}
    </div>
  )
}
```

Use them in your MDX content:

```mdx
import { CustomComponent } from '@app/_components/CustomComponent'

<CustomComponent>
  This is a custom component!
</CustomComponent>
```

### Styling with Tailwind CSS

This template uses Tailwind CSS 4.0. Customize styles by modifying classes:

```jsx
<div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-lg">
  Gradient background
</div>
```

### Internationalization (i18n)

Add new languages by:

1. Creating a new directory in `content/` (e.g., `content/fr/`)
2. Adding translation files in `app/_dictionaries/`
3. Updating `next.config.ts` i18n configuration

## 🌐 Deployment

### Vercel (Recommended)

1. **Connect your repository** to [Vercel](https://vercel.com)
2. **Import project** and deploy automatically
3. **Configure environment variables** if needed

### Other Platforms

This template works with any platform that supports Next.js:

- **Netlify**: Use `next build && next export`
- **AWS Amplify**: Configure build settings for Next.js
- **Railway**: Deploy with zero configuration
- **Docker**: Create a Dockerfile for container deployment

### Environment Variables

Create a `.env.local` file for local development:

```env
# Optional: Analytics or API keys
NEXT_PUBLIC_GA_ID=your_google_analytics_id
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## 🔧 Configuration

### Next.js Config

The `next.config.ts` file includes:

- Nextra configuration with code copying and LaTeX support
- SVG handling with @svgr/webpack
- Internationalization setup
- Bundle analyzer integration

### Search Configuration

Pagefind search is configured in `package.json`:

```json
{
  "scripts": {
    "postbuild": "pagefind --site .next/server/app --output-path public/_pagefind"
  }
}
```

## 📖 Content Management

### Writing Documentation

Use standard Markdown with MDX enhancements:

```mdx
---
title: Getting Started
description: Learn how to use our product
---

# Getting Started

## Installation

```bash
npm install my-package
```

## Usage

import { CodeBlock } from '@app/_components/CodeBlock'

<CodeBlock language="javascript">
console.log('Hello, World!')
</CodeBlock>
```

### Blog Posts

Create blog posts in `content/[lang]/blog/`:

```mdx
---
title: Announcing Version 2.0
date: 2024-01-15
author: John Doe
tags: [release, features, update]
---

# Announcing Version 2.0

We're excited to announce the release of version 2.0 with new features...
```

### Code Examples

Add interactive examples in `content/[lang]/examples/`:

```mdx
---
title: API Usage Example
---

# API Usage

```javascript
import { createClient } from 'my-api'

const client = createClient({ apiKey: 'your-key' })
const data = await client.getData()
```

## 🚀 Performance Optimizations

This template includes several performance optimizations:

- **Turbopack** for faster development builds
- **Image optimization** with Next.js Image component
- **Code splitting** automatic with Next.js
- **Font optimization** with next/font
- **Bundle analysis** with @next/bundle-analyzer

## 🤝 Contributing

We welcome contributions! Here's how to help:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### Development Guidelines

- Follow TypeScript best practices
- Use meaningful commit messages
- Add tests for new features
- Update documentation when needed
- Follow the existing code style

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Nextra](https://nextra.site) - The amazing documentation framework
- [Next.js](https://nextjs.org) - The React framework
- [Tailwind CSS](https://tailwindcss.com) - Utility-first CSS framework
- [Pagefind](https://pagefind.app) - Static search library

## 📞 Support

- **Documentation**: [Read the docs](/docs)
- **Issues**: [GitHub Issues](https://github.com/your-username/nextra-doc-template/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/nextra-doc-template/discussions)
- **Email**: your-email@example.com

---

Built with ❤️ using [Nextra](https://nextra.site) and [Next.js](https://nextjs.org).