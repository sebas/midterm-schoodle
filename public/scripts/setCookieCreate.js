$(function () {
  $('#submit').on('click', function () {
    var event_name = $('#event_input').val();
    var event_location = $('#location_input').val();
    var event_note = $('#note_input').val();
    Cookies.set('event_details', {
      "event_name": event_name,
      "event_location": event_location,
      "event_note": event_note
    });
    window.location.href = '/create/options';
  });
});
