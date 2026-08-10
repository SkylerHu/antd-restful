SHELL := /bin/bash
.PHONY: build build-compat publish publish-compat clean clean-main clean-compat

# nvm 是 shell 函数，需要先 source nvm.sh 才能使用
NVM_USE := . "$$NVM_DIR/nvm.sh" && nvm use 18

# 构建主版本（ESM + CJS），使用 father bundless 转译，产物输出到 dist/
build: clean-main
	@$(NVM_USE) && npm run build

# 构建兼容版本（UMD 单文件），使用 webpack 打包并转译所有依赖，产物输出到 compat/dist/
# 兼容 Node 12 环境，需在 Node 18 下执行
build-compat: clean-compat
	@$(NVM_USE) && npx webpack --config webpack.config.js

# 发布主版本到 npm（latest 标签）
publish: build
	@$(NVM_USE) && npm publish

# 发布兼容版本到 npm（compat 标签），消费方通过 npm install antd-restful@compat 安装
publish-compat: build-compat
	@$(NVM_USE) && cd compat && npm publish --tag compat

# 清理主版本构建产物
clean-main:
	rm -rf dist

# 清理兼容版本构建产物
clean-compat:
	rm -rf compat/dist

# 清理所有构建产物
clean: clean-main clean-compat
