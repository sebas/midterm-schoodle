$(() => {
  var event_id = $('section').data("event_id")
  $.ajax({
    method: "GET",
    url: `/api/events/pollOptions/${event_id}`
  }).done((eventOptionsArray) => {
    console.log(eventOptionsArray)
    eventOptionsArray.forEach( eventOption => {
      $(`<input type="radio" id="${eventOption.id}" name="event_option" value="${eventOption.id}">${eventOption.option_text}<br>`).prependTo($("#voteForm"));
    }) 
  });
  $("#voteButton").on("click",function(event){
    event.preventDefault();
    var username = $("#organizer_name").html();
    var email = $("#organizer_email").html();
    var event_option_id = $('input[name="event_option"]:checked').val();
    var super_secret_URL = $('header').data("super_secret_url");
    console.log("event_option_id",event_option_id);
    $.ajax({
      method: "POST",
      url: "/vote",
      data: {
        username,
        email,
        event_id,
        event_option_id,
        super_secret_URL
      }
    })
  })

});
