const handleError = message => {
  $("#errorMessage").text(message);
  // $("#toastMessage").animate({ width: "toggle" }, 350);
  $("#toastMessage").animate({ bottom: "toggle" }, 250);
};

const redirect = response => {
  // $("#toastMessage").animate({ width: "hide" }, 350);
  $("#toastMessage").animate({ bottom: "hide" }, 250);
  window.location = response.redirect;
};

const sendAjax = (type, action, data, success) => {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function(xhr, status, error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
