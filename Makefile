SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/distribution.js\
	${SRC_DIR}/special.js

JS = ${DIST_DIR}/jstat.js
JS_MIN = ${DIST_DIR}/jstat.min.js

all: update_submodules core

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
		${JS_ENGINE} build/jshint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test jStat against JSHint."; \
	fi

min: jstat ${JS_MIN}

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

# change pointers for submodules and update them to what is specified in jStat
# --merge  doesn't work when doing an initial clone, thus test if we have non-existing
#  submodules, then do an real update
update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

# update the submodules to the latest at the most logical branch
pull_submodules:
	@@git submodule foreach "git pull \$$(git config remote.origin.url)"
	@@git submodule summary

pull: pull_submodules
	@@git pull ${REMOTE} ${BRANCH}

.PHONY: all jstat lint min clean update_submodules pull_submodules pull core
