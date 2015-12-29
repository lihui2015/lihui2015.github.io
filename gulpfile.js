var gulp = require('gulp');
var browserSync = require('browser-sync');
var jade = require('gulp-jade');
var clean = require('gulp-clean');
//var svgSymbols = require('gulp-svg-symbols');

var src = "./src",
    dest = "./bulid";

gulp.task('concat', function() {                                //- 创建一个名为 concat 的 task
    gulp.src(['./css/wap_v3.1.css', './css/wap_v3.1.3.css'])    //- 需要处理的css文件，放到一个字符串数组里
        .pipe(concat('wap.min.css'))                            //- 合并后的文件名
        .pipe(minifyCss())                                      //- 压缩处理成一行
        .pipe(rev())                                            //- 文件名加MD5后缀
        .pipe(gulp.dest('./css'))                               //- 输出文件本地
        .pipe(rev.manifest())                                   //- 生成一个rev-manifest.json
        .pipe(gulp.dest('./rev'));                              //- 将 rev-manifest.json 保存到 rev 目录内
});

gulp.task('rev', function() {
    gulp.src(['./rev/*.json', './application/**/header.php'])   //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
        .pipe(revCollector({
            replaceReved:true
        }))                                   //- 执行文件内css名的替换
        .pipe(gulp.dest('./application/'));                     //- 替换后的文件输出的目录
});

gulp.task('cleanCSS',function(){
    return gulp.src(dest + '/css/*.css',{read:false})
                .pipe(clean());
});

gulp.task('cleanJS',function(){
    return gulp.src(dest + '/js/*.js',{read:false})
                .pipe(clean());
});

gulp.task("miniCss",['cleanCSS'],function(){
    return gulp.src(src + '/css/*')
                .pipe(minifyCss())
                .pipe(rev())
                .pipe(gulp.dest(dest + '/css'))
                .pipe(rev.manifest())
                .pipe(gulp.dest(src + '/rev/css'));
});
gulp.task("revCss",['miniCss'],function(){
    return gulp.src([src + '/rev/css/*.json','./index-test.html'])
                .pipe(revCollector({replaceReved:true}))
                .pipe(gulp.dest('./'));
});

gulp.task('minifyJs',['cleanJS'],function(){
    return gulp.src(src + '/js/*.js')
                .pipe(uglify())
                .pipe(rev())
                .pipe(gulp.dest(dest + '/js'))
                .pipe(rev.manifest())
                .pipe(gulp.dest(src + '/rev/js'));
});

gulp.task('revJs',['minifyJs'],function(){
    return gulp.src([src + '/rev/js/*.json', './index-test.html'])
                .pipe(revCollector({replaceReved:true}))
                .pipe(gulp.dest('./'));
});

/*gulp.task('sprites', function () {
        return gulp.src('images/*.svg')
        .pipe(svgSymbols())
        .pipe(gulp.dest('assets'));
    });*/

gulp.task('browser-sync', function(){
    var files = [
      '**'
   ];

   browserSync.init(files, {
      server: {
         baseDir: './'
      }
   });
   gulp.watch('./view/jade/*.jade',['jade']);
   //gulp.watch("./view/html/*.html").on("change", browserSync.reload);
});

gulp.task('cleanHtml',function(){
    gulp.src('./view/html/*.html',{read:false})
        .pipe(clean());
});

gulp.task('jade', ['cleanHtml'], function(){
    return gulp.src('./view/jade/*.jade')
            .pipe(jade({pretty:true}))
            .pipe(browserSync.stream())
            .pipe(gulp.dest('./view/html'));
});

gulp.task('watch',function(){
    gulp.watch('./view/jade/*.jade',['jade']);
});

gulp.task('default', ['jade','browser-sync']);

