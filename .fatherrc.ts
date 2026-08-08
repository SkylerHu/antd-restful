import { defineConfig } from 'father';

export default defineConfig({
  // 基础产物配置 (ESM + CJS)
  esm: { output: 'dist/esm' },
  cjs: { output: 'dist/cjs' },

  // 配置路径别名（father 在构建时会自动将其转换为打包后的相对路径）
  alias: {
    '@': './src',
    // 如果你源码里直接写了 src/
    'src': './src',
  },
});
