// Display a message when an error occurs
const handleError = message => {
  $("#errorMessage").text(message);
  $("#toastMessage").animate({ bottom: "toggle" }, 250);
};

// Redirects the page to a different part of the app
const redirect = response => {
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

// Randomly loads a background image from the server
const changeBackground = () => {
  let imgs = [];
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
  let rand = Math.floor(Math.random() * imgs.length);
  return `./images/${imgs[rand]}`;
};
