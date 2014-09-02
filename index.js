var through     = require('through2');
var _           = require('lodash');

var angularModulesFactory =
  new (require('angular-dependency/lib')).AngularModulesFactory();

// plugin level function (dealing with files)
function gulpAngularDependency (modules) {

  function addToStream (stream, module) {
    stream.push(files[module.defined]);
    _.each(module.contents, function (path) {
      stream.push(files[path]);
    });
  }

  var files = {};
  if (typeof modules === 'string') { modules = [modules]; }

  // creating a stream through which each file will pass
  // returning the file stream
  return through.obj(function (chunk, enc, cb) {
    if (chunk.isNull()) {
      // do nothing if no contents
    }

    if (chunk.isBuffer()) {
      angularModulesFactory.processFile(chunk.contents.toString(), chunk.path);
      cb();
    }
    if (chunk.isStream()) {
      chunk.contents = chunk.contents.pipe(through.obj(function (content, enc, done) {
        angularModulesFactory.processFile(content.toString(), chunk.path);
        done();
      }, function () {
        cb();
      }));
    }

    files[chunk.path] = chunk;

  }, function (cb) {
    var topology = angularModulesFactory.getAngularModules();
    var that = this;
    if (modules) {
      _.each(modules, function (module) {
        _.each(topology.resolve(module, true), function (module) {
          addToStream(that, module);
        });
      });
    } else {
      _.each(topology.modules, function (module) {
        addToStream(that, module);
      });
    }
    cb();
  });
}

// exporting the plugin main function
module.exports = gulpAngularDependency;