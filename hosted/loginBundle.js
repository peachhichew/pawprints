"use strict";

var handleLogin = function handleLogin(e) {
  e.preventDefault();

  // $("#toastMessage").animate({ width: "hide" }, 350);
  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("Username or password is empty");
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax("POST", $("#loginForm").attr("action"), $("#loginForm").serialize(), redirect);

  return false;
};

var handleSignup = function handleSignup(e) {
  e.preventDefault();

  // $("#toastMessage").animate({ width: "hide" }, 350);
  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#user").val() == "" || $("#pass").val() == "" || $("#pass2").val() == "") {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    return false;
  }

  sendAjax("POST", $("#signupForm").attr("action"), $("#signupForm").serialize(), redirect);
  return false;
};

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

var CreateLoginWindow = function CreateLoginWindow(csrf) {
  ReactDOM.render(React.createElement(LoginWindow, { csrf: csrf }), document.querySelector("#content"));
};

var CreateSignupWindow = function CreateSignupWindow(csrf) {
  ReactDOM.render(React.createElement(SignupWindow, { csrf: csrf }), document.querySelector("#content"));
};

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

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#toastMessage").animate({ bottom: "toggle" }, 250);
};

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

var changeBackground = function changeBackground() {
  var imgs = [];
  imgs[0] = "alexandru-zdrobau-_STvosrG-pw-unsplash.jpg";
  imgs[1] = "clement-falize-b9K_LTz079c-unsplash.jpg";
  imgs[2] = "jf-brou-915UJQaxtrk-unsplash.jpg";
  imgs[3] = "krista-mangulsone-9gz3wfHr65U-unsplash.jpg";
  imgs[4] = "ludemeula-fernandes-9UUoGaaHtNE-unsplash.jpg";
  imgs[5] = "mikhail-vasilyev-IFxjDdqK_0U-unsplash.jpg";
  var rand = Math.floor(Math.random() * imgs.length);
  return "./images/" + imgs[rand];
};
