////////////////////////////////////////////////////////////////////
//        IMPORTANTE:                                             // 
//    ESTADOS DE DESAFIOS:                                        //
//            _Available = Recien Creado (Disponible)             // 
//            _Accepted = Aceptado                                //
//            _Checking = Pendiente a revision por Administrador  //
//            _Finished = Terminado                               //
////////////////////////////////////////////////////////////////////

angular.module('app.controllers')
   
.controller('perfilLoginRegisterCtrl', ['$scope', '$stateParams', '$timeout','$ionicPopup', 'UsuarioDesafios','SrvFirebase','CreditosSrv','$cordovaBarcodeScanner', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams, $timeout,$ionicPopup, UsuarioDesafios,SrvFirebase,CreditosSrv,$cordovaBarcodeScanner) {

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
    // FCMPlugin.getToken(
    //   function(token){
    //     console.log("TOKEN: " + token);
    //      var alertPopup = $ionicPopup.alert({
    //        title: 'Token de FCM',
    //        template: 'Token: ' + token
    //      });
    //   },
    //   function(err){
    //     console.log('error retrieving token: ' + err);
    //   }
    // )
    $scope.checkIfUserExists();
  }

  $scope.userExistsCallback = function(exists) {
    if (!exists) {
      console.log("Create Firebase Profile");
      $scope.createUserData(true);
    }else{
      console.log("Get User Data");
      $scope.getCurrentUserData();
    }
  }

  $scope.checkIfUserExists = function(){
    var user = firebase.auth().currentUser;
    SrvFirebase.RefUsuarios(user.uid).once('value', function(snapshot) {
      var exists = (snapshot.val() != null);
      console.log(exists);
      $scope.userExistsCallback(exists);
    });
  }

  $scope.getCurrentUserData = function(){
    var user = firebase.auth().currentUser;
    SrvFirebase.RefUsuarios(user.uid).once('value', function(snapshot) {
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

  $scope.createUserData = function(loginAfterCreate){
    var user = firebase.auth().currentUser;
    var resData = {
      uid: user.uid,
      username: user.displayName,
      email: user.email,
      credits: 1000,
      esAdmin: "NO",
      profile_picture : user.photoURL
    };

    SrvFirebase.RefUsuarios(user.uid).set(resData);

    $scope.userData = resData;
    UsuarioDesafios.login($scope.userData);


    if(loginAfterCreate){
      $timeout(function(){
        $scope.isLogged = true;
        $scope.modalState = 'Perfil';
        console.log($scope.userData);
      },100);
    }
  }

  $scope.createCustomUserData = function(name,mail,uid,photoURL,loginAfterCreate){
    var resData = {
      uid: uid,
      username: name,
      email: mail,
      credits: 1000,
      esAdmin: "NO",
      profile_picture : photoURL
    };

    SrvFirebase.RefUsuarios(uid).set(resData);

    $scope.userData = resData;
    UsuarioDesafios.login($scope.userData);


    if(loginAfterCreate){
      $timeout(function(){
        $scope.isLogged = true;
        $scope.modalState = 'Perfil';
        console.log($scope.userData);
      },100);
    }
  }

  $scope.doRegister = function(){
      console.info("REGISTER DATA", $scope.registerData);
      firebase.auth().createUserWithEmailAndPassword($scope.registerData.usermail, $scope.registerData.password)
      .then(function(respuesta) {
        var user = firebase.auth().currentUser;
        console.info("Success Register",$scope.registerData);
        console.info("Usuario Actual", user);
        // firebase.auth().currentUser.updateProfile({
        //   displayName: $scope.registerData.userName
        // }).then(function() {
        //   // Update successful.
        //   console.info("Name Updated", firebase.auth().currentUser);
        // }, function(error) {
        //   // An error happened.
        //   console.log("Name ERROR: " + error);
        // });

        $scope.createCustomUserData(
          $scope.registerData.username,
          $scope.registerData.usermail,
          user.uid,
          user.photoURL,
          false
        );

        if(!respuesta.emailVerified){
          firebase.auth().currentUser.sendEmailVerification().then(function(){
               var alertPopup = $ionicPopup.alert({
                 title: 'Verificacion de Email',
                 template: 'Se ha enviado un mail para verificar la direccion del usuario'
               });

               alertPopup.then(function(res) {
                 console.log('Alert de Verificacion cerrado');
               });

               $scope.doLogout();
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

  $scope.loginAdmin = function(){
    $scope.loginData.usermail = "marcosmurcia92@gmail.com";
    $scope.loginData.password = "firebase123";
  }

  $scope.loginJugadorUno = function(){
    $scope.loginData.usermail = "juan_banana96@hotmail.com";
    $scope.loginData.password = "firebase123";
  }

  $scope.loginJugadorDos = function(){
    $scope.loginData.usermail = "mark_facu@hotmail.com";
    $scope.loginData.password = "firebase123";
  }

  $scope.cargarCreditos = function(){
    $cordovaBarcodeScanner
          .scan()
          .then(function(barcodeData) {
            // Success! Barcode data is here
            console.info("CORRECTO",barcodeData);
            // var alertPopup = $ionicPopup.alert({
            //    title: 'Correcto',
            //    template: barcodeData.text
            //  });
            if(barcodeData.text == "cargar_creditos_300"){
              CreditosSrv.GanarCreditos(UsuarioDesafios.getShowData(),300);
              var alertPopup = $ionicPopup.alert({
               title: 'Correcto',
               template: "SE CARGARAN 300 CREDITOS A TU CUENTA"
             });
              $scope.getCurrentUserData();
            }

             // alertPopup.then(function(res) {
             //   console.log('Correcto cerrado');
             // });
          }, function(error) {
            // An error occurred
            var alertPopup = $ionicPopup.alert({
               title: 'Error',
               template: error
             });

             alertPopup.then(function(res) {
               console.log('Error cerrado');
             });
          });
  };

}]);
    