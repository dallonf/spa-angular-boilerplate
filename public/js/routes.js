app.config(
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/test');

    $stateProvider.state('test', {
      url: '/test',
      templateUrl: 'templates/test.html',
      controller: 'TestController as testCtrl'
    });
  }
);