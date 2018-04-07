{
  'use strict'

  angular.module('forumApp')

    .service('AuthService', ($q, $http, API_ENDPOINT, $rootScope) => {
      let LOCAL_TOKEN_KEY = 'yourTokenKey'
      let isAuthenticated = false
      let authToken

      function loadUserCredentials () {
        let token = window.localStorage.getItem(LOCAL_TOKEN_KEY)
        if (token) {
          useCredentials(token)
        }
      }

      function storeUserCredentials (token) {
        window.localStorage.setItem(LOCAL_TOKEN_KEY, token)
        useCredentials(token)
      }

      function useCredentials (token) {
        isAuthenticated = true
        authToken = token

        // Set the token as header for your requests!
        $http.defaults.headers.common.Authorization = authToken
      }

      function destroyUserCredentials () {
        authToken = undefined
        isAuthenticated = false
        $http.defaults.headers.common.Authorization = undefined
        window.localStorage.removeItem(LOCAL_TOKEN_KEY)
      }

      let register = user => {
        return $q((resolve, reject) => {
          $http.post(API_ENDPOINT.url + '/signup', user).then(result => {
            if (result.data.success) {
              resolve(result.data.msg)
            } else {
              reject(result.data.msg)
            }
          })
        })
      }

      let login = user => {
        return $q((resolve, reject) => {
          $http.post(API_ENDPOINT.url + '/authenticate', user).then(result => {
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

      let logout = () => {
        destroyUserCredentials()
      }

      loadUserCredentials()

      return {
        login: login,
        register: register,
        logout: logout,
        isAuthenticated: () => isAuthenticated
      }
    })

    .factory('AuthInterceptor', ($rootScope, $q, AUTH_EVENTS) => {
      return {
        responseError: response => {
          $rootScope.$broadcast({
            401: AUTH_EVENTS.notAuthenticated
          }[response.status], response)
          return $q.reject(response)
        }
      }
    })

    .config($httpProvider => {
      $httpProvider.interceptors.push('AuthInterceptor')
    })
}
