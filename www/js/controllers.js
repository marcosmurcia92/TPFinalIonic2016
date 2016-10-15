angular.module('app.controllers', [])
  
.controller('tabsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
  
.controller('autorCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('crearDesafioCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('listaDeDesafiosCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('desafiosAceptadosCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('detallesDesafioCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('perfilLoginRegisterCtrl', ['$scope', '$stateParams', '$timeout','$ionicPopup', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $timeout,$ionicPopup) {

  $scope.userData = {};
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.isLogged = firebase.auth().currentUser != null;
  $scope.modalState = $scope.isLogged ? 'Perfil' : 'Login';

  $scope.doLoginGoogle = function(){
  	var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    	.then(function(response){
    		console.info("SUCCESS GOOGLE+: ", response);
	      $timeout(function(){
	            $scope.isLogged = true;
	            $scope.modalState = 'Perfil';
      		},100);
    	},function(error){
    		console.info("ERROR GOOGLE+: ", error);
    	});
  };

  $scope.doLogin = function() {
    firebase.auth().signInWithEmailAndPassword($scope.loginData.usermail, $scope.loginData.password)
      .catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      console.info("ERROR " + errorCode, errorMessage);
      // ...
    }).then(function(success){
      console.info("SUCCESS",success);
      $timeout(function(){
        if(success){
          if(firebase.auth().currentUser.emailVerified){
            $scope.isLogged = true;
            $scope.modalState = 'Perfil';
          }else{
            firebase.auth().currentUser.sendEmailVerification().then(function(){
               var alertPopup = $ionicPopup.alert({
                 title: 'Verificacion de Email',
                 template: 'Se ha enviado un mail para verificar la direccion del usuario'
               });

               alertPopup.then(function(res) {
                 console.log('Alert de Verificacion cerrado');
               });
            },function(error){
              console.info("Verification error",error);
            });
            
          }
        }else{
          $scope.isLogged = false;
        }
      },100);
    });

    console.log('Doing login', $scope.loginData);
  };

  $scope.doRegister = function(){
      firebase.auth().createUserWithEmailAndPassword($scope.registerData.usermail, $scope.registerData.password)
      .then(function(respuesta) {
        console.info("Success Register",respuesta);
        console.log(firebase.auth().currentUser);
        if(!respuesta.emailVerified){
          firebase.auth().currentUser.sendEmailVerification().then(function(){
               var alertPopup = $ionicPopup.alert({
                 title: 'Verificacion de Email',
                 template: 'Se ha enviado un mail para verificar la direccion del usuario'
               });

               alertPopup.then(function(res) {
                 console.log('Alert de Verificacion cerrado');
               });
            },function(error){
              console.info("Verification error",error);
            });
        }
      }, function(error) {
        console.info("Error Register",error);
        var alertPopup = $ionicPopup.alert({
           title: 'Register Error',
           template: error.message
         });
      });
  }

  $scope.doLogout = function(){
    firebase.auth().signOut().then(function() {
      // Sign-out successful.
      console.log("LOG OUT SUCCESS");
      $timeout(function(){
	  	$scope.loginData.usermail= "";
	  	$scope.loginData.password= "";
        $scope.isLogged = false;
     	$scope.modalState = 'Login';
      },100);
    }, function(error) {
      console.info("ERROR LOGOUT",error);
    });
  };

  $scope.resetPassword = function(){
      firebase.auth().sendPasswordResetEmail($scope.loginData.usermail).then(function(respuesta) {
        // Email sent.
        console.info("Success Reset",respuesta);
      }, function(error) {
        // An error happened.
        console.info("Error Reset",error);
      });
  };

  $scope.goToRegister = function(){
  	$scope.registerData.username= "";
  	$scope.registerData.usermail= "";
  	$scope.registerData.password= "";
  	$scope.registerData.passwordC= "";
    $timeout(function(){
      $scope.modalState = 'Register';
    },100);
  };

  $scope.goToLogin = function(){
    $timeout(function(){
  	$scope.loginData.usermail= "";
  	$scope.loginData.password= "";
      $scope.modalState = 'Login';
    },100);
  };

}])
    