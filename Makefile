SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/vector.js\
	${SRC_DIR}/distribution.js\
	${SRC_DIR}/special.js\
	${SRC_DIR}/linearalgebra.js

JS = ${DIST_DIR}/jstat.js
JS_MIN = ${DIST_DIR}/jstat.min.js

DOC_DIR = doc
DOC_LIST = `ls ${DOC_DIR}/md/`

all: clean core doc

core: jstat min lint
	@@echo "jStat build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

jstat: ${JS}

${JS}: ${DIST_DIR}
	@@echo "Building" ${JS}
	@@cat ${BASE_FILES} > ${JS}

lint: jstat
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking jStat against JSHint..."; \
		${JS_ENGINE} ${BUILD_DIR}/jshint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test jStat against JSHint."; \
	fi

min: jstat ${JS_MIN}

doc:
	@@echo 'Generating documentation...'
	@@mkdir -p ${DIST_DIR}/docs/assets
	@@cp ${DOC_DIR}/assets/*.css ${DIST_DIR}/docs/assets/
	@@cp ${DOC_DIR}/assets/*.js ${DIST_DIR}/docs/assets/
	@@for i in ${DOC_LIST}; do \
		${JS_ENGINE} ${BUILD_DIR}/doctool.js ${DOC_DIR}/assets/template.html ${DOC_DIR}/md/$${i} ${DIST_DIR}/docs/$${i%.*}.html; \
	done

${JS_MIN}: ${JS}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying jStat" ${JS_MIN}; \
		${COMPILER} ${JS} > ${JS_MIN}; \
	else \
		echo "You must have NodeJS installed in order to minify jStat."; \
	fi

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

.PHONY: all jstat lint min doc clean core
