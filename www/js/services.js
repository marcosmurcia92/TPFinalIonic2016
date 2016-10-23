angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory('UsuarioDesafios', [function(){
	var userName = '';
	var userMail = '';
	var userUUID = '';
	var userCredits = 0;
	var userPhoto = '';

	return{
		login:function(user){
			userName = user.username;
			userMail = user.email;
			userUUID = user.uid;
			userCredits = user.credits;
			userPhoto = user.profile_picture;
		},
		getName:function(){
			return userName;
		},
		getCredits:function(){
			return userCredits;
		},
		getMail:function(){
			return userMail;
		},
		getUUID:function(){
			return userUUID;
		},
		getPhoto:function(){
			return userPhoto;
		}
	};
}])

.service('BlankService', [function(){

}]);