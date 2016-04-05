document.getElementById('btn-add').addEventListener('click', function() {
  var number = document.getElementById('input-card-number').value;
  var owner = document.getElementById('input-card-owner').value;
  if (number && owner) {
    add_card(number, owner);
    window.location.href = 'popup.html';
  }
}, false);