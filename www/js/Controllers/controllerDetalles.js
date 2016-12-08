////////////////////////////////////////////////////////////////////
//        IMPORTANTE:                                             // 
//    ESTADOS DE DESAFIOS:                                        //
//            _Available = Recien Creado (Disponible)             // 
//            _Accepted = Aceptado                                //
//            _Checking = Pendiente a revision por Administrador  //
//            _Finished = Terminado                               //
////////////////////////////////////////////////////////////////////

angular.module('app.controllers')

.controller('detallesDesafioCtrl', ['$scope','$http','$state', '$timeout', '$ionicPopup', '$stateParams', 'CreditosSrv' ,'UsuarioDesafios', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$http,$state, $timeout, $ionicPopup, $stateParams, CreditosSrv, UsuarioDesafios) {

  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('desafiosTabs.perfilLoginRegister');
    }
  });

  $scope.user = UsuarioDesafios;
  console.info("USUARIO", $scope.user);

  $scope.des = {
    titulo: "DesafioLoco",
    detalle: "Descripcion del LocoDesafio",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    valorApuesta: 100,
    estado: 'Available'
  };

  $scope.getFechaInicio = function(){
    return ($scope.des.fechaInicio.getDate()+1) + "/" + 
    ($scope.des.fechaInicio.getMonth()+1) + "/" + 
    ($scope.des.fechaInicio.getFullYear());
  };

  $scope.getFechaFin = function(){
    return ($scope.des.fechaFin.getDate()+1) + "/" + 
    ($scope.des.fechaFin.getMonth()+1) + "/" + 
    ($scope.des.fechaFin.getFullYear());
  };

  $scope.GoBack = function(){
    $state.go($stateParams.backState);
  };

  $scope.AceptarDesafio = function(){
    $scope.des.desafiado = UsuarioDesafios.getShowData();
    $scope.des.estado = 'Accepted';

    CreditosSrv.GastarCreditos(UsuarioDesafios.getShowData(),$scope.des.valorApuesta);

    //SOBRESCRIBIR DESAFIO
    firebase.database().ref('desafios/' + $stateParams.desId).update({
      desafiado : UsuarioDesafios.getShowData(),
      estado : 'Accepted'
    },function(error){
      if(error){
        var alertPopup = $ionicPopup.alert({
           title: 'Error',
           template: error
         });

         alertPopup.then(function(res) {
           console.log('Error cerrado');
         });
      }else{
        var alertPopup = $ionicPopup.alert({
           title: 'Aviso',
           template: 'DESAFIO ACEPTADO!!'
         });

         alertPopup.then(function(res) {
           console.log('Alert de Aceptado cerrado');
            $state.go('desafiosTabs.desafiosAceptados');
         });
      }
    });

  };

  $scope.CompletarDesafio = function(){
    //GANADOR ES EL DESAFIANTE
    $scope.des.ganador = $scope.des.desafiado;
    $scope.des.estado = 'Finished';

    CreditosSrv.GanarCreditos($scope.des.ganador,$scope.des.valorApuesta * 2);

    //SOBRESCRIBIR DESAFIO
    firebase.database().ref('desafios/' + $stateParams.desId).update({
      ganador : $scope.des.desafiado,
      estado : 'Finished'
    },function(error){
      if(error){
        var alertPopup = $ionicPopup.alert({
           title: 'Error',
           template: error
         });

         alertPopup.then(function(res) {
           console.log('Error cerrado');
         });
      }else{
        var alertPopup = $ionicPopup.alert({
           title: 'Aviso',
           template: 'DESAFIO TERMINADO!!'
         });

         alertPopup.then(function(res) {
           console.log('Alert de Aceptado cerrado');
            $state.go('desafiosTabs.desafiosAceptados');
         });
      }
    });
  };

  $scope.FallarDesafio = function(){
    //GANADOR ES EL CREADOR
    $scope.des.ganador = $scope.des.creador;
    $scope.des.estado = 'Finished';

    CreditosSrv.GanarCreditos($scope.des.ganador,$scope.des.valorApuesta * 2);

    //SOBRESCRIBIR DESAFIO
    firebase.database().ref('desafios/' + $stateParams.desId).update({
      ganador : $scope.des.creador,
      estado : 'Finished'
    },function(error){
      if(error){
        var alertPopup = $ionicPopup.alert({
           title: 'Error',
           template: error
         });

         alertPopup.then(function(res) {
           console.log('Error cerrado');
         });
      }else{
        var alertPopup = $ionicPopup.alert({
           title: 'Aviso',
           template: 'DESAFIO TERMINADO!!'
         });

         alertPopup.then(function(res) {
           console.log('Alert de Aceptado cerrado');
            $state.go('desafiosTabs.desafiosAceptados');
         });
      }
    });
  };

  console.info("PARAMS", $stateParams.desId);
  firebase.database().ref('desafios/' + $stateParams.desId).once('value', function(snapshot) {
      var exists = (snapshot.val() != null);
      console.log(exists);
      if(exists){
        $scope.des = snapshot.val();
        $scope.des.fechaInicio = new Date(snapshot.val().fechaInicio);
        $scope.des.fechaFin = new Date(snapshot.val().fechaFin);
        $scope.fechaInicioReal = $scope.getFechaInicio();
        $scope.fechaFinReal = $scope.getFechaFin();
      }
  });
  
}]);
   