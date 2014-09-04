var es          = require('event-stream');
var _           = require('lodash');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

var angularModulesFactory =
  new (require('angular-dependency/lib')).AngularModulesFactory();

// consts
const PLUGIN_NAME = 'gulp-angular-dependency';

// plugin level function (dealing with files)
function gulpAngularDependency (modules) {

  function addToStream (stream, module) {
    stream.emit('data', files[module.defined]);
    _.each(module.contents, function (path) {
      stream.emit('data', files[path]);
    });
  }

  var files = {};
  if (typeof modules === 'string') { modules = [modules]; }

  // creating a stream through which each file will pass
  // returning the file stream
  return es.through(function (chunk) {
    if (chunk.isNull()) {
      // do nothing if no contents
    }

    if (chunk.isBuffer()) {
      angularModulesFactory.processFile(chunk.contents.toString(), chunk.path);
    }
    if (chunk.isStream()) {
      return this.emit('error',
        new PluginError(PLUGIN_NAME,  'Streaming not supported'));
    }

    files[chunk.path] = chunk;

  }, function () {
    var topology = angularModulesFactory.getAngularModules();
    var that = this;
    if (modules && modules.length) {
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
    this.emit('end');
  });
}

// exporting the plugin main function
module.exports = gulpAngularDependency;
