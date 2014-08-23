app.controller('TestController',
  function($scope, $http){
    var self = this;

    self.name = "World";

    $http.get('/api/v1/name')
      .success(function(data) {
        self.name = data.name;
      })
  }
);