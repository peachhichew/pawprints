const handleLogin = e => {
  e.preventDefault();

  // $("#toastMessage").animate({ width: "hide" }, 350);
  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if ($("#user").val() == "" || $("#pass").val() == "") {
    handleError("Username or password is empty");
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

const handleSignup = e => {
  e.preventDefault();

  // $("#toastMessage").animate({ width: "hide" }, 350);
  $("#toastMessage").animate({ bottom: "hide" }, 250);

  if (
    $("#user").val() == "" ||
    $("#pass").val() == "" ||
    $("#pass2").val() == ""
  ) {
    handleError("All fields are required");
    return false;
  }

  if ($("#pass").val() !== $("#pass2").val()) {
    handleError("Passwords do not match");
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

const LoginWindow = props => {
  return (
    <div>
      <div className="slogan">
        <h1>
          P<i className="fa fa-paw" aria-hidden="true"></i>wprints
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

const SignupWindow = props => {
  return (
    <div>
      <div className="slogan">
        <h1>
          P<i className="fa fa-paw" aria-hidden="true"></i>wprints
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

const CreateLoginWindow = csrf => {
  ReactDOM.render(
    <LoginWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

const CreateSignupWindow = csrf => {
  ReactDOM.render(
    <SignupWindow csrf={csrf} />,
    document.querySelector("#content")
  );
};

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

const getToken = () => {
  sendAjax("GET", "/getToken", null, result => {
    setup(result.csrfToken);
  });
};

$(document).ready(function() {
  getToken();
  // $("#bg").css("background-image", `url(${changeBackground()})`);
});
