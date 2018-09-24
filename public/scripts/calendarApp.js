$(function () {
  $('input').datetimepicker();
  $('#submit').on('click', function () {
    var number_of_options = $('input').length;
    var event_options = { };
    for (var i = 1; i <= number_of_options; i += 1) {
      var option_val = $(`#input_option_${i}`).val();
      event_options[`option_${i}`] = option_val;
    }
    Cookies.set('event_options', event_options);
    window.location.href = '/create/initiator';
  });
  $('#add_option').on('click', function () {
    var $input_fields_container = $('#input_fields_container');
    var option_number = $('input').length + 1;
    var $inputHolder = $('<div>')
    var $label = $(`<label for="input_option_${option_number}">Date & Time Option ${option_number}</label>`)
    var $input = $(`<input class="form-control form-control-m" type="text" id="input_option_${option_number}" name="option_${option_number}" autocomplete="off"><br>`);
    $label.appendTo($inputHolder);
    $input.appendTo($inputHolder);
    $inputHolder.appendTo($input_fields_container);
    $(`#input_option_${option_number}`).datetimepicker();
  });
  $('#remove_option').on('click', function () {
    // remove <br>, <input> and <label>
    $('#input_fields_container').children().last().remove();

  });
});
