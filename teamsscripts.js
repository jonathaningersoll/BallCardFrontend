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
               <input type="submit" value="Create" />
          </p>
     </form>
`;

let screen = document.getElementById('screen');

function toggleWindow(window) {
     switch(window){
          case 'teams':
               fetchResults();
               turnOnDiv();
               break;
          case 'addteam':
               addTeam();
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
          viewTeams(json);
     });
}

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
               <button id="view" class="opt-btn" onclick="options('view', ${item.teamId})">View</a>
               `;

          teamTable.appendChild(tableRow);
          tableRow.appendChild(tableDataTeamName);
          tableRow.appendChild(tableDataOptions);
     });
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
     let screen = document.getElementById('screen');
     clearOldData(screen);
     screen.innerHTML += addTeamCode;
}

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
     .then(data => response(data))
}

function response(info){
     document.getElementById('screen').innerHTML = addTeamCode + `
          <h3>Successfully created new Team</h3>
          <p>
               <strong>Team name:</strong><br />
               ${info.teamName}
          </p>
     `
}

// 4/10/2021 - ADDING VIEW TEAM DETAIL, 

function options(selection, id){
     switch(selection){
          case 'view':
               console.log("view case hit")
               teamdetail(id);
               break;
          default:
               break;
     }
}

function teamdetail(id){
     clearOldData(document.getElementById('screen'));
     
     fetch(`${baseUrl}/${id}`)
     .then(res => res.json())
     .then(data => viewTeamDetail(data));
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
                    <input type="submit" value="Edit" />
               </p>
          </form>
          <button id="delete" onclick="deleteTeamWarning(${data.teamId})">Delete</button>
     `;
}

// 4/11/2021 - UPDATE TEAM, DELETE TEAM

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

// DELETE

function deleteTeamWarning(id){
     
screen.innerHTML += `
     <div class="alert alert-danger" role="alert">
     <p>
          Are you sure you want to delete this team?
     </p>
     <button id="delete" onclick="deleteTeam(${id})">Delete</button>
     <button id="back" onclick="toggleWindow('teams')">Go back</button>
     </div>
`;

}

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