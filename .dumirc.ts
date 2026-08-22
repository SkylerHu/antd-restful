import { defineConfig } from 'dumi';
const isGithubPages = process.env.GITHUB_PAGES === 'true';
const ghBase = '/antd-restful/';
const assetBase = isGithubPages ? ghBase : '/';
const siteIcon = `${assetBase}icon.svg`;
const faviconIcon = `${assetBase}favicon.svg`;
const faviconIco = `${assetBase}favicon.ico`;

export default defineConfig({
  title: 'antd-restful',
  base: isGithubPages ? ghBase : '/',
  publicPath: isGithubPages ? ghBase : '/',
  favicons: [faviconIco, faviconIcon],
  outputPath: 'docs-dist',
  locales: [
    { id: 'en-US', name: 'English' },
    { id: 'zh-CN', name: '中文' },
  ],
  headScripts: [
    {
      content: `(function(){
  var base = '${isGithubPages ? ghBase : '/'}';
  var p = location.pathname;
  var isRoot = (p === base || p === base.replace(/\\/$/, ''));
  if (!isRoot) return;
  if (sessionStorage.getItem('dumi_locale_detected')) return;
  sessionStorage.setItem('dumi_locale_detected', '1');
  var lang = navigator.language || navigator.languages && navigator.languages[0] || '';
  if (lang.toLowerCase().startsWith('zh')) {
    location.replace(base + 'zh-CN');
  }
})();`,
    },
  ],
  resolve: {
    docDirs: ['docs/site'],
  },
  themeConfig: {
    toc: 'content',
    name: 'AntdRestful',
    logo: siteIcon,
    nav: {
      'en-US': [
        { title: 'Home', link: '/' },
        { title: 'Components', link: '/components/overview' },
        { title: 'FormItems', link: '/formitems/overview' },
        { title: 'Tools', link: '/tools/overview' },
        { title: 'FAQ', link: '/faq' },
        { title: 'Changelog', link: '/changelog' },
      ],
      'zh-CN': [
        { title: '首页', link: '/zh-CN' },
        { title: '组件', link: '/zh-CN/components/overview' },
        { title: '表单项', link: '/zh-CN/formitems/overview' },
        { title: '工具与Hooks', link: '/zh-CN/tools/overview' },
        { title: 'FAQ', link: '/zh-CN/faq' },
        { title: '更新日志', link: '/zh-CN/changelog' },
      ],
    },
    socialLinks: {
      github: 'https://github.com/skylerhu/antd-restful',
    },
    sidebar: {
      '/': [
        {
          title: 'Documentation',
          children: [
            { title: 'Home', link: '/' },
            { title: 'Components', link: '/components/overview' },
            { title: 'FormItems', link: '/formitems/overview' },
            { title: 'Tools', link: '/tools/overview' },
            { title: 'FAQ', link: '/faq' },
            { title: 'Changelog', link: '/changelog' },
          ],
        },
      ],
      '/components/': [
        {
          title: 'Components',
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
          title: 'FormItems',
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
          title: 'Tools',
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
          title: 'Changelog',
          children: ['/changelog', '/changelog/v0-x'],
        },
      ],
      '/zh-CN': [
        {
          title: '文档目录',
          children: [
            { title: '首页', link: '/zh-CN' },
            { title: '组件总览', link: '/zh-CN/components/overview' },
            { title: '表单项总览', link: '/zh-CN/formitems/overview' },
            { title: '工具总览', link: '/zh-CN/tools/overview' },
            { title: 'FAQ', link: '/zh-CN/faq' },
            { title: '更新日志', link: '/zh-CN/changelog' },
          ],
        },
      ],
      '/zh-CN/components/': [
        {
          title: '组件',
          children: [
            '/zh-CN/components/overview',
            '/zh-CN/components/route-base-table',
            '/zh-CN/components/rest-table',
            '/zh-CN/components/rest-list',
            '/zh-CN/components/grid-form',
            '/zh-CN/components/long-text',
            '/zh-CN/components/copy-view',
          ],
        },
      ],
      '/zh-CN/formitems/': [
        {
          title: '表单项',
          children: [
            '/zh-CN/formitems/overview',
            '/zh-CN/formitems/rest-select',
            '/zh-CN/formitems/table-select',
            '/zh-CN/formitems/rest-auto-complete',
            '/zh-CN/formitems/rest-cascader',
            '/zh-CN/formitems/rest-tree-select',
            '/zh-CN/formitems/upload-view',
            '/zh-CN/formitems/date-str-picker',
            '/zh-CN/formitems/range-str-picker',
            '/zh-CN/formitems/expansion-view',
            '/zh-CN/formitems/number-range',
            '/zh-CN/formitems/compare-edit',
            '/zh-CN/formitems/mention-view',
          ],
        },
      ],
      '/zh-CN/tools/': [
        {
          title: '工具与Hooks',
          children: [
            '/zh-CN/tools/overview',
            '/zh-CN/tools/config',
            '/zh-CN/tools/requests',
            '/zh-CN/tools/hooks',
            '/zh-CN/tools/type-tools',
            '/zh-CN/tools/validators',
          ],
        },
      ],
      '/zh-CN/faq/': [
        {
          title: 'FAQ',
          children: ['/zh-CN/faq', '/zh-CN/faq/node12-query-string'],
        },
      ],
      '/zh-CN/changelog/': [
        {
          title: '更新日志',
          children: ['/zh-CN/changelog', '/zh-CN/changelog/v0-x'],
        },
      ],
    },
  },
});
