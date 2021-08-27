import gulp from 'gulp';
import concat from 'gulp-concat';
import rename from 'gulp-rename';
import filter from 'gulp-filter';
import terser from 'gulp-terser';
import sourcemaps from 'gulp-sourcemaps';
import htmltidy from 'gulp-htmltidy';
import htmlmin from 'gulp-htmlmin';

import browserify from 'browserify';
import source from 'vinyl-source-stream'

import sass from 'gulp-sass';
import minifyCSS from 'gulp-csso';
import postcss from 'gulp-postcss';

import swig from 'gulp-swig';
import frontMatter from 'gulp-front-matter';
import htmlbeautify from 'gulp-html-beautify';
import uglify from 'gulp-uglify';

import dele from 'delete';
import autoprefixer from 'gulp-autoprefixer';
import through from "through2";
import path from "path";

import browserSync from 'browser-sync';

// Project Path
const src = {
    root: 'src/',
    docs: 'src/docs',
    docStyles: 'src/docs/assets/scss/**/*.scss',
    scripts: 'src/**/*.js',
}

// Distribution Path
const dist = {
    root: 'dist',
    docs: 'docs',
    docsStyles: 'docs/assets/css',
    docsScripts: 'docs/assets/js',
    scripts: 'dist',
}

// Develop Path
const build = {
    root: 'build',
    docs: 'build',
    scripts: 'build/assets/js',
    styles: 'build/assets/css'
}

gulp.task('html', () => {
    return gulp.src(src.docs + '/**/*.html')
        .pipe(gulp.dest(build.root))
        .pipe(htmlmin({
            removeComments: true,
            collapseWhitespace: true,
            collapseBooleanAttributes: true, // <input checked="true"/> ==> <input checked />
            removeEmptyAttributes: true, // <input id="" /> ==> <input />
            removeScriptTypeAttributes: true, // remove `type="text/javascript"` from <script>
            removeStyleLinkTypeAttributes: true, // remove `type="text/css"` from <style> <link>
            minifyJS: true,
            minifyCSS: true
        }))
        .pipe(gulp.dest(dist.docs))
        .pipe(browserSync.stream({ once: true }));
});

//compile scss into css
gulp.task('css', () => {
    return gulp.src(src.docStyles)
        .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            browsersList: [
                "last 2 versions",
                "ie >= 11"
            ]
        }))
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(build.styles))
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(filter('**/*.css'))
        .pipe(minifyCSS())
        .pipe(sourcemaps.write(''))
        .pipe(gulp.dest(dist.docsStyles))
        .pipe(filter('**/*.css'))
        .pipe(browserSync.stream({ once: true }));
});

gulp.task('copy-js-to-dev', () => {
    return gulp.src(src.scripts)
        .pipe(gulp.dest(build.scripts))
        .pipe(browserSync.stream({ once: true }));
});

gulp.task('combine-js', () => {
    return browserify({
        entries: [build.scripts + '/spacer.js'],
        debug: true
    })
        .transform('babelify', { presets: ['es2015'] })
        .bundle()
        .pipe(source("spacer.js"))
        .pipe(gulp.dest(dist.scripts));
});

gulp.task('compress-js', () => {
    return gulp.src(dist.scripts + '/**/*.js')
        .pipe(filter(file=>!/min\.js$/.test(file.path)))
        .pipe(uglify())
        .pipe(gulp.dest(dist.docsScripts))
        .pipe(rename({ extname: '.min.js' }))
        .pipe(gulp.dest(dist.scripts));
});

gulp.task('js', gulp.series('copy-js-to-dev', 'combine-js', 'compress-js'));

gulp.task('watch', gulp.series(() => {
    browserSync.init({
        notify: false,
        port: 3000,
        server: {
            baseDir: "./build",
            index: "/index.html"
        },
        watchOptions: {
            awaitWriteFinish: true
        }
    });

    gulp.watch(src.docs + '/**/*.html', gulp.parallel('html'));
    gulp.watch(src.docStyles, gulp.parallel('css'));
    gulp.watch(src.scripts, gulp.parallel('js'));
}));

gulp.task('default', gulp.series(gulp.parallel('html', 'css', 'js'), gulp.parallel('watch')));