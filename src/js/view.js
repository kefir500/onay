var View = (function () {

  var view = {
    addCard: function (pan, owner) {
      document.getElementById('help').style.display = 'none';
      var table = document.getElementById('cards');
      var row = table.insertRow(table.rows.length);
      row.className = 'card';
      row.setAttribute('draggable', 'true');
      row.setAttribute('data-card-pan', pan);
      row.addEventListener('dragstart', dragStart, false);
      row.addEventListener('dragenter', dragEnter, false);
      row.addEventListener('dragover', dragOver, false);
      row.addEventListener('dragend', dragEnd, false);
      row.addEventListener('drop', dragDrop, false);
      var cell1 = row.insertCell(0);
      var cell2 = row.insertCell(1);
      cell1.innerHTML = '<h2>' + owner + '</h2><h2 class="muted">' + pan + '</h2>';
      cell2.innerHTML = '<h1 class="card-balance">0</h1>';
      var btnDelete = document.createElement('a');
      btnDelete.innerHTML = 'Удалить';
      btnDelete.className = 'btn-delete';
      btnDelete.setAttribute('href', '#');
      btnDelete.addEventListener('click', function () {
        row.remove();
        view.onRemove(pan);
      }, false);
      cell1.appendChild(btnDelete);
    },

    setCardBalance: function (pan, balance) {
      var field = document.querySelectorAll('[data-card-pan="' + pan + '"] .card-balance')[0];
      if (field) {
        field.className = 'card-balance';
        field.innerHTML = balance;
        return true;
      } else {
        return false;
      }
    },

    setCardError: function (pan) {
      var field = document.querySelectorAll('[data-card-pan="' + pan + '"] .card-balance')[0];
      if (field) {
        field.className = 'card-balance error';
        return true;
      } else {
        return false;
      }
    },

    setCardLoading: function (pan) {
      var field = document.querySelectorAll('[data-card-pan="' + pan + '"] .card-balance')[0];
      if (field) {
        field.innerHTML = '<div class="loading"></div>';
        return true;
      } else {
        return false;
      }
    },

    setStatus: function (message) {
      if (message) {
        document.getElementById('status').style.display = 'block';
        document.getElementById('status-text').style.display = 'block';
        document.getElementById('status-text').innerHTML = message;
      } else {
        document.getElementById('status-text').style.display = 'none';
        document.getElementById('status-text').innerHTML = message;
      }
    },

    setLastUpdate: function (datetime) {
      document.getElementById('status-date').innerHTML = 'Последняя синхронизация: <b>' + datetime.date + ' &ndash; ' + datetime.time + '</b>';
      if (document.getElementsByClassName('card').length > 0) {
        document.getElementById('status').style.display = 'block';
      } else {
        document.getElementById('status').style.display = 'none';
      }
    },

    showMainPage: function () {
      document.getElementById('page-add').style.display = 'none';
      document.getElementById('page-main').style.display = 'block';
      document.getElementById('input-card-number').value = '';
      document.getElementById('input-card-owner').value = '';
    },

    showAddPage: function () {
      document.getElementById('page-main').style.display = 'none';
      document.getElementById('page-add').style.display = 'block';
    },

    onAdd: function (pan, owner) {
      // Fired when "Add" button is clicked.
    },

    onRemove: function (pan) {
      // Fired when "Remove" button is clicked.
    },

    onSwap: function (pan1, pan2) {
      // Fired when two cards are swapped.
    }
  };

  // Buttons:

  document.getElementById('btn-add').addEventListener('click', function () {
    var pan = document.getElementById('input-card-number').value;
    var owner = document.getElementById('input-card-owner').value;
    view.onAdd(pan, owner);
  }, false);

  document.getElementById('btn-page-main').addEventListener('click', function () {
    view.showMainPage();
  }, false);

  document.getElementById('btn-page-add').addEventListener('click', function () {
    view.showAddPage();
  }, false);

  // Drag and Drop:

  var dragElement;
  var dropElement;

  function dragStart(event) {
    this.classList.add('drag');
    event.dataTransfer.effectAllowed = 'move';
    dragElement = this;
  }

  function dragEnter(event) {
    if (dropElement) {
      dropElement.classList.remove('drop');
    }
    dropElement = this;
    this.classList.add('drop');
  }

  function dragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }

  function dragEnd(event) {
    this.classList.remove('drag');
    dropElement.classList.remove('drop');
  }

  function dragDrop(event) {
    event.stopPropagation();
    if (dragElement !== dropElement) {
      var temp = document.createElement('tr');
      dragElement.parentNode.insertBefore(temp, dragElement);
      dropElement.parentNode.insertBefore(dragElement, dropElement);
      temp.parentNode.insertBefore(dropElement, temp);
      temp.parentNode.removeChild(temp);
      var dragPan = dragElement.getAttribute('data-card-pan');
      var dropPan = this.getAttribute('data-card-pan');
      view.onSwap(dragPan, dropPan);
    }
  }

  return view;

}());
