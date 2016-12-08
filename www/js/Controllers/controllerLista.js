////////////////////////////////////////////////////////////////////
//        IMPORTANTE:                                             // 
//    ESTADOS DE DESAFIOS:                                        //
//            _Available = Recien Creado (Disponible)             // 
//            _Accepted = Aceptado                                //
//            _Checking = Pendiente a revision por Administrador  //
//            _Finished = Terminado                               //
////////////////////////////////////////////////////////////////////

angular.module('app.controllers')
   
.controller('listaDeDesafiosCtrl', ['$scope','$state', '$timeout', '$stateParams', 'UsuarioDesafios',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state, $timeout, $stateParams, UsuarioDesafios) {
  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('desafiosTabs.perfilLoginRegister');
    }
  });

  var desafiosRef = firebase.database().ref("desafios/");
  $scope.DesafiosDisponibles = [];

  desafiosRef.on('child_added', function(snapshot) {
    // code to handle new child.
    $timeout(function(){
      var desafioId = snapshot.key;
      var desafioObject = snapshot.val();
      if((desafioObject.estado == 'Available' || UsuarioDesafios.isAdmin())){
        desafioObject.id = desafioId;
        console.log(desafioObject);
        $scope.DesafiosDisponibles.push(desafioObject);
      }
    });
  });

  $scope.IrAlDesafio = function(desafio){
    $state.go('detallesDesafio',{desId : desafio.id, backState : 'desafiosTabs.listaDeDesafios'});
  };

}]);

    