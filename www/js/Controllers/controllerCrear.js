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

  $scope.nuevoDesafioData = {
    titulo: "DesafioPlaceHolder",
    detalle: "ESTA ES UNA descripcion de Desafio!!",
    fechaInicio: new Date("13/10/2016"),
    fechaFin: new Date("29/10/2016"),
    valorApuesta: 50
  };

  $scope.maxCredits = UsuarioDesafios.getCredits();

  $scope.gridSelect = "";

  $scope.RadioButtonClick = function(but){
    console.log(but);
    $scope.gridSelect = but;
  }

  $scope.updateTextArea = function(id) {
    var element = document.getElementById(id);
    element.style.height =  element.scrollHeight + "px";
  }

  $scope.createDesafio = function(){
    var desafiosRef = SrvFirebase.RefDesafios();
    desafiosRef.push({
      titulo: $scope.nuevoDesafioData.titulo,
      detalle: $scope.nuevoDesafioData.detalle,
      fechaInicio: $scope.nuevoDesafioData.fechaInicio.getTime(),
      fechaFin: $scope.nuevoDesafioData.fechaFin.getTime(),
      creador: UsuarioDesafios.getShowData(),
      desafiado: "",
      estado: 'Available',
      ganador: "",
      valorApuesta: $scope.nuevoDesafioData.valorApuesta 
    },function(error){
      if(error){

      }else{
        SrvFirebase.EnviarNotificacion();
        CreditosSrv.GastarCreditos(UsuarioDesafios.getShowData(),$scope.nuevoDesafioData.valorApuesta);
        $scope.cleanData();
      }
    });

    
  }

  $scope.cleanData = function(){
    $scope.nuevoDesafioData = {
      titulo: "",
      detalle: "",
      fechaInicio: new Date(),
      fechaFin: new Date(),
      valorApuesta: 0
    };
  };

}]);
   
