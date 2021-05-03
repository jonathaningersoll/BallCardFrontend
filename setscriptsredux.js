const baseUrl = "http://localhost:2200/api/sets";
const manUrl = "http://localhost:2200/api/manufacturers";
const playerUrl = "http://localhost:2200/api/players";
const teamUrl = "http://localhost:2200/api/teams";
const cardUrl = "http://localhost:2200/api/cards";

let screen = document.getElementById('screen');
document.addEventListener("DOMContentLoaded", function(e) {
     e.preventDefault();
     loadPage();
});


// INITIAL RESULTS ON PAGE LOAD
function loadPage(){
     fetch(baseUrl, {
          method: 'GET',
          headers: {
               'Content-Type': 'application/json'
          }
     })
     .then(res => res.json())
     .then(data => displayResults(data));
}

function displayResults(sets){
     screen.innerHTML = `
     <h2>Current Sets:</h2>
     <button class="btn btn-primary" id="inline-btn" onclick="addSet()">New Set</button>
     <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newSetModal">
          New Set
     </button>
     <hr/>
     <br>
     <table id="settable" class="table table-striped">
          <thead>
               <tr>
                    <th scope="col">
                         Title:
                    </th>
                    <th>
                         Year:
                    </th>
                    <th>
                         Options:
                    </th>
               </tr>
          </thead>
          <tbody id="tableBody">
          </tbody>
     </table>

     <div class="modal fade" id="newSetModal" tabindex="-1" aria-labelledby="newSetModalLabel" aria-hidden="true">
          <div class="modal-dialog">
               <div class="modal-content" id="modalContent">
                    <div class="modal-header">
                         <h5 class="modal-title" id="newSetModalLabel">Create New Set</h5>
                         <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                         <form action="set.html" id="newSetForm" method="post" onsubmit="postSet(event)">
                              <p>
                                   <label for="setname">Set Title: </label>
                                   <input type="text" name="setname" id="setname" />
                              </p>
                              <p>
                                   <label for="setyear">Set Year: </label>
                                   <input type="text" name="setyear" id="setyear" />
                              </p>
                              <p>
                                   <label for="manufacturers">Manufacturer: </label>
                                   <select id="manufacturerList" onchange="(e => {manufacturerid = e.value})">
                                   </select>
                              </p>
                         </form>
                    </div>
                    <div class="modal-footer">
                         <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                         <button type="submit" action="${baseUrl}/sets" class="btn btn-primary" form="newSetForm">Create</button>
                    </div>
               </div>
          </div>
     </div>
     `;

     sets.forEach( (item, index) => {
          let setTable = document.getElementById('tableBody');
          let tableRow = document.createElement('tr');
          let tableDataSetTitle = document.createElement('td');
          let tableDataSetYear = document.createElement('td');
          let tableDataOptions = document.createElement('td');
          let viewBtn = document.createElement('button');
          let deleteBtn = document.createElement('button');
          
          tableRow.id = `${index}`;
          viewBtn.type = "button";
          viewBtn.classList.add('btn');
          viewBtn.classList.add('btn-info');
          viewBtn.setAttribute('onclick', `loadDetails(${item.setId})`);
          viewBtn.innerText = "View";
          viewBtn.id = "view";

          deleteBtn.type = "button";
          deleteBtn.classList.add('btn');
          deleteBtn.classList.add('btn-danger');
          deleteBtn.setAttribute('onclick', `deleteSet(${item.setId})`);
          deleteBtn.innerText = "Delete";
          deleteBtn.id = "delete";

          tableDataSetTitle.innerHTML = item.setName;
          tableDataSetYear.innerHTML = item.setYear;

          setTable.appendChild(tableRow);
          tableRow.appendChild(tableDataSetTitle);
          tableRow.appendChild(tableDataSetYear);
          tableRow.appendChild(tableDataOptions);
          tableDataOptions.appendChild(viewBtn);
          tableDataOptions.appendChild(deleteBtn);
     });

     fetch(`${manUrl}`)
          .then(res => res.json())
          .then(data => setManufactureList(data))


     function setManufactureList(manData){
          manData.forEach(item => {
               let opt = document.createElement('option');
               let select = document.getElementById('manufacturerList');
               opt.value = item.manufacturerId;
               opt.innerText = item.manufacturerName;
               select.appendChild(opt); 
          })
     }
}
// DISPLAY OF SETS PAGE RESULTS



// SET DETAILS FUNCTIONS
function loadDetails(id){
     clearOldData(screen);

     fetch(`${baseUrl}/${id}`)
     .then(res => res.json())
     .then(data => displayDetails(data));
}

function displayDetails(set){
     console.log(set);
     screen.innerHTML += `
          <h2>${set.setName}</h2>
          <button class="btn btn-danger" id="inline-btn" onclick="#">Delete</button>
          <button class="btn btn-warning" id="inline-btn" data-bs-toggle="modal" data-bs-target="#setDetailModal">Edit Info</button>
          
          <hr/>
          <button class="btn btn-primary" id="inline-btn" data-bs-toggle="modal" data-bs-target="#setCreateModal">Add Card</button>
          <p>
               <strong>Manufacturer: </strong> ${set.manufacturer.manufacturerName}
          </p>
          <p>
               <strong>Set Year: </strong> ${set.setYear}
          </p>
          <p>
               <strong>Checklist: </strong>
          <p>
          <table id="checklist" class="table table-striped">
               <thead>
                    <tr>
                         <th>
                              Card #:
                         </th>
                         <th>
                              Player
                         </th>
                         <th>
                              Team:
                         </th>
                         <th>
                              Options:
                         </th>
                    </tr>
               </thead>
               <tbody id="detailTableBody">
               </tbody>
          </table>

          
          

          <div class="modal fade" id="setDetailModal" tabindex="-1" aria-labelledby="setDetailModal" aria-hidden="true">
               <div class="modal-dialog">
                    <div class="modal-content">
                         <div class="modal-header">
                              <h5 class="modal-title" id="setDetailModal">Edit Set Details</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                         </div>
                         <div class="modal-body">
                              <form action="sets.html" id="editSetForm" method="put" onsubmit="editSet(${set.setId})">
                                   <p>
                                        <label for="setname">Set Title: </label>
                                        <input type="text" name="setname" id="setname" value="${set.setName}" />
                                   </p>
                                   <p>
                                        <label for="setyear">Edit Set Year: </label>
                                        <input type="text" name="setyear" id="setyear" value="${set.setYear}" />
                                   </p>
                                   <p>
                                        <label for="manufacturer">Edit Manufacturer: </label>
                                        <select name="manufacturerlist" id="list" onchange="e => {manufacturerId = e.manufacturer.value">
                                        </select>
                                   </p>
                              </form>
                         </div>
                         <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              <button type="submit" class="btn btn-primary" form="editSetForm">Save changes</button>
                         </div>
                    </div>
               </div>
          </div>

          <div class="modal fade" id="setCreateModal" tabindex="-1" aria-labelledby="setCreateModal" aria-hidden="true">
               <div class="modal-dialog">
                    <div class="modal-content">
                         <div class="modal-header">
                              <h5 class="modal-title" id="setCreateModal">Add Card</h5>
                              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                         </div>
                         <div class="modal-body">



                              <form action="sets.html" id="createCardForm" method="post" onsubmit="createCard(event,${set.setId})">
                                   <p>
                                        <label for="nameinput">Player: </label>
                                        <input list="names" id="nameinput">
                                        <datalist id="names">
                    
                                        </datalist>
                                   </p>
                                   <p>
                                        <label for="teaminput">Team: </label>
                                        <input list="teams" id="teaminput">
                                        <datalist id="teams">
                    
                                        </datalist>
                                   </p>
                                   <p>
                                        <label for="cardidentifier">Card Number: </label>
                                        <input type="text" id="cardidentifier">
                                   </p>
                                   <p>
                                        <label for="feature">Card Feature: </label>
                                        <input type="text" id="feature">
                                   </p>
                                   <p>
                                        <label for="position">Player Position: </label>
                                        <input type="text" id="position">
                                   </p>
                                   <p>
                                        <label for="ismainset">Main Set?</label>
                                        <input type="checkbox" id="ismainset">
                                   </p>
                                   <p>
                                        <label for="parallelcolor">Parallel Color: </label>
                                        <input type="text" id="parallelcolor">
                                   </p>
                                   <p>
                                        <label for="isrookiecard">Rookie Card?</label>
                                        <input type="checkbox" id="isrookiecard">
                                   </p>
                                   <p>
                                        <label for="flavortext">Back Text: </label>
                                        <input type="text" id="flavortext">
                                   </p>


                              </form>
                         </div>
                         <div class="modal-footer">
                              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                              <button type="submit" class="btn btn-primary" form="createCardForm">Create</button>
                         </div>
                    </div>
               </div>
          </div>
     `;
     
     // Populate card checklist for a given set
     set.cards.forEach(card => {
          let checklist = document.getElementById('detailTableBody')
          let cardTableRow = document.createElement('tr');
          let TableDataCardNumber = document.createElement('td');
          let TableDataCardPlayer = document.createElement('td');
          let TableDataCardTeam = document.createElement('td');
          let tableDataCardOptions = document.createElement('td');
          let cardDeleteBtn = document.createElement('button');

          cardDeleteBtn.type = "button";
          cardDeleteBtn.classList.add('btn');
          cardDeleteBtn.classList.add('btn-danger');
          cardDeleteBtn.setAttribute = ('onclick', `deleteSet(${card.id})`);
          cardDeleteBtn.innerText = "Delete";
          cardDeleteBtn.id = "delete";

          TableDataCardNumber.innerText = card.cardIdentifier;
          TableDataCardPlayer.innerText = card.player.firstName + " " + card.player.lastName;
          TableDataCardTeam.innerText = card.team.teamName;

          checklist.appendChild(cardTableRow);
          cardTableRow.appendChild(TableDataCardNumber);
          cardTableRow.appendChild(TableDataCardPlayer);
          cardTableRow.appendChild(TableDataCardTeam);
          cardTableRow.appendChild(tableDataCardOptions);
          tableDataCardOptions.appendChild(cardDeleteBtn);
     })

     // POPULATE MANUFACTURERS FOR SET EDIT INFO
     fetch(`${manUrl}`)
          .then(res => res.json())
          .then(data => setManufactureList(data))


     function setManufactureList(manData){
          manData.forEach(item => {
               let opt = document.createElement('option');
               let select = document.getElementById('list');
               opt.value = item.manufacturerId;
               opt.innerText = item.manufacturerName;
               select.appendChild(opt); 
          })
     }


     // POPULATE EXISTING PLAYER SEARCH
     fetch(playerUrl)
     .then(res => res.json())
     .then(data => setPlayerList(data))

     function setPlayerList(data){
          data.forEach(name => {
               // <option value="name.firstName" id="name.id">
               let option = document.createElement('option');
               option.value = name.firstName + " " + name.lastName;
               option.id = name.playerId;

               // add the option tag to the element with the "names" id.
               document.getElementById('names').appendChild(option);
          })
     }
     console.log(document.getElementById('names'));

     fetch(teamUrl)
     .then(res => res.json())
     .then(data => setTeamList(data))

     function setTeamList(data){
          data.forEach(team => {
               let option = document.createElement('option');
               option.value = team.teamName;
               option.id = team.teamId;
               document.getElementById('teams').appendChild(option);
          })
     }
}

function editSet(id){
     
     let setData = {
          "setId":`${id}`,
          "setName":`${document.getElementById('setname').value}`,
          "setYear":`${document.getElementById('setyear').value}`,
          "manufacturerId":`${document.getElementById('list').value}`
     }

     fetch(`${baseUrl}/${id}`, {
          method: 'PUT',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(setData)
     })
     .then(res => res.json())
     .then(data => console.log(data));  
}
// END SET DETAILS FUNCTIONS



// CREATE SET FUNCTIONS
function addSet(){
     clearOldData(document.getElementById('screen'));
     
     //fetch all manufacturers
     fetch(manUrl)
     .then(res => res.json())
     .then(data => displayAddSet(data));
}

function displayAddSet(manufacturers){
     screen.innerHTML = `<h2>Add new set:</h2>
     <hr />
     <form action="set.html" method="post" onsubmit="postSet(event)">
          <p>
               <label for="setname">Set Title: </label>
               <input type="text" name="setname" id="setname" />
          </p>
          <p>
               <label for="setyear">Set Year: </label>
               <input type="text" name="setyear" id="setyear" />
          </p>
          <p>
               <label for="manufacturers">Manufacturer: </label>
               <select id="manufacturerlist" onchange="(e => {manufacturerid = e.value})">
               </select>
          </p>
          <p>
               <input class="btn btn-primary" type="submit" value="Create" />
          </p>
     </form>`;

     manufacturers.forEach(item => {
          let opt = document.createElement('option');
          let select = document.getElementById('manufacturerlist');

          opt.value = item.manufacturerId;
          opt.innerText = item.manufacturerName;
          select.appendChild(opt);
     })
}

function postSet(event){
     event.preventDefault();

     let setData = {
          "setName":`${document.getElementById('setname').value}`,
          "setYear":`${document.getElementById('setyear').value}`,
          "manufacturerId":`${document.getElementById('manufacturerList').value}`
     }

     fetch(baseUrl, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(setData)
     })
     .then(res => res.json())
     .then((data) => {
          document.getElementById('newSetModal').innerHTML =
               `
                    <div class="alert alert-success alert dismissible fade show" role="alert">
                         Successfully created new set!
                    </div> 
               `;
     });
}

// END CREATE SET FUNCTIONS



// EDIT SET FUNCTIONS
function editSetModal(id){
     //onclick="editSetModal(${item.setId})"
}



// DELETE SET FUNCTIONS
function deleteSet(id){
     console.log(id);
     fetch(`${baseUrl}/${id}`, {
          method: 'DELETE',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(null)
     })
     .then(window.location = window.location.href);
}

function deleteSuccess(){
     document.getElementById('screen').innerHTML +=
     `
          <div class="alert alert-success alert dismissible fade show" role="alert">
               Successfully removed set!
          </div> 
     `;
}



// CREATE CARD FUNCTIONS
function createCard(event, setId){
     event.preventDefault();

     // THIS RIGHT HERE IS CRAZY:
     let playerId = document.querySelectorAll(`option[value='${document.getElementById('nameinput').value}']`)[0].id;
     let teamId = document.querySelectorAll(`option[value='${document.getElementById('teaminput').value}']`)[0].id;
     
     // CONVERT ON/OFF SWITCHES TO TRUE/FALSE:
     let ismainset;
     let isrookie;
     document.getElementById('ismainset').value == "on" ? ismainset = true : ismainset = false;
     document.getElementById('isrookiecard').value == "on" ? isrookie = true : isrookie = false;

     let cardData = {
          "playerId":`${playerId}`,
          "teamId":`${teamId}`,
          "setId":`${setId}`,
          "cardIdentifier":`${document.getElementById('cardidentifier').value}`,
          "feature":`${document.getElementById('feature').value}`,
          "position":`${document.getElementById('position').value}`,
          "isMainSet":ismainset,
          "parallelColor":`${document.getElementById('parallelcolor').value}`,
          "isRookieCard":isrookie,
          "flavorText":`${document.getElementById('flavortext').value}`
     }

     console.log(cardData);
     fetch(cardUrl, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(cardData)
     })
     .then(res => res.json())
     .then(data => createCardResponse(data))
}

function createCardResponse(data){
     console.log(data);
}

function clearOldData(element){
     console.log("Clearing data");
     while(element.firstChild){
          console.log(element.firstChild);
          element.removeChild(element.firstChild);
     }
}

function getValue(id){
     return document.getElementById(id).value;
}