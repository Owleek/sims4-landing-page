const gulp             = require('gulp');
const sass             = require('gulp-sass');
const autoprefixer     = require('gulp-autoprefixer');
const cssbeautify      = require('gulp-cssbeautify');
const imagemin         = require('gulp-imagemin');
const rigger           = require('gulp-rigger');
const del              = require('del');
const svgSprite        = require('gulp-svg-sprite');
const svgmin           = require('gulp-svgmin');
const cheerio          = require('gulp-cheerio');
const replace          = require('gulp-replace');
const browsersync      = require('browser-sync').create();
// const cssnano          = require('gulp-cssnano');
// const uglify           = require('gulp-uglify');
// const rename           = require('gulp-rename');

const path = {
    build: {
        html   : "dist/",
        js     : "dist/js/",
        style  : "dist/style/",
        images : "dist/images/",
        svg    : "dist/images/svg/",
        fonts  : "dist/fonts/"
    },

    src: {
        html  : "src/*.html",
        js    : "src/js/*.js",
        style : "src/style/*.scss",
        images: "src/images/**/*.{jpg,png,gif,ico}",
        svg   : "src/images/svg/*.svg",
        fonts : "src/fonts/**/*"
    },

    watch: {
        html  : "src/**/*.html",
        js    : "src/js/**/*.js",
        style : "src/style/**/*.scss",
        images: "src/images/**/*.{jpg,png,gif,ico}",
        svg   : "src/images/**/*.svg",
        fonts : "src/fonts/**/*"
    },

    clean: "./dist"
}

//================ browserSync

function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./dist/",
            directory: true
        },
        port: 3000,
        tunnel: false,
        logPrefix: "log__"
    });
    done();
}

function browserSyncReload(done) {
    browsersync.reload();
    done();
}
//================ / browserSync

function html() {
    return gulp.src(path.src.html)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.html))
    .pipe(browsersync.stream());
}

function style() {
    return gulp.src(path.src.style)
    .pipe(sass())
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(cssbeautify())
    .pipe(gulp.dest(path.build.style))
    .pipe(browsersync.stream());
}

function scripts() {
    return gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(gulp.dest(path.build.js))
    .pipe(browsersync.stream());
}

function images() {
    return gulp.src(path.src.images)
    .pipe(imagemin())
    .pipe(gulp.dest(path.build.images));
}

function svg() {
    return gulp.src(path.src.svg)
    .pipe(gulp.dest(path.build.svg))
    .pipe(svgmin({
        js2svg: {
            pretty: true
        }
    }))
    .pipe(cheerio(function ($) {
        $('[fill]').removeAttr('fill');
        $('[stroke]').removeAttr('stroke');
        $('[style]').removeAttr('style');
    }))
    .pipe(replace('&gt;', '>'))
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "sprite.svg"
            }
        }
    }))
    .pipe(gulp.dest(path.build.svg));
}

function svgOrigin() {
    return gulp.src(path.src.svg)
    .pipe(svgSprite({
        mode: {
            symbol: {
                sprite: "spriteOrigin.svg"
            }
        }
    }))
    .pipe(gulp.dest(path.build.svg));
}


function fonts() {
    return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.build.fonts));
}

function watchFiles() {
    gulp.watch(path.watch.html, html);
    gulp.watch(path.watch.style, style);
    gulp.watch(path.watch.js, scripts);
    gulp.watch(path.watch.images, images);
    gulp.watch(path.watch.svg, svg);
    gulp.watch(path.watch.svg, svgOrigin);
    gulp.watch(path.watch.fonts, fonts);
}

function clean() {
    return del(path.clean);
}

const build = gulp.series(clean, gulp.parallel(html, style, scripts, images, svg, svgOrigin, fonts));
const watch = gulp.parallel(build, watchFiles, browserSync);

exports.html        = html;
exports.style       = style;
exports.scripts     = scripts;
exports.images      = images;
exports.svg         = svg;
exports.svgOrigin   = svgOrigin;
exports.fonts       = fonts;
exports.watchFiles  = watchFiles;
exports.clean       = clean;
exports.build       = build;
exports.watch       = watch;
exports.default     = watch;
