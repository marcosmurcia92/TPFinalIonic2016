////////////////////////////////////////////////////////////////////
//        IMPORTANTE:                                             // 
//    ESTADOS DE DESAFIOS:                                        //
//            _Available = Recien Creado (Disponible)             // 
//            _Accepted = Aceptado                                //
//            _Checking = Pendiente a revision por Administrador  //
//            _Finished = Terminado                               //
////////////////////////////////////////////////////////////////////

angular.module('app.controllers')
   
.controller('crearDesafioCtrl', ['$scope','$state' ,'$stateParams','$ionicPopup', 'CreditosSrv' ,'UsuarioDesafios', 'SrvFirebase',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state ,$stateParams,$ionicPopup, CreditosSrv, UsuarioDesafios,SrvFirebase) {

  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('desafiosTabs.perfilLoginRegister');
    }
  });

  $scope.nuevaBatallaData = {
    titulo: "BatallaNavalPlaceHolder",
    fechaInicio: new Date("13/10/2016"),
    fechaFin: new Date("29/10/2016"),
    valorApuesta: 50
  };

  $scope.gridSelect = "";

  $scope.RadioButtonClick = function(but){
    console.log(but);
    $scope.gridSelect = but;
  }

  $scope.maxCredits = UsuarioDesafios.getCredits();

  $scope.updateTextArea = function(id) {
    var element = document.getElementById(id);
    element.style.height =  element.scrollHeight + "px";
  }

  $scope.createDesafio = function(){

    var batallasRef = SrvFirebase.RefBatallas();
    batallasRef.push({
      titulo: $scope.nuevaBatallaData.titulo,
      fechaInicio: $scope.nuevaBatallaData.fechaInicio.getTime(),
      fechaFin: $scope.nuevaBatallaData.fechaFin.getTime(),
      creador: UsuarioDesafios.getShowData(),
      desafiado: "",
      estado: 'Available',
      turno: "C",
      ganador: "",
      valorApuesta: $scope.nuevaBatallaData.valorApuesta,
      tlSlot: {
        estado: "Oculto",
        duenio: ($scope.gridSelect == "TL" ? UsuarioDesafios.getShowData() : "Vacio"),
        estado2: "Oculto",
        duenio2: "Vacio"
      },
      trSlot: {
        estado: "Oculto",
        duenio: ($scope.gridSelect == "TR" ? UsuarioDesafios.getShowData() : "Vacio"),
        estado2: "Oculto",
        duenio2: "Vacio"
      },
      blSlot: {
        estado: "Oculto",
        duenio: ($scope.gridSelect == "BL" ? UsuarioDesafios.getShowData() : "Vacio"),
        estado2: "Oculto",
        duenio2: "Vacio"
      },
      brSlot: {
        estado: "Oculto",
        duenio: ($scope.gridSelect == "BR" ? UsuarioDesafios.getShowData() : "Vacio"),
        estado2: "Oculto",
        duenio2: "Vacio"
      }
    },function(error){
      if(error){
        var alertPopup = $ionicPopup.alert({
           title: 'Error',
           template: 'Error al Crear, revise la Consola'
         });
      }else{
        SrvFirebase.EnviarNotificacion();
        CreditosSrv.GastarCreditos(UsuarioDesafios.getShowData(),$scope.nuevaBatallaData.valorApuesta);
        $scope.cleanData();

        var alertPopup = $ionicPopup.alert({
           title: 'Desafio Creado',
           template: 'Tu desafio ha sido creado exitosamente, espera a que otro jugador se una a la competencia.'
         });
        alertPopup.then(function(res) {
           console.log('Alert de Creacion cerrado');
            $state.go('desafiosTabs.listaDeDesafios');
         });
      }
    });
  }

  $scope.cleanData = function(){
    $scope.nuevaBatallaData = {
      titulo: "",
      fechaInicio: new Date(),
      fechaFin: new Date(),
      valorApuesta: 0
    };
    $scope.gridSelect = "";
  };

}]);
   
