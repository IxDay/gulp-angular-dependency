var assert             = require('assert');
var vfs                = require('vinyl-fs');
var es                 = require('event-stream');
var angularDependency  = require('../');
var path               = require('path');
var gutil              = require('gulp-util');
var PluginError        = gutil.PluginError;

describe('gulp-angular-dependency', function () {
  var files;

  beforeEach(function () {
    files = [];
  });

  it('should filter files which contains the needed module and its ' +
    'dependencies', function (done) {
    vfs.src('test/test_case/test_case_1/*')
      .pipe(angularDependency('module1'))
      .pipe(es.through(function (chunk) {
        files.push(path.relative(__dirname, chunk.path));
      }, function () {
        assert.deepEqual(files, [
          'test_case/test_case_1/file_0_2.js',
          'test_case/test_case_1/file_0_1.js',
          'test_case/test_case_1/file_0_3.js',
          'test_case/test_case_1/file_0_5.js']);
        done();
      }));
  });

  it('should be possible to require multiple modules', function (done) {
    vfs.src('test/test_case/test_case_2/*')
      .pipe(angularDependency(['module1', 'module2']))
      .pipe(es.through(function (chunk) {
        files.push(path.relative(__dirname, chunk.path));
      }, function () {
        assert.deepEqual(files, [
          'test_case/test_case_2/file_0_1.js',
          'test_case/test_case_2/file_0_3.js',
          'test_case/test_case_2/file_0_2.js']);
        done();
      }));
  });

  it('should pass all files containing angular code if no module is defined',
    function (done) {
      var checking = es.through(function (chunk) {
        files.push(path.relative(__dirname, chunk.path));
        this.emit('data', chunk);
      }, function () {
        assert.deepEqual(files, [
          'test_case/test_case_3/file_0_1.js',
          'test_case/test_case_3/file_0_3.js',
          'test_case/test_case_3/file_0_2.js']);
        this.emit('end');
      });

      vfs.src('test/test_case/test_case_3/*')
        .pipe(angularDependency())
        .pipe(checking)
        .pipe(angularDependency([]))
        .pipe(checking)
        .pipe((function () {
          done();
          return es.through();
        })())
    });
});