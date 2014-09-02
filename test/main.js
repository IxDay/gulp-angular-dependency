var assert  = require('assert');
var vfs     = require('vinyl-fs');
var through = require('through2');
var prefix  = require('../');
var path    = require('path');


describe('gulp-angular-dependency', function () {

  it('should filter files which contains the needed module and its ' +
    'dependencies', function (done) {
      var files = [];
      vfs.src('test/test_case/*')
        .pipe(prefix('module1'))
        .pipe(through.obj(function (chunk, enc, cb) {
          files.push(path.relative(__dirname, chunk.path));
          cb();
        }, function () {
          assert.deepEqual(files, [
            'test_case/file_0_2.js',
            'test_case/file_0_1.js',
            'test_case/file_0_3.js']);
          done();
        }));
  });
});