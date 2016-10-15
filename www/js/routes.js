angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
  

      .state('desafiosTabs.autor', {
    url: '/autor',
    views: {
      'tab1': {
        templateUrl: 'templates/autor.html',
        controller: 'autorCtrl'
      }
    }
  })

  .state('desafiosTabs.crearDesafio', {
    url: '/crear',
    views: {
      'tab2': {
        templateUrl: 'templates/crearDesafio.html',
        controller: 'crearDesafioCtrl'
      }
    }
  })

  .state('desafiosTabs.listaDeDesafios', {
    url: '/lista',
    views: {
      'tab3': {
        templateUrl: 'templates/listaDeDesafios.html',
        controller: 'listaDeDesafiosCtrl'
      }
    }
  })

  .state('desafiosTabs.desafiosAceptados', {
    url: '/aceptados',
    views: {
      'tab4': {
        templateUrl: 'templates/desafiosAceptados.html',
        controller: 'desafiosAceptadosCtrl'
      }
    }
  })

  .state('detallesDesafio', {
    url: '/lista/desafio',
    templateUrl: 'templates/detallesDesafio.html',
    controller: 'detallesDesafioCtrl'
  })

  .state('desafiosTabs.perfilLoginRegister', {
    url: '/perfil',
    views: {
      'tab5': {
        templateUrl: 'templates/perfilLoginRegister.html',
        controller: 'perfilLoginRegisterCtrl'
      }
    }
  })

  .state('desafiosTabs', {
    url: '/desafios',
    templateUrl: 'templates/desafiosTabs.html',
    controller: 'tabsCtrl',
    abstract:true
  })

$urlRouterProvider.otherwise('/desafios/perfil')

  

});