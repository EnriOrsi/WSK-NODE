$('#password, #confirm_password').on('keyup', function () {
    if ($('#password').val() == $('#confirm_password').val()) {
        $('#Alterar').removeAttr('disabled');
    } else 
        $('#Alterar').prop('disabled', true);
  });