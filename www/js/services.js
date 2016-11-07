angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory('UsuarioDesafios', [function(){
	var userName = '';
	var userMail = '';
	var userUUID = '';
	var userCredits = 0;
	var userPhoto = '';
	var isUserAdmin = false;

	return{
		login:function(user){
			userName = user.username;
			userMail = user.email;
			userUUID = user.uid;
			userCredits = user.credits;
			userPhoto = user.profile_picture;
			isUserAdmin = (user.esAdmin == "SI");
		},
		getName:function(){
			return userName;
		},
		getCredits:function(){
			return (userCredits > 100 ? 100 : userCredits);
		},
		getMail:function(){
			return userMail;
		},
		getUUID:function(){
			return userUUID;
		},
		getPhoto:function(){
			return userPhoto;
		},
		isAdmin:function(){
			return isUserAdmin;
		},
		getShowData:function(){
			var jsonUsuario = {};
			jsonUsuario.userName = userName;
			jsonUsuario.userMail = userMail;
			jsonUsuario.userUUID = userUUID;
			jsonUsuario.userCredits = userCredits;
			return jsonUsuario;
		}
	};
}])

.service('CreditosSrv', [function($ionicPopup){
	this.GanarCreditos = function(jugGanador, creditos){

		firebase.database().ref('users/' + jugGanador.userUUID).update({
			credits : (parseInt(jugGanador.userCredits) + parseInt(creditos))
		},function(error){
	      if(error){
	      	console.info("ERROR: ", error);
	      }
	    });
	};

	this.GastarCreditos = function(jugador, creditos){
		firebase.database().ref('users/' + jugador.userUUID).update({
			credits : (parseInt(jugador.userCredits) - parseInt(creditos))
		},function(error){
	      if(error){
	      	console.info("ERROR: ", error);
	      }
	    });
	}
}])

.service('BlankService', [function(){

}]);