$(function() {
  var event_id = $('section').data("event_id")

  $.ajax({
    method: "GET",
    url: `/api/events/pollOptions/${event_id}`
  }).then(function(eventOptionsArray) {
    eventOptionsArray.forEach( function(eventOption) {
      $(`<div id="${eventOption.id}-list">Voters:</div>`).prependTo("section")
      $(`<input type="radio" id="${eventOption.id}" name="event_option" value="${eventOption.id}">${eventOption.option_text}<br>`).prependTo($(`#${eventOption.id}-list`));
    })
    return eventOptionsArray;
   }).then(function(eventOptionsArray) {
    eventOptionsArray.forEach(function(option){
      $.ajax({
        method: "GET",
        url: `/api/events/${option.id}/participants/`
      }).done(function(participantsArray) {
        participantsArray.forEach( function(participant) {
          $(`<div id="${participant.email}"> ${participant.username} (${participant.email})</div>`).appendTo($(`#${participant.event_option_id}-list`));
        });
      });
    });
  });

  $("#voteButton").on("click", function(event){
    event.preventDefault();
    var username = $("#organizer_name").val();
    var email = $("#organizer_email").val();
    var option = $('input[name="event_option"]:checked').val();
    var super_secret_URL = $('header').data("super_secret_url");
    console.log("option",option);
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
      success: function(response){
        window.location.href = response;
      } 
    });
  })

});
