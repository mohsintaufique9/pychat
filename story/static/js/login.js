onDocLoad(function(){
	hideElement($("hideableDropDown"));
	hideElement($('inputName'));
});


controllers.LoginController = function ($scope, $rootScope) {
	function login() {
		var message = {
			username: document.getElementById("username").value,
			password: document.getElementById("password").value,
			action: "login"
		};
		sendToServer(message);
		ws.send(credentials);
	}
};

onDocLoad(function () {

	document.addEventListener("click", function () {
		hideElement($("hideableDropDown"));
	});

	//Handles menu drop down
	var loginForm = $('hideableDropDown');
	loginForm.onclick = function (e) {
		e.stopPropagation(); // don't fire parent event when clicking on loginForm
	};

	// login by enter
	loginForm.onkeypress = function (event) {
		if (event.keyCode === 13) {
			login();
		}
	};

	var editUserName = function (label) {
		hideElement(label);
		var oldUsername = label.textContent;
		var input = $('inputName');
		input.focus();
		showElement(input);
		var sendChangeNickname = function (event) {
			var newUsername = input.value;
			hideElement(input);
			showElement(label);
			if (!USER_REGEX.test(newUsername)) {
				alert('Wrong username, only letters, -_');
				label.textContent = oldUsername;
			} else  if (newUsername !== oldUsername) {
				sendToServer({content: newUsername, action: 'me'});
			}
		};
		input.onblur = sendChangeNickname;
		input.onkeypress = function (e) {
			if (e.which == 13) {
				sendChangeNickname();
			}
		};
	};

	$("userNameLabel").onclick = function () {
		editUserName(this);
	};

});
