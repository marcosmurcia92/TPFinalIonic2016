////////////////////////////////////////////////////////////////////
//        IMPORTANTE:                                             // 
//    ESTADOS DE DESAFIOS:                                        //
//            _Available = Recien Creado (Disponible)             // 
//            _Accepted = Aceptado                                //
//            _Checking = Pendiente a revision por Administrador  //
//            _Finished = Terminado                               //
////////////////////////////////////////////////////////////////////

angular.module('app.controllers')

.controller('detallesDesafioCtrl', ['$scope','$http','$state', '$timeout', '$ionicPopup', '$stateParams', 'CreditosSrv' ,'UsuarioDesafios','SrvFirebase', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$http,$state, $timeout, $ionicPopup, $stateParams, CreditosSrv, UsuarioDesafios,SrvFirebase) {

  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('desafiosTabs.perfilLoginRegister');
    }
  });

  $scope.user = UsuarioDesafios;
  console.info("USUARIO", $scope.user);

  $scope.des = {
    titulo: "DesafioEjemplo",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    creador: {
      userName: "Pepe Perez"
    },
    desafiado: {
      userName: "Lopez Lopez"
    },
    estado: 'Available',
    turno: "C",
    ganador: "",
    valorApuesta: 200,
    tlSlot: {
      estado: "Oculto",
      duenio: "Vacio",
      duenio2: "Vacio"
    },
    trSlot: {
      estado: "Oculto",
      duenio: "Vacio",
      duenio2: "Vacio"
    },
    blSlot: {
      estado: "Oculto",
      duenio: "Vacio",
      duenio2: "Vacio"
    },
    brSlot: {
      estado: "Oculto",
      duenio: "Vacio",
      duenio2: "Vacio"
    }
  };

  $scope.newSelect = "";

  $scope.RadioButtonClick = function(but){
    console.log(but);

    $scope.newSelect = but;
    switch (but){
      case 'TL':
        $scope.des.tlSlot.estado = "Visible";
        if($scope.des.tlSlot.duenio != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.tlSlot.duenio.userName);
          },500);
        }
        if($scope.des.tlSlot.duenio2 != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.tlSlot.duenio2.userName);
          },500);
        }
        break;
      case 'TR':
        $scope.des.trSlot.estado = "Visible";
        if($scope.des.trSlot.duenio != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.trSlot.duenio.userName);
          },500);
        }
        if($scope.des.trSlot.duenio2 != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.trSlot.duenio2.userName);
          },500);
        }
        break;
      case 'BL':
        $scope.des.blSlot.estado = "Visible";
        if($scope.des.blSlot.duenio != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.blSlot.duenio.userName);
          },500);
        }
        if($scope.des.blSlot.duenio2 != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.blSlot.duenio2.userName);
          },500);
        }
        break;
      case 'BR':
        $scope.des.brSlot.estado = "Visible";
        if($scope.des.brSlot.duenio != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.brSlot.duenio.userName);
          },500);
        }
        if($scope.des.brSlot.duenio2 != "Vacio"){
          $timeout(function(){
            alert("Descubrio a " + $scope.des.brSlot.duenio2.userName);
          },500);
        }
        break;
      default:
        break;
    }
  }

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
    SrvFirebase.RefDesafios($stateParams.desId).update({
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
    SrvFirebase.RefDesafios($stateParams.desId).update({
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
    SrvFirebase.RefDesafios($stateParams.desId).update({
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
  SrvFirebase.RefDesafios($stateParams.desId).once('value', function(snapshot) {
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
   