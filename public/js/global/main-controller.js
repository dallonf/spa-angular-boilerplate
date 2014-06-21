angular.module('my-app').controller('MainController',
  function($scope){
    var self = this;

    self.title = function() {
      return "Single Page App Boilerplate";
    };
  }
);