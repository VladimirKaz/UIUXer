import gulp from 'gulp';
import { rm } from 'fs/promises';
import fileInclude from 'gulp-file-include';
import * as dartSass from 'sass';
import gulpSass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import uglify from 'gulp-uglify';
import imagemin from 'gulp-imagemin';
import browserSync from 'browser-sync';
import replace from 'gulp-replace';
import plumber from 'gulp-plumber';
import notify from 'gulp-notify';
import cache from 'gulp-cache';

const { src, dest, series, parallel, watch } = gulp;
const server = browserSync.create();

// Clean
async function clean() {
  await rm('dist', { recursive: true, force: true });
}

// Пути
const paths = {
  scss: 'src/scss/**/*.scss',
  js: 'src/js/**/*.js',
  img: 'src/img/**/*',
  htmlAll: 'src/html/**/*.html',
  htmlMain: 'src/html/pages/**/*.html',
  distCSS: 'dist/css',
  distJS: 'dist/js',
  distImg: 'dist/img',
  distHTML: 'dist/'
};

// Инициализация gulp-sass
const sassPlugin = gulpSass(dartSass);

// Уведомления об ошибках
const errorHandler = (title) => (err) => {
  notify.onError({ title, message: '<%= error.message %>' })(err);
  console.error(`❌ ${title}:`, err.toString());
  this.emit('end');
};

// Стили
function styles() {
  return src(paths.scss)
    .pipe(plumber({ errorHandler: errorHandler('Sass Error') }))
    .pipe(sassPlugin().on('error', sassPlugin.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS())
    .pipe(dest(paths.distCSS))
    .pipe(server.stream());
}

// JS
function scripts() {
  return src(paths.js)
    .pipe(plumber({ errorHandler: errorHandler('JS Error') }))
    .pipe(uglify())
    .pipe(dest(paths.distJS))
    .pipe(server.stream());
}

// Изображения (с кэшированием)
function images() {
  return src(paths.img, { encoding: false })
    .pipe(cache(
      imagemin([
        imagemin.mozjpeg({ quality: 85, progressive: true }),
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.svgo({
          plugins: [
            { removeViewBox: false },
            { cleanupIDs: false },
            { removeTitle: true },
            { convertPathData: false }
          ]
        })
      ], { verbose: true }
    ))
    .pipe(dest(paths.distImg)));
}

// HTML
function html() {
  console.log('🚀 Пересобираю HTML ...');

  return src(paths.htmlMain)
    .pipe(fileInclude({ prefix: '@@', basepath: '@file' }))
    // .pipe(replace(/src="(\.\/)?(img|js|css)\//g, 'src="./$2/'))
    .pipe(replace(/ (src|href)="\/(img|js|css|fonts|icons)\//g, ' $1="$2/'))
    .pipe(dest(paths.distHTML))
    .on('end', () => console.log('✅ HTML собран'));
}

// Сервер
function serve(done) {
  server.init({
    server: './dist',
    port: 3000,
    files: ['dist/**/*.{html,css,js,png,jpg,jpeg,svg}'],
    notify: false,
    reloadDelay: 500,
    reloadDebounce: 1000
  });

  // Наблюдение за изменениями
  watch(paths.htmlAll, gulp.series(html, (done) => {
    console.log('🔁 Перезагружаю страницу после изменения HTML');
    server.reload();
    done();
  })).on('error', (err) => console.error('Ошибка watch (HTML):', err));

  watch(paths.scss, styles).on('error', (err) => console.error('Ошибка watch (Sass):', err));
  watch(paths.js, scripts).on('error', (err) => console.error('Ошибка watch (JS):', err));
  watch(paths.img, images).on('error', (err) => console.error('Ошибка watch (Images):', err));

  done();
}

// Задачи
const dev = series(clean, parallel(styles, scripts, images, html), serve);
const build = series(parallel(styles, scripts, images, html));

export default dev;
export { build };