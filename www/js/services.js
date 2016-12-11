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
	this.RefDesafios = RefDesafios;
	this.EnviarNotificacion = EnviarNotificacion;

	function ObtenerRef(coleccion){
		return firebase.database().ref(coleccion);
	}

	function RefUsuarios(child){
		if(child){
			return ObtenerRef('users/'+child);
		}else{
			return ObtenerRef('users/');
		}
	}

	function RefDesafios(child){
		if(child){
			return ObtenerRef('desafios/'+child);
		}else{
			return ObtenerRef('desafios/');
		}
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

.service('CreditosSrv', ['$ionicPopup','SrvFirebase',function($ionicPopup,SrvFirebase){
	this.GanarCreditos = function(jugGanador, creditos){

		var intCreditos = parseInt(creditos);

		SrvFirebase.RefUsuarios().child(jugGanador.userUUID).once('value',function(snapshot){

			var newCredits = snapshot.val().credits + intCreditos;

			snapshot.ref.update({
				credits : newCredits
			},function(error){
		      if(error){
		      	console.info("ERROR: ", error);
		      }
		    });
		});
	};

	this.GastarCreditos = function(jugador, creditos){

		var intCreditos = parseInt(creditos);

		SrvFirebase.RefUsuarios().child(jugador.userUUID).once('value',function(snapshot){

			var newCredits = snapshot.val().credits - intCreditos;

			snapshot.ref.update({
				credits : newCredits
			},function(error){
		      if(error){
		      	console.info("ERROR: ", error);
		      }
		    });
		});
	}
}])

.service('BlankService', [function(){

}]);