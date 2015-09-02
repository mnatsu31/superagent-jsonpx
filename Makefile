mochify=./node_modules/.bin/mochify

test: clean
	$(mochify) --timeout 5000 --plugin [ mochify-istanbul --report lcovonly --report html --dir ./coverage ]

test-local: clean
	$(mochify) --reporter spec --timeout 5000

coveralls:
	cat ./coverage/lcov.info | ./node_modules/coveralls/bin/coveralls.js;

clean:
	rm -rf coverage