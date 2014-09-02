var assert             = require('assert');
var vfs                = require('vinyl-fs');
var through            = require('through2');
var angularDependency  = require('../');
var path               = require('path');


describe('gulp-angular-dependency', function () {
  var files;

  beforeEach(function () {
    files = [];
  });

  it('should filter files which contains the needed module and its ' +
    'dependencies', function (done) {
    vfs.src('test/test_case/test_case_1/*')
      .pipe(angularDependency('module1'))
      .pipe(through.obj(function (chunk, enc, cb) {
        files.push(path.relative(__dirname, chunk.path));
        cb();
      }, function () {
        assert.deepEqual(files, [
          'test_case/test_case_1/file_0_2.js',
          'test_case/test_case_1/file_0_1.js',
          'test_case/test_case_1/file_0_3.js']);
        done();
      }));
  });

  it('should be possible to require multiple modules', function (done) {
    vfs.src('test/test_case/test_case_2/*')
      .pipe(angularDependency(['module1', 'module2']))
      .pipe(through.obj(function (chunk, enc, cb) {
        files.push(path.relative(__dirname, chunk.path));
        cb();
      }, function () {
        assert.deepEqual(files, [
          'test_case/test_case_2/file_0_1.js',
          'test_case/test_case_2/file_0_3.js',
          'test_case/test_case_2/file_0_2.js']);
        done();
      }));
  });

  it('if no module is required it pass all files containing angular code',
    function (done) {
      vfs.src('test/test_case/test_case_3/*')
      .pipe(angularDependency())
      .pipe(through.obj(function (chunk, enc, cb) {
        files.push(path.relative(__dirname, chunk.path));
        cb();
      }, function () {
        assert.deepEqual(files, [
          'test_case/test_case_3/file_0_1.js',
          'test_case/test_case_3/file_0_3.js',
          'test_case/test_case_3/file_0_2.js']);
        done();
      }));
  });
});