(function () {
  'use strict'
  forumApp = angular.module('forumApp')

  forumApp.controller('progressBarCtrl', function ($scope, ngProgressFactory, $state) {
    $scope.progressbar = ngProgressFactory.createInstance()
    $scope.progressbar.start()
    setTimeout(function () { $scope.progressbar.complete() }, 1000)

    console.log($state.current.name)
  })
})()
