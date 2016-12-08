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

.service('SrvFirebase', ['$http',function($http){

	this.RefUsuarios = RefUsuarios;
	this.RefDenuncias = RefDenuncias;
	this.RefReclamos=RefReclamos;
	this.EnviarNotificacion = EnviarNotificacion;

	function ObtenerRef(coleccion){
		return firebase.database().ref(coleccion);

	}

	function RefUsuarios(){
		return ObtenerRef('users/');
	}

	function RefUsuarios(){
		return ObtenerRef('desafios/');
	}

	function EnviarNotificacion(){
		var http = new XMLHttpRequest();
    	var url =  'https://fcm.googleapis.com/fcm/send';
		
		var params = JSON.stringify({
				    "to":"/topics/all", //Topic or single device
				"notification":{
				    "title":"Murcia Desafios",  //Any value
				    "body":"Hay un nuevo desafío disponible!",  //Any value
				    "sound":"default", //If you want notification sound
				    "click_action":"FCM_PLUGIN_ACTIVITY",  //Must be present for Android
				    "icon":"fcm_push_icon"  //White icon Android resource
				  },
				    "priority":"high" //If not set, notification won't be delivered on completely closed iOS app
			});

		http.open("POST", url, true);
	    http.setRequestHeader("Content-type", "application/json");
	    http.setRequestHeader('Authorization', 'key=AIzaSyD0vioKD62dvw-fk6IaOkUvlBRrffqbRiA');

	    http.onreadystatechange = function() {
	        if(http.readyState == 4 && http.status == 200) {
	            console.log(http.responseText);
	        }
	    }
	    http.send(params);
		}
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