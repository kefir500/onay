module.exports = function(config) {

  var karma = {
    frameworks: ['jasmine'],
    files: [
      'test/*.spec.js',
      'src/js/model.js',
      'src/js/view.js',
      'src/js/presenter.js'
    ],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    client: {
      captureConsole: false
    },
    autoWatch: false,
    browsers: ['ChromeCors'],
    customLaunchers: {
      ChromeCors: {
        base: 'Chrome',
        flags: ['--disable-web-security']
      },
      ChromeTravis: {
        base: 'Chrome',
        flags: ['--disable-web-security', '--no-sandbox']
      }
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        {type: 'html', subdir: './html'},
        {type: 'lcovonly', subdir: './lcov'}
      ]
    },
    preprocessors: {
      'src/js/model.js': ['coverage'],
      'src/js/view.js': ['coverage']
    },
    singleRun: true,
    concurrency: Infinity
  };

  if (process.env.TRAVIS) {
    karma.browsers = ['ChromeTravis'];
  }

  config.set(karma);
};
