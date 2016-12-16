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
      estado2: "Oculto",
      duenio2: "Vacio"
    },
    trSlot: {
      estado: "Oculto",
      duenio: "Vacio",
      estado2: "Oculto",
      duenio2: "Vacio"
    },
    blSlot: {
      estado: "Oculto",
      duenio: "Vacio",
      estado2: "Oculto",
      duenio2: "Vacio"
    },
    brSlot: {
      estado: "Oculto",
      duenio: "Vacio",
      estado2: "Oculto",
      duenio2: "Vacio"
    }
  };

  $scope.newSelect = "";

  $scope.RadioButtonClick = function(but){
    console.log(but);
    $scope.newSelect = but;
  }

  $scope.gameSelect = "";

  $scope.GameButtonClick = function(but){
    console.log(but);

    var gano = false;

    $scope.gameSelect = but;

    $timeout(function(){
      switch (but){
        case 'TL':
          if($scope.des.turno == "C"){
            $scope.des.tlSlot.estado = "Visible";
          }else{
            $scope.des.tlSlot.estado2 = "Visible";
          }
          if($scope.des.tlSlot.duenio != "Vacio" && $scope.des.turno == "D"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.tlSlot.duenio.userName);
            },500);
          }
          if($scope.des.tlSlot.duenio2 != "Vacio" && $scope.des.turno == "C"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.tlSlot.duenio2.userName);
            },500);
          }
          break;
        case 'TR':
          if($scope.des.turno == "C"){
            $scope.des.trSlot.estado = "Visible";
          }else{
            $scope.des.trSlot.estado2 = "Visible";
          }
          if($scope.des.trSlot.duenio != "Vacio" && $scope.des.turno == "D"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.trSlot.duenio.userName);
            },500);
          }
          if($scope.des.trSlot.duenio2 != "Vacio" && $scope.des.turno == "C"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.trSlot.duenio2.userName);
            },500);
          }
          break;
        case 'BL':
          if($scope.des.turno == "C"){
            $scope.des.blSlot.estado = "Visible";
          }else{
            $scope.des.blSlot.estado2 = "Visible";
          }
          if($scope.des.blSlot.duenio != "Vacio" && $scope.des.turno == "D"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.blSlot.duenio.userName);
            },500);
          }
          if($scope.des.blSlot.duenio2 != "Vacio" && $scope.des.turno == "C"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.blSlot.duenio2.userName);
            },500);
          }
          break;
        case 'BR':
          if($scope.des.turno == "C"){
            $scope.des.brSlot.estado = "Visible";
          }else{
            $scope.des.brSlot.estado2 = "Visible";
          }
          if($scope.des.brSlot.duenio != "Vacio" && $scope.des.turno == "D"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.brSlot.duenio.userName);
            },500);
          }
          if($scope.des.brSlot.duenio2 != "Vacio" && $scope.des.turno == "C"){
            gano = true;
            $timeout(function(){
              alert("Descubrio a " + $scope.des.brSlot.duenio2.userName);
            },500);
          }
          break;
        default:
          break;
      }

      if(gano){
        if($scope.des.ganador == ""){
          //GANADOR
          $scope.des.ganador = UsuarioDesafios.getShowData();
        }else{
          //EMPATE
          $scope.des.ganador = "EMPATE";
        }

        if($scope.des.turno == "C"){
          $scope.SiguienteTurno();
        }else{
          $scope.CompletarDesafio();
        }
      }else{
        $scope.SiguienteTurno();
      }
    },500);
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
    $scope.des.fechaInicio = $scope.des.fechaInicio.getTime();
    $scope.des.fechaFin = $scope.des.fechaFin.getTime();

    switch($scope.newSelect){
      case 'TL':
        $scope.des.tlSlot.duenio2 = UsuarioDesafios.getShowData();
        break;
      case 'TR':
        $scope.des.trSlot.duenio2 = UsuarioDesafios.getShowData();
        break;
      case 'BL':
        $scope.des.blSlot.duenio2 = UsuarioDesafios.getShowData();
        break;
      case 'BR':
        $scope.des.brSlot.duenio2 = UsuarioDesafios.getShowData();
        break;
      default:
        console.log("ERROR UNDEFINED");
        return 0;
    }

    CreditosSrv.GastarCreditos(UsuarioDesafios.getShowData(),$scope.des.valorApuesta);

    //SOBRESCRIBIR DESAFIO
    SrvFirebase.RefBatallas($stateParams.desId).set(
      $scope.des
    ,function(error){
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

  $scope.SiguienteTurno = function(){
    $scope.des.turno = ($scope.des.turno == "C" ? "D" : "C");
    $scope.des.fechaInicio = $scope.des.fechaInicio.getTime();
    $scope.des.fechaFin = $scope.des.fechaFin.getTime();
    
    SrvFirebase.RefBatallas($stateParams.desId).set(
      $scope.des,
      function(error){
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
             title: 'Movimiento Realizado',
             template: 'Espera a la respuesta del otro jugador!'
           });

           alertPopup.then(function(res) {
             console.log('Alert de Aceptado cerrado');
              $state.go('desafiosTabs.desafiosAceptados');
           });
        }
      })
  };

  $scope.CompletarDesafio = function(){
    //GANADOR ES EL DESAFIANTE
    $scope.des.estado = 'Finished';
    $scope.des.fechaInicio = $scope.des.fechaInicio.getTime();
    $scope.des.fechaFin = $scope.des.fechaFin.getTime();

    if($scope.des.ganador == "EMPATE"){
      CreditosSrv.GanarCreditos($scope.des.creador,$scope.des.valorApuesta);
      CreditosSrv.GanarCreditos($scope.des.desafiado,$scope.des.valorApuesta);
    }else{
      CreditosSrv.GanarCreditos($scope.des.ganador,$scope.des.valorApuesta * 2);
    }

    //SOBRESCRIBIR DESAFIO
    SrvFirebase.RefBatallas($stateParams.desId).set(
      $scope.des,
      function(error){
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
    SrvFirebase.RefBatallas($stateParams.desId).update({
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
  SrvFirebase.RefBatallas($stateParams.desId).once('value', function(snapshot) {
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
   