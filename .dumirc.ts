import { defineConfig } from 'dumi';
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const ghBase = '/antd-restful/';
const assetBase = isGithubPages ? ghBase : '/';
const siteIcon = `${assetBase}icon.svg`;
const faviconIcon = `${assetBase}favicon.svg`;

export default defineConfig({
  title: 'antd-restful',
  base: isGithubPages ? ghBase : '/',
  publicPath: isGithubPages ? ghBase : '/',
  favicons: [faviconIcon],
  outputPath: 'docs-dist',
  resolve: {
    docDirs: ['docs/site'],
  },
  themeConfig: {
    toc: 'content',
    name: 'AntdRestful',
    logo: siteIcon,
    nav: [
      { title: '首页', link: '/' },
      { title: '组件', link: '/components/overview' },
      { title: '表单项', link: '/formitems/overview' },
      { title: '工具与Hooks', link: '/tools/overview' },
      { title: 'FAQ', link: '/faq' },
      { title: '更新日志', link: '/changelog' },
    ],
    sidebar: {
      '/': [
        {
          title: '文档目录',
          children: [
            { title: '首页', link: '/' },
            { title: '组件总览', link: '/components/overview' },
            { title: '表单项总览', link: '/formitems/overview' },
            { title: '工具总览', link: '/tools/overview' },
            { title: 'FAQ', link: '/faq' },
            { title: '更新日志', link: '/changelog' },
          ],
        },
      ],
      '/components/': [
        {
          title: '组件',
          children: [
            '/components/overview',
            '/components/route-base-table',
            '/components/rest-table',
            '/components/rest-list',
            '/components/grid-form',
            '/components/long-text',
            '/components/copy-view',
          ],
        },
      ],
      '/formitems/': [
        {
          title: '表单项',
          children: [
            '/formitems/overview',
            '/formitems/rest-select',
            '/formitems/table-select',
            '/formitems/rest-auto-complete',
            '/formitems/rest-cascader',
            '/formitems/rest-tree-select',
            '/formitems/upload-view',
            '/formitems/date-str-picker',
            '/formitems/range-str-picker',
            '/formitems/expansion-view',
            '/formitems/number-range',
            '/formitems/compare-edit',
            '/formitems/mention-view',
          ],
        },
      ],
      '/tools/': [
        {
          title: '工具与Hooks',
          children: [
            '/tools/overview',
            '/tools/config',
            '/tools/requests',
            '/tools/hooks',
            '/tools/type-tools',
            '/tools/validators',
          ],
        },
      ],
      '/faq/': [
        {
          title: 'FAQ',
          children: ['/faq', '/faq/node12-query-string'],
        },
      ],
      '/changelog/': [
        {
          title: '更新日志',
          children: ['/changelog', '/changelog/v0-x'],
        },
      ],
    },
  },
});
