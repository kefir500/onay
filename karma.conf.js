module.exports = function(config) {
  config.set({
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
    singleRun: true,
    concurrency: Infinity
  })
};
