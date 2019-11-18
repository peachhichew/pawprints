// Check if the fields are empty and then redirect the user
// to the feed page upon success
const handleLogin = e => {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("Username or password is empty");
    $("#toastMessage").css("border-top", `5px solid #d5300d`);
    $("#errorMessage").css("color", `#d5300d`);
    return false;
  }

  console.log($("input[name=_csrf]").val());

  sendAjax(
    "POST",
    $("#loginForm").attr("action"),
    $("#loginForm").serialize(),
    redirect
  );

  return false;
};

// Validate the form data and redirect the user to the /feed page
// upon successful account creation
const handleSignup = e => {
  e.preventDefault();

  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if (
    $("#user").val() == "" ||
    $("#pass").val() == "" ||
    $("#pass2").val() == ""
  ) {
    handleError("All fields are required");
    $("#toastMessage").css("border-top", `5px solid #d5300d`);
    $("#errorMessage").css("color", `#d5300d`);
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
    $("#toastMessage").css("border-top", `5px solid #d5300d`);
    $("#errorMessage").css("color", `#d5300d`);
    return false;
  }

  sendAjax(
    "POST",
    $("#signupForm").attr("action"),
    $("#signupForm").serialize(),
    redirect
  );
  return false;
};

// Renders the component that contains the form for logging in
const LoginWindow = props => {
  return (
    <div>
      <div className="slogan">
        <h1>
          P<i className="fa fa-paw" aria-hidden="true" />wprints
        </h1>
        <p>The social media platform for animals.</p>
      </div>
      <form
        id="loginForm"
        name="loginForm"
        onSubmit={handleLogin}
        action="/login"
        method="POST"
        className="mainForm"
      >
        <input id="user" type="text" name="username" placeholder="username" />
        <input id="pass" type="password" name="pass" placeholder="password" />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="sign in" />
      </form>
    </div>
  );
};

// Renders the component for signing up
const SignupWindow = props => {
  return (
    <div>
      <div className="slogan">
        <h1>
          P<i className="fa fa-paw" aria-hidden="true" />wprints
        </h1>
        <p>The social media platform for animals.</p>
      </div>
      <form
        id="signupForm"
        name="signupForm"
        onSubmit={handleSignup}
        action="/signup"
        method="POST"
        className="mainForm"
      >
        <input id="user" type="text" name="username" placeholder="username" />
        <input id="pass" type="password" name="pass" placeholder="password" />
        <input
          id="pass2"
          type="password"
          name="pass2"
          placeholder="retype password"
        />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="formSubmit" type="submit" value="sign up" />
      </form>
    </div>
  );
};

// Renders LoginWindow component to the screen
const CreateLoginWindow = csrf => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Renders the SignupWindow to the screen
const CreateSignupWindow = csrf => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

// Renders the appropriate component based on which button
// has been clicked
const setup = csrf => {
  const loginButton = document.querySelector("#loginButton");
  const signupButton = document.querySelector("#signupButton");

  signupButton.addEventListener("click", e => {
    e.preventDefault();
    CreateSignupWindow(csrf);
    return false;
  });

  loginButton.addEventListener("click", e => {
    e.preventDefault();
    CreateLoginWindow(csrf);
    return false;
  });

  CreateLoginWindow(csrf); // default view
};

// Uses AJAX to send a GET request for retrieving the csrf token
const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
  $("#bg").css("background-image", `url(${changeBackground()})`);
});
