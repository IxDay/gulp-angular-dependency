## Information

[![Build Status](https://travis-ci.org/IxDay/gulp-angular-dependency.svg)](https://travis-ci.org/IxDay/gulp-angular-dependency)

<table>
<tr> 
<td>Package</td><td>gulp-angular-dependency</td>
</tr>
<tr>
<td>Description</td>
<td>Retrieve files needed by angular modules through your 
filesystem</td>
</tr>
<tr>
<td>Node Version</td>
<td>>= 0.10</td>
</tr>
</table>

## Usage

```js
var angularDependency= require('gulp-angular-dependency');

gulp.task('module', function() {
  gulp.src('./src/**/*.js')
    .pipe(angularDependency('module1'))
    .pipe(gulp.dest('./dist/'))
});
```

This will filter files which are part of the angular module1 dependency.


## LICENSE

(MIT License)

Copyright (c) 2014 Maxime Vidori <maxime.vidori@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.