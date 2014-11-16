var gutil = require('gulp-util');
var through = require('through2');
var commentDebug = require('comment-debug');

var pkg = require('./package.json');

module.exports = gulpCommentDebug;

function gulpCommentDebug(options) {
  return through.obj(gulpWrapper);

  function gulpWrapper(file, enc, callback) {
    if (file.isNull())
      return callback(null, file);

    if (file.isStream()) 
      return callback(new gutil.PluginError(pkg.name, 'Streaming not supported'));

    try {
      var converter = new commentDebug(options || {});
      file.contents = new Buffer(converter.process(file.contents.toString()))
      this.push(file);
    } catch (err) {
      this.emit('error', new gutil.PluginError(pkg.name, err));
    }

    callback();
  }
}