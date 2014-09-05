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

  it('should provide a restore function which will reinject the files ' +
    'filtered out', function (done) {
    var angularFilter = angularDependency('module1');
    var restoredFiles = [];

    vfs.src('test/test_case/test_case_3/*')
      .pipe(angularFilter)
      .pipe(es.through(
        function (chunk) {
          files.push(path.relative(__dirname, chunk.path));
          this.emit('data', chunk);
        },
        function () {
          assert.deepEqual(files, [
            'test_case/test_case_3/file_0_1.js',
            'test_case/test_case_3/file_0_3.js']);
          this.emit('end');
        }))
      .pipe(angularFilter.restore())
      .pipe(es.through(
        function (chunk) {
          restoredFiles.push(path.relative(__dirname, chunk.path));
          this.emit('data', chunk);
        },
        function () {
          assert.deepEqual(restoredFiles, [
            'test_case/test_case_3/file_0_1.js',
            'test_case/test_case_3/file_0_3.js',
            'test_case/test_case_3/file_0_2.js',
            'test_case/test_case_3/file_0_4.js']);
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
      var angularFilter = angularDependency();
      vfs.src('test/test_case/test_case_3/*')
        .pipe(angularFilter)
        .pipe(checking)
        .pipe(angularFilter.restore())
        .pipe(angularDependency([]))
        .pipe(checking)
        .pipe(es.wait(function () {
          done();
        }))
    });
});