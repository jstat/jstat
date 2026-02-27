DIST_DIR = ./dist

DOC_DIR = doc
BUILD_DIR = build
DOC_LIST = `ls $(DOC_DIR)/md/`
JS_ENGINE ?= $(shell which node nodejs 2>/dev/null | head -1)

all: clean core doc

clean:
	@echo 'Cleaning up build files'
	@rm -rf dist

core:
	@echo 'Building jStat'
	@npm run build

doc:
	@echo 'Generating documentation'
	@mkdir -p $(DIST_DIR)/docs/assets
	@cp $(DOC_DIR)/assets/*.css $(DIST_DIR)/docs/assets/
	@cp $(DOC_DIR)/assets/*.js $(DIST_DIR)/docs/assets/
	@for i in $(DOC_LIST); do \
		$(JS_ENGINE) $(BUILD_DIR)/doctool.js $(DOC_DIR)/assets/template.html $(DOC_DIR)/md/$${i} $(DIST_DIR)/docs/$${i%.*}.html; \
	done

install:
	@echo 'Downloading necessary libraries for build'
	@mkdir -p node_modules
	@npm install

jstat: core

test: clean core
	@echo 'Running jStat unit tests'
	@node --test "test/**/*-test.js"

.PHONY: clean core doc install test jstat
