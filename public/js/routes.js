app.config([
  '$routeProvider',
  function($routeProvider) {
    $routeProvider.when('/test', {
      templateUrl: 'templates/test.html',
      controller: 'TestController',
      controllerAs: 'testCtrl'
    })
    .otherwise({
      redirectTo: '/test'
    });
  }
]);