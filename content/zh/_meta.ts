export default {
  index: {
    type: "page",
    display: "hidden",
    theme: {
      typesetting: "article",
      toc: false,
    },
  },
  docs: {
    type: "page",
    title: "文档",
  },
  about: {
    type: "menu",
    title: "关于",
    items: {
      contributors: {
        href: "https://github.com/vercel/swr/graphs/contributors",
      },
      // team: "团队",
      // acknowledgement: "致谢",
      "a-page": "示例页面",
      // changelog: "更新日志",
    },
  },
  examples: {
    type: "page",
    title: "示例",
    theme: {
      layout: "full",
    },
  },
  blog: {
    type: "page",
    title: "博客",
    theme: {
      sidebar: false,
      typesetting: "article",
    },
  },
  nextra_link: {
    type: "page",
    title: "Nextra",
    href: "https://github.com/shuding/nextra",
  },
};
