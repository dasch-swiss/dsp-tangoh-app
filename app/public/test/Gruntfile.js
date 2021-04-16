/**
 * In `Gruntfile.js` we define tasks that we
 * want to perform in the project. In this example
 * we want to run tests for the `Calculator` object.
 */
module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig({
        qunit: {
            all: ['specs/**/*.html']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-qunit');

// A convenient task alias.
    grunt.registerTask('test', ['connect', 'qunit']);
}
