exports.config = {
    framework: 'jasmine',
    specs: ['./src/**/*.e2e-spec.ts'],
    capabilities: {
      browserName: 'chrome' 
    },
    baseUrl: 'http://localhost:4200/'
  };