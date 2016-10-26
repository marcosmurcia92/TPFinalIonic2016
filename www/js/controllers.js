////////////////////////////////////////////////////////////////////
//        IMPORTANTE:                                             // 
//    ESTADOS DE DESAFIOS:                                        //
//            _Available = Recien Creado (Disponible)             // 
//            _Accepted = Aceptado                                //
//            _Checking = Pendiente a revision por Administrador  //
//            _Finished = Terminado                               //
////////////////////////////////////////////////////////////////////

angular.module('app.controllers', [])
  
.controller('tabsCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
  
.controller('autorCtrl', ['$scope', '$stateParams','$cordovaInAppBrowser', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams,$cordovaInAppBrowser) {
  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'no'
    };

  $scope.OpenGitHub=function(){
    $cordovaInAppBrowser.open('https://github.com/marcosmurcia92/', '_self', options)
      .then(function(event) {
        // success
      })
      .catch(function(event) {
        // error
      });
  };

}])
   
.controller('crearDesafioCtrl', ['$scope','$state' ,'$stateParams', 'UsuarioDesafios',// The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state ,$stateParams,UsuarioDesafios) {

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

  $scope.updateTextArea = function(id) {
    var element = document.getElementById(id);
    element.style.height =  element.scrollHeight + "px";
  }

  $scope.createDesafio = function(){
    var desafiosRef = firebase.database().ref("desafios/");
    desafiosRef.push({
      titulo: $scope.nuevoDesafioData.titulo,
      detalle: $scope.nuevoDesafioData.detalle,
      fechaInicio: $scope.nuevoDesafioData.fechaInicio.getTime(),
      fechaFin: $scope.nuevoDesafioData.fechaFin.getTime(),
      creador: UsuarioDesafios.getUUID(),
      desafiado: "",
      estado: "Available",
      ganador: "",
      valorApuesta: $scope.nuevoDesafioData.valorApuesta 
    });

    $scope.cleanData();
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

}])
   
.controller('listaDeDesafiosCtrl', ['$scope','$state', '$timeout', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state, $timeout, $stateParams) {
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
      desafioObject.id = desafioId;
      console.log(desafioObject);
      $scope.DesafiosDisponibles.push(desafioObject);
    });
  });

  $scope.IrAlDesafio = function(desafio){
    $state.go('detallesDesafio',{desId : desafio.id});
  };

}])

.controller('detallesDesafioCtrl', ['$scope','$http','$state', '$timeout', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$http,$state, $timeout, $stateParams) {

  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('desafiosTabs.perfilLoginRegister');
    }
  });

  $scope.des = {
    titulo: "DesafioLoco",
    detalle: "Descripcion del LocoDesafio",
    fechaInicio: new Date(),
    fechaFin: new Date(),
    valorApuesta: 100
  };

  console.info("PARAMS", $stateParams.desId);
  firebase.database().ref('desafios/' + $stateParams.desId).once('value', function(snapshot) {
      var exists = (snapshot.val() != null);
      console.log(exists);
      if(exists){
        $scope.des = snapshot.val();
      }
  });
  
}])
   
.controller('desafiosAceptadosCtrl', ['$scope','$state', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope,$state, $stateParams) {
  $scope.$on('$ionicView.loaded', function () {
    if(firebase.auth().currentUser == null){
      $state.go('desafiosTabs.perfilLoginRegister');
    }
  });

}])
   
.controller('perfilLoginRegisterCtrl', ['$scope', '$stateParams', '$timeout','$ionicPopup', 'UsuarioDesafios', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $timeout,$ionicPopup, UsuarioDesafios) {

  $scope.userData = {
    username: UsuarioDesafios.getName(),
    email: UsuarioDesafios.getMail(),
    credits: UsuarioDesafios.getCredits(),
    profile_picture : UsuarioDesafios.getPhoto()
  };
  $scope.loginData = {};
  $scope.registerData = {};
  $scope.isLogged = firebase.auth().currentUser != null;
  $scope.modalState = $scope.isLogged ? 'Perfil' : 'Login';

  $scope.$on('$ionicView.loaded', function () {
    if($scope.isLogged){
      $scope.getCurrentUserData();
    }
  });

  $scope.doLoginGoogle = function(){
  	var provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
    	.then(function(response){
    		console.info("SUCCESS GOOGLE+: ", response);
        $scope.checkForProviderData();
	      $timeout(function(){
            $scope.afterLoginSuccess();
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
        if(success){
          if(firebase.auth().currentUser.emailVerified){
            $scope.afterLoginSuccess();
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
    });

    console.log('Doing login', $scope.loginData);
  };

  $scope.checkForProviderData = function(){
    var user = firebase.auth().currentUser;
    var newDisplayName = "";
    var newImageURL = "";
    for (var i = 0; i < user.providerData.length; i++) {
      if(user.displayName == null && user.providerData[i].displayName != null){
        newDisplayName = user.providerData[i].displayName;
      }
      if(user.photoURL == null && user.providerData[i].photoURL != null){
        newImageURL = user.providerData[i].photoURL;
      }
    };

    if(newDisplayName != "" && newImageURL != ""){
      user.updateProfile({
        displayName: newDisplayName,
        photoURL: newImageURL
      }).then(function() {
        // Update successful.
        console.log("Name Updated");
      }, function(error) {
        // An error happened.
        console.log("Name ERROR: " + error);
      });
    }

  }

  $scope.afterLoginSuccess = function(){
    $scope.checkIfUserExists();
  }

  $scope.userExistsCallback = function(exists) {
    if (!exists) {
      console.log("Create Firebase Profile");
      $scope.createUserData();
    }else{
      console.log("Get User Data");
      $scope.getCurrentUserData();
    }
  }

  $scope.checkIfUserExists = function(){
    var user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid).once('value', function(snapshot) {
      var exists = (snapshot.val() != null);
      console.log(exists);
      $scope.userExistsCallback(exists);
    });
  }

  $scope.getCurrentUserData = function(){
    var user = firebase.auth().currentUser;
    firebase.database().ref('users/' + user.uid).once('value', function(snapshot) {
      var exists = (snapshot.val() != null);
      console.info("User Snapshot: " , snapshot.val());
      $scope.userData = snapshot.val();
      UsuarioDesafios.login($scope.userData);

      $timeout(function(){
        $scope.isLogged = true;
        $scope.modalState = 'Perfil';
        console.log($scope.userData);
      },100);
    });
  };

  $scope.createUserData = function(){
    var user = firebase.auth().currentUser;
    var resData = {
      uid: user.uid,
      username: user.displayName,
      email: user.email,
      credits: 1000,
      profile_picture : user.photoURL
    };

    firebase.database().ref('users/' + user.uid).set(resData);

    $scope.userData = resData;
    UsuarioDesafios.login($scope.userData);

    $timeout(function(){
      $scope.isLogged = true;
      $scope.modalState = 'Perfil';
      console.log($scope.userData);
    },100);
  }

  $scope.doRegister = function(){
      console.info("REGISTER DATA", $scope.registerData);
      firebase.auth().createUserWithEmailAndPassword($scope.registerData.usermail, $scope.registerData.password)
      .then(function(respuesta) {
        console.info("Success Register",respuesta);
        console.info("Usuario Actual", firebase.auth().currentUser);
        firebase.auth().currentUser.updateProfile({
          displayName: $scope.registerData.userName
        }).then(function() {
          // Update successful.
          console.log("Name Updated");
        }, function(error) {
          // An error happened.
          console.log("Name ERROR: " + error);
        });
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
    