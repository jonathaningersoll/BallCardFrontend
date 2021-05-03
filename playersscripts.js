const baseUrl = "http://localhost:2200/api/players";

// Add team screen:
const addPlayerCode = `
     <h2>Add new player:</h2>
     <hr />
     <form action="player.html" method="post" onsubmit="postPlayer(event)">
          
          <p>
               <label for="firstname">First Name: </label>
               <input type="text" name="firstname" id="firstname" />
          </p>
          <p>
               <label for="lastname">Last Name: </label>
               <input type="text" name="lastname" id="lastname" />
          </p>
          <p>
               <label for="rookieyear">Rookie Year: <label>
               <input type="text" name="rookieyear" id="rookieyear" />
          </p>
          <p>
               <input class="btn btn-primary" type="submit" value="Create" />
          </p>
     </form>
`;

let screen = document.getElementById('screen');

function viewPlayers(json){
     // SET UP
     var players = json;
     let screen = document.getElementById('screen');
     clearOldData(screen);

     // PERFORM
     screen.innerHTML += `
          <h2>Current Players:</h2><hr/><br>
          <table id="playertable">
               <tr>
                    <th>
                         Player:
                    </th>
                    <th>
                         Options:
                    </th>
               </tr>
     `;

     players.forEach( item => {
          let playerTable = document.getElementById('playertable');
          let tableRow = document.createElement('tr');
          let tableDataPlayerName = document.createElement('td');
          let tableDataOptions = document.createElement('td');
          console.log(item);
          tableDataPlayerName.innerHTML = item.firstName + " " + item.lastName;
          tableDataOptions.innerHTML = `
               <button id="view" class="btn btn-info" onclick="playerDetail(${item.playerId})">View</a>
               `;

          playerTable.appendChild(tableRow);
          tableRow.appendChild(tableDataPlayerName);
          tableRow.appendChild(tableDataOptions);
     });

     turnOnDiv();
}

function turnOnDiv(){
     screen.style.display = "none" ? screen.style.display = "block" : console.log("screen is fine");
}

function clearOldData(screen){
     while(screen.firstChild){
          screen.removeChild(screen.firstChild);
     }
}

function addPlayer(){
     clearOldData(screen);
     screen.innerHTML += addPlayerCode;
     turnOnDiv();
}

function PostPlayerSuccess(info){
     document.getElementById('screen').innerHTML = addPlayerCode + `
          <h3>Successfully created new Player</h3>
          <p>
               <strong>Player:</strong>
               ${info.firstName + " " + info.lastName}
               <br />
               <strong>Rookie Year:</strong>
               ${info.rookieYear}
          </p>
     `
}

function viewPlayerDetail(data){
     screen.innerHTML += `
          <h2>${data.firstName + " " + data.lastName}</h2>
          <hr/>
          <p>
               <strong>Rookie year:</strong> ${data.rookieYear}
          </p>
          <hr />
          <form action="players.html" method="put" onsubmit="editPlayer(${data.playerId})">
               <p>
                    <label for="firstname">Edit player first name:</label>
                    <input type="text" name="firstname" id="firstname" />
               </p>
               <p>
                    <label for="lastname">Edit player last name:</label>
                    <input type="text" name="lastname" id="lastname" />
               </p>
               <p>
                    <label for="playerrookieyear">Edit rookie year:</label>
                    <input type="text" name="playerrookieyear" id="playerrookieyear" />
               </p>
               <p>
                    <input type="submit" class="btn btn-warning" value="Edit" />
               </p>
          </form>
          <button id="delete" class="btn btn-danger" onclick="deletePlayerWarning(${data.playerId})">Delete</button>
     `;
}

function deletePlayerWarning(id){
     screen.innerHTML += `
          <div class="alert alert-danger" role="alert">
               <p>
                    Are you sure you want to delete this player?
               </p>
               <button id="delete" class="btn btn-danger" onclick="deletePlayer(${id})">Delete</button>
               <button id="back" class="btn btn-success" onclick="fetchResults()">Go back</button>
          </div>
     `;
}

function deletePlayerSuccess(){
     screen.innerHTML = `
          <div class="alert alert-danger" role="alert">
               <p>
                    Successfully removed player
               </p>
               <button id="ok" class="btn btn-success" onclick="fetchResults()">OK</button>
          </div>
     `
}



// API CALLS

// CREATE TEAM
function postPlayer(event){
     event.preventDefault();
     let player = {
          'firstName':`${document.getElementById('firstname').value}`,
          'lastName':`${document.getElementById('lastname').value}`,
          'rookieYear':`${document.getElementById('rookieyear').value}`
     }

     fetch(baseUrl, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(player)
     })
     .then(res => res.json()
     )
     .then(data => PostPlayerSuccess(data))
}

// GET ALL TEAMS
function fetchResults(){
     fetch(baseUrl)
     .then(function(result){
          return result.json();
     })
     .then(function(json){
          viewPlayers(json);
     });
}

// UPDATE TEAM
function editPlayer(id){
     let player = {
          'playerId':id,
          'firstName':`${document.getElementById('firstname').value}`,
          'lastName':`${document.getElementById('lastname').value}`,
          'rookieYear':`${document.getElementById('playerrookieyear').value}`
     }

     fetch(`${baseUrl}/${id}`, {
          method: 'PUT',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(player)
     })
     .then(res => res.json())
     .then(data => {console.log(data)
          fetchResults()});

}

// GET ONE TEAM
function playerDetail(id){
     clearOldData(document.getElementById('screen'));
     
     fetch(`${baseUrl}/${id}`)
     .then(res => res.json())
     .then(data => viewPlayerDetail(data));
}

// DELETE TEAM
function deletePlayer(id){
     fetch(`${baseUrl}/${id}`, {
          method: 'DELETE',
          headers: {
               'content-Type': 'application/json'
          },
          body: JSON.stringify(id)
     })
     .then(deletePlayerSuccess());
}