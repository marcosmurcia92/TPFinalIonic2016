angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.factory('UsuarioDesafios', [function(){
	var userName = '';
	var userMail = '';
	var userPass = '';
	var userUUID = '';
	var userCredits = 0;

	return{
		login:function(user){
			userName = user.username;
			userMail = user.usermail;
			userUUID = user.uuid;
			userCredits = user.credits;
		},
		getName:function(){
			return userName;
		},
		getCredits:function(){
			return userCredits;
		},
		getUUID:function(){
			return userUUID;
		}
	};
}])

.service('BlankService', [function(){

}]);