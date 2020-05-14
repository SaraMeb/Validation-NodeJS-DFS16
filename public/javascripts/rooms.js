// Delete flipbook

var deleteButtons = document.querySelectorAll(".deleteRoom");
for (var i = 0; i < deleteButtons.length; i++) {
  deleteButtons[i].addEventListener('click', function (event) {
    event.preventDefault();
      console.log(event.currentTarget);
    var roomId = event.currentTarget.getAttribute('id');
    console.log(roomId);
    fetch('/rooms/' + roomId, {
        method: 'delete',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(function (r) {
        return r.json()
    })
    .then(function (response) {
        if (response.status) {
            document.location.reload();
        } else {
            alert(response.message || 'Erreur');
        }
    })
  });
}

// Update flipbook modal

var updateButtons = document.querySelectorAll(".updateRoom");
for (var i = 0; i < updateButtons.length; i++) {
  updateButtons[i].addEventListener('click', function (event) {
    event.preventDefault();
      console.log(event.currentTarget);
      // debugger;
    var roomId = event.currentTarget.getAttribute('id');
    console.log(roomId);
    // debugger;
    fetch('/rooms/' + roomId, {
        method: 'get',
        headers: {
            'Accept': 'application/json'
        }
    })
    .then(function (r) {
      console.log(r);
        return r.json()
    })
    .then(function (response) {
        if (response.status) {
          console.log(response.result);
          document.getElementById('updatedRoomID').value = response.result._id;
          document.getElementById('updatedName').value = response.result.name;
        } else {
            alert(response.message || 'Erreur');
        }
    })
  });
}

// Update room
document.getElementById('editRoom').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log(event.target);
    var roomId = event.target.id.value;
    var name = event.target.name.value;
    var status = event.target.status.value;
    var users = event.target.users.value;

    var datas = {
        'name': name,
        'status': status,
        'users': users
    };
    fetch('/rooms/' + roomId, {
        method: 'put',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name:name,
          status:status,
          users:users

        })
    })
        .then(function (r) { return r.json() })
        .then(function (response) {
            if (response.status) {
                document.location.reload();
            } else {
                alert(response.message || 'Erreur');
            }
        })
});
