$(function () {
  var event_id = $('section').data("event_id");
  var event_options;

  function drawVote(email, username, optionid) {
    var hash = md5(email);
          $(`<img id=${email} class="weWantTheAvatarRounded" src="https://vanillicon.com/${hash}_50.png" title="${username} (${email})" alt="${username} (${email})">`)
          .appendTo($(`#${optionid}-list`))
  }

  function removeDrawnVote(username, email) {
    $(`img[title="${username} (${email})"]`).remove()
  }

  function getVotesForOptions(eventOptionsArray) {
    eventOptionsArray.forEach(function (option) {
      $.ajax({
        method: "GET",
        url: `/api/events/${option.id}/participants/`
      }).done(function (participantsArray) {
        participantsArray.forEach(function (participant) {
          drawVote(participant.email, participant.username, option.id)
        });
      });
    });
  }

  $.ajax({
    method: "GET",
    url: `/api/events/pollOptions/${event_id}`
  }).then(function (eventOptionsArray) {
    eventOptionsArray.forEach(function (eventOption) {
      $(`<div class="custom-control custom-radio" id="${eventOption.id}-list"></div>`).prependTo("section");
      $(`<br><input class="fa fa-circle-o fa-2x" type="radio" id="${eventOption.id}"  name="event_option" value="${eventOption.id}">${eventOption.option_text}<br>`).prependTo($(`#${eventOption.id}-list`));
    });
    event_options = eventOptionsArray;
    return eventOptionsArray;
  }).then(function(eventOptionsArray) {
    getVotesForOptions(eventOptionsArray)
  });



  $("#voteButton").on("click", function (event) {
    event.preventDefault();
    var username = $("#organizer_name").val();
    var email = $("#organizer_email").val();
    var option = $('input[name="event_option"]:checked').val();
    var super_secret_URL = $('header').data("super_secret_url");
    $.ajax({
      method: "POST",
      url: "/vote",
      data: {
        username,
        email,
        event_id,
        option,
        super_secret_URL
      },
      success: function () {
        removeDrawnVote(username, email)
        drawVote(email, username, option)
      }
    });
  });
  $('#baseURL').text(document.location.protocol + '//' + document.location.hostname + ((document.location.port) ? (':' + document.location.port) : '') + ((document.location.pathname === '/poll') ? document.location.pathname : '') + '/')
});
