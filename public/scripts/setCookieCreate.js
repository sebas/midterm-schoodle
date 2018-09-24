$(function () {
  $('#submit').on('click', function () {
    var event_name = document.getElementById('event_input').value;
    var event_location = document.getElementById('location_input').value;
    var event_note = document.getElementById('note_input').value;
    Cookies.set('event_details', {
      "event_name": event_name,
      "event_location": event_location,
      "event_note": event_note
    });
    window.location.href = '/create/options';
  });
});
