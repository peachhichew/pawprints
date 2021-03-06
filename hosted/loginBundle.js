"use strict";

// Check if the fields are empty and then redirect the user
// to the feed page upon success
var handleLogin = function handleLogin(e) {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("Username or password is empty");
    $("#toastMessage").css("border-top", "5px solid #d5300d");
    $("#errorMessage").css("color", "#d5300d");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

// Validate the form data and redirect the user to the /feed page
// upon successful account creation
var handleSignup = function handleSignup(e) {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == "") {
    handleError("All fields are required");
    $("#toastMessage").css("border-top", "5px solid #d5300d");
    $("#errorMessage").css("color", "#d5300d");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    $("#toastMessage").css("border-top", "5px solid #d5300d");
    $("#errorMessage").css("color", "#d5300d");
    return false;
  }

  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

// Renders the component that contains the form for logging in
var LoginWindow = function LoginWindow(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "slogan" },
      React.createElement(
        "h1",
        null,
        "P",
        React.createElement("i", { className: "fa fa-paw", "aria-hidden": "true" }),
        "wprints"
      ),
      React.createElement(
        "p",
        null,
        "The social media platform for animals."
      )
    ),
    React.createElement(
      "form",
      {
        id: "loginForm",
        name: "loginForm",
        onSubmit: handleLogin,
        action: "/login",
        method: "POST",
        className: "mainForm"
      },
      React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "sign in" })
    )
  );
};

// Renders the component for signing up
var SignupWindow = function SignupWindow(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "div",
      { className: "slogan" },
      React.createElement(
        "h1",
        null,
        "P",
        React.createElement("i", { className: "fa fa-paw", "aria-hidden": "true" }),
        "wprints"
      ),
      React.createElement(
        "p",
        null,
        "The social media platform for animals."
      )
    ),
    React.createElement(
      "form",
      {
        id: "signupForm",
        name: "signupForm",
        onSubmit: handleSignup,
        action: "/signup",
        method: "POST",
        className: "mainForm"
      },
      React.createElement("input", { id: "user", type: "text", name: "username", placeholder: "username" }),
      React.createElement("input", { id: "pass", type: "password", name: "pass", placeholder: "password" }),
      React.createElement("input", {
        id: "pass2",
        type: "password",
        name: "pass2",
        placeholder: "retype password"
      }),
      React.createElement("input", { type: "hidden", name: "_csrf", value: props.csrf }),
      React.createElement("input", { className: "formSubmit", type: "submit", value: "sign up" })
    )
  );
};

// Renders LoginWindow component to the screen
var CreateLoginWindow = function CreateLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Renders the SignupWindow to the screen
var CreateSignupWindow = function CreateSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

// Renders the appropriate component based on which button
// has been clicked
var setup = function setup(csrf) {
  var loginButton = document.querySelector("#loginButton");
  var signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", function (e) {
    e.preventDefault();
    CreateSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", function (e) {
    e.preventDefault();
    CreateLoginWindow(csrf);
    return false;
  });

  CreateLoginWindow(csrf); // default view
};

// Uses AJAX to send a GET request for retrieving the csrf token
var getToken = function getToken() {
  sendAjax("GET", "/getToken", null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
  $("#bg").css("background-image", "url(" + changeBackground() + ")");
});
"use strict";

// Display a message when an error occurs
var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#toastMessage").animate({ bottom: "toggle" }, 250);
};

// Redirects the page to a different part of the app
var redirect = function redirect(response) {
  $("#toastMessage").animate({ bottom: "hide" }, 250);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};

// Randomly loads a background image from the server
var changeBackground = function changeBackground() {
  var imgs = [];
  imgs[0] = "alexandru-zdrobau-_STvosrG-pw-unsplash.jpg";
  imgs[1] = "clement-falize-b9K_LTz079c-unsplash.jpg";
  imgs[2] = "jf-brou-915UJQaxtrk-unsplash.jpg";
  imgs[3] = "krista-mangulsone-9gz3wfHr65U-unsplash.jpg";
  imgs[4] = "ludemeula-fernandes-9UUoGaaHtNE-unsplash.jpg";
  imgs[5] = "mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg";
  imgs[6] = "ipet-photo-T-0EW-SEbsE-unsplash.jpg";
  imgs[7] = "james-barker-v3-zcCWMjgM-unsplash.jpg";
  imgs[8] = "mark-zamora-Qu-T7JOu-Iw-unsplash.jpg";
  imgs[9] = "cole-keister-cX-KEISwDIw-unsplash.jpg";
  var rand = Math.floor(Math.random() * imgs.length);
  return "./images/" + imgs[rand];
};
