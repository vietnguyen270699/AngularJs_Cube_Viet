"use strict";

var gulp = require("gulp");
var typescript = require("gulp-typescript");
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");

 

var tsProject ;



gulp.task("devbuild", function(){
        var ts = require("gulp-typescript");
        var sourcemaps = require('gulp-sourcemaps');
        if(!tsProject){
            tsProject = ts.createProject("tsconfig.json")
        }
        var reporter = ts.reporter.fullReporter();
        var tsResult = tsProject.src()
            .pipe(sourcemaps.init())
            .pipe(tsProject(reporter));
    
        return tsResult.js
            .pipe(sourcemaps.write())
            .pipe(gulp.dest("dist"));
    })  

  gulp.task('default', gulp.series('devbuild'));

