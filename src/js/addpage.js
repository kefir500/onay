function showMainPage() {
  document.getElementById('page-add').style.display = 'none';
  document.getElementById('page-main').style.display = 'block';
}

function showAddPage() {
  document.getElementById('page-main').style.display = 'none';
  document.getElementById('page-add').style.display = 'block';
}

document.getElementById('btn-add').addEventListener('click', function () {
  var number = document.getElementById('input-card-number');
  var owner = document.getElementById('input-card-owner');
  if (number.value && owner.value) {
    addCard(number.value, owner.value);
    showMainPage();
  }
}, false);

document.getElementById('btn-page-add').addEventListener('click', function () {
  showAddPage();
}, false);

document.getElementById('btn-page-main').addEventListener('click', function () {
  showMainPage();
}, false);
