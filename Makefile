NODE_PATH ?= ./node_modules
DIST_DIR = ./dist
JS_COMPILER = $(NODE_PATH)/uglify-js/bin/uglifyjs
JS_TESTER = $(NODE_PATH)/vows/bin/vows

DOC_DIR = doc
BUILD_DIR = build
DOC_LIST = `ls $(DOC_DIR)/md/`
JS_ENGINE ?= $(shell which node nodejs 2>/dev/null | head -1)

all: clean core doc

clean:
	@npm run-script clean

core:
	@npm run-script jstatmin

jstat.js:
	@npm run-script jstat

jstat.min.js: jstat.js
	@npm run-script jstatmin

doc:
	@npm run-script doc

jstat: jstat.js

install:
	@echo 'Downloading necessary libraries for build'
	@mkdir -p node_modules
	@npm install

test: clean core
	@npm run-script test

.PHONY: clean core doc install test
