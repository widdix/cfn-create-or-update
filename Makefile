default: test

jshint:
	@echo "jshint"
	@./node_modules/.bin/jshint .

circular:
	@echo "circular"
	@./node_modules/.bin/madge --circular --format amd --exclude "madge|source-map" .

mocha:
	@echo "mocha (unit test)"
	@./node_modules/.bin/mocha test/*.js
	@echo

coverage:
	@echo "cover"
	@./node_modules/.bin/istanbul cover ./node_modules/.bin/_mocha test/*
	@echo

test: jshint mocha circular
	@echo "test"
	@echo
