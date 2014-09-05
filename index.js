var es          = require('event-stream');
var _           = require('lodash');
var gutil       = require('gulp-util');
var PluginError = gutil.PluginError;

// consts
const PLUGIN_NAME = 'gulp-angular-dependency';

// plugin level function (dealing with files)
function gulpAngularDependency (modules) {
  var restoreStream = es.through();
  var angularModulesFactory =
      new (require('angular-dependency/lib')).AngularModulesFactory();
  var files = {};


  function addToStream (stream, module) {

    if (files[module.defined]) {
      stream.emit('data', files[module.defined]);
      delete files[module.defined];
    }

    _.each(module.contents, function (path) {
      if (files[path]) {
        stream.emit('data', files[path]);
        delete files[path];
      }
    });
  }

  if (typeof modules === 'string') { modules = [modules]; }

  var stream = es.through(function (chunk) {
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
    var topology = angularModulesFactory.angularModules();
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
    _.each(files, function (file) {
      restoreStream.emit('data', file);
    });

    restoreStream.emit('end');
    this.emit('end');
  });

  stream.restore = function (options) {
    options = options || {};
		if (options.end) {
			return restoreStream;
		}

		return restoreStream.pipe(es.through(), { end: false });
  };

  return stream;
}

// exporting the plugin main function
module.exports = gulpAngularDependency;
