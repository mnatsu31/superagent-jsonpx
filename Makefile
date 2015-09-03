mochify=./node_modules/.bin/mochify

test: clean
	$(mochify) --plugin [ mochify-istanbul --exclude '**/+(test|node_modules)/**/*' --report lcovonly --report html --dir ./coverage ]

test-local: clean
	$(mochify) --reporter spec

coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js;

clean:
	rm -rf coverage