# Content Workflow

This site is generated from MDX files and frontmatter. Edit the files under this folder, then run:

```bash
pnpm build
```

Vercel runs the same build command when you deploy, so no VPS or long-running Node server is needed.

## Folders

- `posts/`: blog posts. Detail pages are generated from each file slug.
- `notes/`: notes and note detail pages.
- `projects/`: project cards and project list data.
- `learning/series/`: learning series metadata for the sidebar and learning pages.
- `learning/chapters/`: learning chapter cards and generated chapter pages.
- `research/areas/`: home page research area cards.
- `research/ongoing/`: ongoing research cards.
- `research/papers/`: research paper table rows.
- `research/collections/`: research collection cards.
- `about/`: profile, mission, tools, interests, and journey data.

## Frontmatter

Use plain YAML frontmatter at the top of each MDX file. Arrays can be YAML lists or comma-separated strings.

Important shared fields:

- `title`
- `description`
- `date`
- `category`
- `tags`

Special fields are documented by example in the existing MDX files.
