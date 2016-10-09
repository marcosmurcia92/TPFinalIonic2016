angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('desafiosTabs.crearDesafio', {
    url: '/crear',
    views: {
      'tab1': {
        templateUrl: 'templates/crearDesafio.html',
        controller: 'crearDesafioCtrl'
      }
    }
  })

  .state('desafiosTabs.listaDeDesafios', {
    url: '/lista',
    views: {
      'tab2': {
        templateUrl: 'templates/listaDeDesafios.html',
        controller: 'listaDeDesafiosCtrl'
      }
    }
  })

  .state('desafiosTabs.desafiosAceptados', {
    url: '/aceptados',
    views: {
      'tab3': {
        templateUrl: 'templates/desafiosAceptados.html',
        controller: 'desafiosAceptadosCtrl'
      }
    }
  })

  .state('desafiosTabs', {
    url: '/desafios',
    templateUrl: 'templates/desafiosTabs.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('register', {
    url: '/register',
    templateUrl: 'templates/register.html',
    controller: 'registerCtrl'
  })

  .state('autor', {
    url: '/autor',
    templateUrl: 'templates/autor.html',
    controller: 'autorCtrl'
  })

  .state('desafiosTabs.detallesDesafio', {
    url: '/lista/desafio',
    views: {
      'tab2': {
        templateUrl: 'templates/detallesDesafio.html',
        controller: 'detallesDesafioCtrl'
      }
    }
  })

$urlRouterProvider.otherwise('/desafios/lista')

  

});