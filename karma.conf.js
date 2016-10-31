module.exports = function(config) {

  var karma = {
    frameworks: ['jasmine'],
    files: [
      'test/*.spec.js',
      'src/js/model.js',
      'src/js/view.js',
      'src/js/presenter.js'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    client: {
      captureConsole: false
    },
    autoWatch: false,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeTravis: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: true,
    concurrency: Infinity
  };

  if (process.env.TRAVIS) {
    karma.browsers = ['ChromeTravis'];
  }

  config.set(karma);
};
