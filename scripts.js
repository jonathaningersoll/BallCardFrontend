const baseUrl = "http://localhost:29163/api/players";

// Add player screen:
const addPlayerCode = `
     <h2>Add new player:</h2>
     <hr />
     <form action="index.html" method="post" onsubmit="postPlayer(event)">
          <p>
               <label for="firstname">Player First Name:</label>
               <input type="text" name="firstname" id="firstname" />
          </p>
          <p>
               <label for="lastname">Player Last Name:</label>
               <input type="text" name="lastname" id="lastname" />
          </p>
          <p>
               <label for="rookieyear">Rookie Year:</label>
               <input type="text" name="rookieyear" id="rookieyear" />
          </p>
          <p>
               <input type="submit" value="Create" />
          </p>
     </form>
`;

function toggleWindow(window) {
     switch(window){
          case 'players':
               fetchResults();
               turnOnDiv();
               break;
          case 'addplayer':
               addPlayer();
               turnOnDiv();
               break;
          default:
               console.log("default");
     }
}


function fetchResults(){
     fetch(baseUrl)
     .then(function(result){
          return result.json();
     })
     .then(function(json){
          viewPlayers(json);
     });
}

function viewPlayers(json){
     
     // SET UP
     var players = json;

     let table = document.createElement('table');
     let tableRow = document.createElement('tr');
     
     let screen = document.getElementById('screen');
     clearOldData(screen);

     // PERFORM
     screen.innerHTML += `
          <h2>Current Players:</h2><hr/><br>
          <table id="playertable">
               <tr>
                    <th>
                         Player Name:
                    </th>
                    <th>
                         Rookie Year:
                    </th>
                    <th>
                         Options:
                    </th>
               </tr>
     
     `;

     players.forEach( item => {
          let screen = document.getElementById('screen');
          let playerTable = document.getElementById('playertable');
          let tableRow = document.createElement('tr');
          let tableDataPlayerName = document.createElement('td');
          let tableDataRookieYear = document.createElement('td');
          let tableDataOptions = document.createElement('td');

          tableDataPlayerName.innerHTML = item.firstName + " " + item.lastName;
          tableDataRookieYear.innerHTML = item.rookieYear;
          tableDataOptions.innerHTML = `
               <a href="#">View | </a>
               <a href="#">Edit | </a>
               <a href="#">Delete</a>
               `;

          // let p = document.createElement('p');
          // p.innerHTML += item.firstName + " " + item.lastName + "<br>";
          // let playersDiv = document.getElementById('screen');
          // playersDiv.appendChild(p);
          playerTable.appendChild(tableRow);
          tableRow.appendChild(tableDataPlayerName);
          tableRow.appendChild(tableDataRookieYear);
          tableRow.appendChild(tableDataOptions);
     });
}

function turnOnDiv(){
     document.getElementById('screen').style.display = "block";
}

function clearOldData(screen){
     while(screen.firstChild){
          screen.removeChild(screen.firstChild);
     }
}

function addPlayer(){
     let screen = document.getElementById('screen');
     clearOldData(screen);
     screen.innerHTML += addPlayerCode;
}

function postPlayer(event){
     event.preventDefault();
     let player = {
          'firstname':`${document.getElementById('firstname').value}`,
          'lastname':`${document.getElementById('lastname').value}`,
          'rookieyear':`${document.getElementById('rookieyear').value}`
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
     .then(data => response(data))
}

function response(info){
     document.getElementById('screen').innerHTML = addPlayerCode + `
          <h3>Successfully created new player</h3>
          <p>
               <strong>Player name:</strong><br />
               ${info.firstName + " " + info.lastName}
          </p>
          <p><strong>Rookie year:</strong> ${info.rookieYear}</strong></p>
     `
}