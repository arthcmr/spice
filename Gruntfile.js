// Generated on 2014-11-15 using generator-chrome-extension 0.2.6
'use strict';

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist',
        manifest: grunt.file.readJSON('app/manifest.json')
    };

    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            bower: {
                files: ['bower.json'],
                tasks: ['bowerInstall']
            },
            js: {
                files: ['<%= config.app %>/scripts/{,*/}*.js'],
                options: {
                    livereload: true
                }
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            styles: {
                files: ['<%= config.app %>/styles/{,*/}*.css'],
                tasks: [],
                options: {
                    livereload: true
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= config.app %>/*.html',
                    '<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                    '<%= config.app %>/sounds/{,*/}*.{mp3}',
                    '<%= config.app %>/manifest.json',
                    '<%= config.app %>/_locales/{,*/}*.json'
                ]
            }
        },

        // Grunt server and debug server setting
        connect: {
            options: {
                port: 9000,
                livereload: 35729,
                // change this to '0.0.0.0' to access the server from outside
                hostname: 'localhost'
            },
            chrome: {
                options: {
                    open: false,
                    base: [
                        '<%= config.app %>'
                    ]
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            chrome: {
            },
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '<%= config.dist %>/*',
                        '!<%= config.dist %>/.git*'
                    ]
                }]
            }
        },

        // Automatically inject Bower components into the HTML file
        bowerInstall: {
            app: {
                src: ['<%= config.app %>/index.html'],
                ignorePath: '<%= config.app %>/'
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            options: {
                dest: '<%= config.dist %>'
            },
            html: [
                '<%= config.app %>/app.html',
                '<%= config.app %>/options.html'
            ]
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            options: {
                assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
            },
            html: ['<%= config.dist %>/{,*/}*.html'],
            css: ['<%= config.dist %>/styles/{,*/}*.css']
        },

        // The following *-min tasks produce minifies files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.{gif,jpeg,jpg,png}',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/images',
                    src: '{,*/}*.svg',
                    dest: '<%= config.dist %>/images'
                }]
            }
        },

        htmlmin: {
            dist: {
                options: {
                    // removeCommentsFromCDATA: true,
                    // collapseWhitespace: true,
                    // collapseBooleanAttributes: true,
                    // removeAttributeQuotes: true,
                    // removeRedundantAttributes: true,
                    // useShortDoctype: true,
                    // removeEmptyAttributes: true,
                    // removeOptionalTags: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>',
                    src: '*.html',
                    dest: '<%= config.dist %>'
                }]
            }
        },

        // Auto buildnumber, exclude debug files. smart builds that event pages
        chromeManifest: {
            dist: {
                options: {
                    buildnumber: false,
                    background: {
                        target: 'scripts/background.js',
                        exclude: [
                            'scripts/chromereload.js'
                        ]
                    }
                },
                src: '<%= config.app %>',
                dest: '<%= config.dist %>'
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>',
                    dest: '<%= config.dist %>',
                    src: [
                        '*.{ico,png,txt}',
                        'images/{,*/}*.{webp,gif}',
                        'sounds/{,*/}*.mp3',
                        '{,*/}*.html',
                        'styles/{,*/}*.css',
                        'styles/fonts/{,*/}*.*',
                        '_locales/{,*/}*.json',
                        'scripts/{,*/}*.js'
                    ]
                }]
            },
            dependencies: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= config.app %>/bower_components',
                    dest: '<%= config.dist %>/vendor',
                    src: [
                        'jquery/dist/jquery.min.js',
                        'pleasejs/dist/Please.js'
                    ]
                }]
            }
        },

        // Run some tasks in parallel to speed up build process
        concurrent: {
            chrome: [
            ],
            dist: [
                'imagemin',
                'svgmin'
            ],
            test: [
            ]
        },

        // Compres dist files to package
        compress: {
            dist: {
                options: {
                    archive: 'package/Spice<%= config.manifest.version %>.zip'
                },
                files: [{
                    expand: true,
                    cwd: 'dist/',
                    src: ['**'],
                    dest: ''
                }]
            }
        }
    });

    grunt.registerTask('debug', function () {
        grunt.task.run([
            'concurrent:chrome',
            'connect:chrome',
            'watch'
        ]);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'chromeManifest',
        'useminPrepare',
        'concurrent:dist',
        'concat',
        'copy',
        'usemin'
    ]);

    grunt.registerTask('deploy', [
        'build',
        'compress'
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
