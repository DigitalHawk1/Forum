(function () {
  'use strict'

  angular.module('forumApp').service('AuthService', function ($q, $http, API_ENDPOINT, $rootScope) {
    var LOCAL_TOKEN_KEY = 'yourTokenKey'
    var _isAuthenticated = false
    var authToken = void 0

    function loadUserCredentials() {
      var token = window.localStorage.getItem(LOCAL_TOKEN_KEY)
      if (token) {
        useCredentials(token)
      }
    }

    function storeUserCredentials(token) {
      window.localStorage.setItem(LOCAL_TOKEN_KEY, token)
      useCredentials(token)
    }

    function useCredentials(token) {
      _isAuthenticated = true
      authToken = token

      // Set the token as header for your requests!
      $http.defaults.headers.common.Authorization = authToken
    }

    function destroyUserCredentials() {
      authToken = undefined
      _isAuthenticated = false
      $http.defaults.headers.common.Authorization = undefined
      window.localStorage.removeItem(LOCAL_TOKEN_KEY)
    }

    var register = function register(user) {
      return $q(function (resolve, reject) {
        $http.post(API_ENDPOINT.url + '/signup', user).then(function (result) {
          if (result.data.success) {
            resolve(result.data.msg)
          } else {
            reject(result.data.msg)
          }
        })
      })
    }

    var login = function login(user) {
      return $q(function (resolve, reject) {
        $http.post(API_ENDPOINT.url + '/authenticate', user).then(function (result) {
          if (result.data.success) {
            storeUserCredentials(result.data.token)
            $rootScope.userRole = result.data.userStatus
            resolve(result.data.msg)
          } else {
            reject(console.log(result.data.msg))
          }
        })
      })
    }

    var logout = function logout() {
      destroyUserCredentials()
    }

    loadUserCredentials()

    return {
      login: login,
      register: register,
      logout: logout,
      isAuthenticated: function isAuthenticated() {
        return _isAuthenticated
      }
    }
  }).factory('AuthInterceptor', function ($rootScope, $q, AUTH_EVENTS) {
    return {
      responseError: function responseError(response) {
        $rootScope.$broadcast({
          401: AUTH_EVENTS.notAuthenticated
        }[response.status], response)
        return $q.reject(response)
      }
    }
  }).config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptor')
  })
})()
