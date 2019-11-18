// Displays an error message if any fields are empty. Sends
// a POST request to the server using AJAX to change the pwd.
const handleChangePassword = e => {
  e.preventDefault();

  if (
    $("#currentPassword").val() == "" ||
    $("#newPassword1").val() == "" ||
    $("#newPassword2").val() == ""
  ) {
    handleError("All fields are required");
    $("#toastMessage").css("border-top", `5px solid #d5300d`);
    $("#errorMessage").css("color", `#d5300d`);
    return false;
  }

  sendAjax(
    "POST",
    $("#changePasswordForm").attr("action"),
    $("#changePasswordForm").serialize(),
    function() {
      handleError("Password changed successfully");
      $("#toastMessage").css("border-top", `5px solid #358c02`);
      $("#errorMessage").css("color", `#358c02`);
      $("#currentPassword").val("");
      $("#newPassword1").val("");
      $("#newPassword2").val("");
    }
  );

  return false;
};

// Contains the form to change the password on the settings page.
const ChangePassword = props => {
  return (
    <div>
      <h2 className="pageTitle">Settings</h2>
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
          <input
            className="changePasswordSubmit"
            type="submit"
            value="Change"
          />
        </form>
      </div>
    </div>
  );
};
