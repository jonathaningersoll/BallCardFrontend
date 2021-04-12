const baseUrl = "http://localhost:29163/api/teams";

// Add team screen:
const addTeamCode = `
     <h2>Add new team:</h2>
     <hr />
     <form action="teams.html" method="post" onsubmit="postTeam(event)">
          <p>
               <label for="teamname">New team :</label>
               <input type="text" name="teamname" id="teamname" />
          </p>
          <p>
               <input class="btn btn-primary" type="submit" value="Create" />
          </p>
     </form>
`;

let screen = document.getElementById('screen');

function viewTeams(json){
     
     // SET UP
     var teams = json;
     
     let screen = document.getElementById('screen');
     clearOldData(screen);

     // PERFORM
     screen.innerHTML += `
          <h2>Current Teams:</h2><hr/><br>
          <table id="teamtable">
               <tr>
                    <th>
                         Team:
                    </th>
                    <th>
                         Options:
                    </th>
               </tr>
     
     `;

     teams.forEach( item => {
          let teamTable = document.getElementById('teamtable');
          let tableRow = document.createElement('tr');
          let tableDataTeamName = document.createElement('td');
          let tableDataOptions = document.createElement('td');

          tableDataTeamName.innerHTML = item.teamName;
          tableDataOptions.innerHTML = `
               <button id="view" class="btn btn-info" onclick="teamDetail(${item.teamId})">View</a>
               `;

          teamTable.appendChild(tableRow);
          tableRow.appendChild(tableDataTeamName);
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

function addTeam(){
     clearOldData(screen);
     screen.innerHTML += addTeamCode;
     turnOnDiv();
}

function PostTeamResponse(info){
     document.getElementById('screen').innerHTML = addTeamCode + `
          <h3>Successfully created new Team</h3>
          <p>
               <strong>Team name:</strong><br />
               ${info.teamName}
          </p>
     `
}

function viewTeamDetail(data){
     screen.innerHTML += `
          <h2>${data.teamName}</h2>
          <hr/>
          <form action="teams.html" method="put" onsubmit="editTeam(${data.teamId})">
               <p>
                    <label for="teamname">Edit team name:</label>
                    <input type="text" name="teamname" id="teamname" />
               </p>
               <p>
                    <input type="submit" class="btn btn-warning" value="Edit" />
               </p>
          </form>
          <button id="delete" class="btn btn-danger" onclick="deleteTeamWarning(${data.teamId})">Delete</button>
     `;
}

function deleteTeamWarning(id){
     screen.innerHTML += `
          <div class="alert alert-danger" role="alert">
               <p>
                    Are you sure you want to delete this team?
               </p>
               <button id="delete" class="btn btn-danger" onclick="deleteTeam(${id})">Delete</button>
               <button id="back" class="btn btn-success" onclick="fetchResults()">Go back</button>
          </div>
     `;
}





// API CALLS

// CREATE TEAM
function postTeam(event){
     event.preventDefault();
     let team = {
          'teamname':`${document.getElementById('teamname').value}`,
     }

     fetch(baseUrl, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(team)
     })
     .then(res => res.json()
     )
     .then(data => PostTeamResponse(data))
}

// GET ALL TEAMS
function fetchResults(){
     fetch(baseUrl)
     .then(function(result){
          return result.json();
     })
     .then(function(json){
          viewTeams(json);
     });
}

// UPDATE TEAM
function editTeam(id){
     let team = {
          'teamId':id,
          'teamname':`${document.getElementById('teamname').value}`
     }

     fetch(`${baseUrl}/${id}`, {
          method: 'PUT',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(team)
     })
     .then(res => res.json())
     .then(data => console.log(data))
}

// GET ONE TEAM
function teamDetail(id){
     clearOldData(document.getElementById('screen'));
     
     fetch(`${baseUrl}/${id}`)
     .then(res => res.json())
     .then(data => viewTeamDetail(data));
}

// DELETE TEAM
function deleteTeam(id){
     fetch(`${baseUrl}/${id}`, {
          method: 'DELETE',
          headers: {
               'content-Type': 'application/json'
          },
          body: JSON.stringify(id)
     })
     .then(viewTeams());
}