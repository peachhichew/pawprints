const handleChangePassword = e => {
  console.log("change password");
  e.preventDefault();

  console.log("current pwd:", $("#currentPassword").val());
  console.log("new pwd:", $("#newPassword1").val());
  console.log("new pwd 2:", $("#newPassword1").val());
  if (
    $("#currentPassword").val() == "" ||
    $("#newPassword1").val() == "" ||
    $("#newPassword2").val() == ""
  ) {
    handleError("All fields are required");
    return false;
  }

  sendAjax(
    "POST",
    $("#changePasswordForm").attr("action"),
    $("#changePasswordForm").serialize(),
    function() {
      console.log("meow");
    }
  );

  return false;
};

const ChangePassword = props => {
  return (
    <div className="changePassword">
      <h3>Change password</h3>
      <form
        id="changePasswordForm"
        onSubmit={handleChangePassword}
        name="changePasswordForm"
        action="/changePassword"
        method="POST"
        className="changePasswordForm"
      >
        <input
          id="currentPassword"
          type="password"
          name="currentPassword"
          placeholder="current password"
        />
        <input
          id="newPassword1"
          type="password"
          name="newPassword1"
          placeholder="new password"
        />
        <input
          id="newPassword2"
          type="password"
          name="newPassword2"
          placeholder="retype new password"
        />
        <input type="hidden" name="_csrf" value={props.csrf} />
        <input className="changePasswordSubmit" type="submit" value="Change" />
      </form>
    </div>
  );
};

// const setup = function(csrf) {
//   ReactDOM.render(
//     <ChangePassword csrf={csrf} />,
//     document.querySelector("#settings")
//   );
// };

// const getToken = () => {
//   sendAjax("GET", "/getToken", null, result => {
//     setup(result.csrfToken);
//   });
// };

// $(document).ready(function() {
//   getToken();
// });
