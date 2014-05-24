app.controller('MainController', ['$scope',
  function($scope){
    var self = this;

    self.title = function() {
      return "Single Page App Boilerplate";
    };
  }
])