var assert = require('assert');
var File   = require('gulp-util').File;
var Buffer = require('buffer').Buffer;
var prefix = require('../');


describe('prefix testing', function () {
	var input = 'foo';

  it('should prefix', function (done) {
  	var stream = prefix('test');
  	stream.on('data', function (newFile) {
  		assert.equal(newFile.contents.toString(), 'testfoo');
  		done();
  	});

  	stream.write(new File({
  		contents: new Buffer(input)
  	}));
  	stream.end();
  });
});