const { src, dest, watch } = require('gulp');
const minifyCSS = require("gulp-csso");
const postcss = require("gulp-postcss");

const purgecss = require("@fullhuman/postcss-purgecss")({
  // Specify the paths to all of the template files in your project
  content: ["dist/index.html"],
  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || []
});

const isProd = process.env.NODE_ENV === 'production';

function css() {
  let stream = src("styles/main.css")
    .pipe(
      postcss([
        require("tailwindcss"),
        require("autoprefixer"),
        ...(isProd ? [purgecss] : [])
      ])
    );

    if (isProd) {
      stream = stream.pipe(minifyCSS());
    }

    return stream.pipe(dest("dist/css"));
}

exports.watch = function() {
  watch(["styles/*.css"], function(cb) {
    css();
    cb();
  });
};

// The default gulp task is used to build the CSS for prod,
// so make sure `purge` is true
exports.default = css;
