const baseUrl = "http://localhost:29163/api/manufacturers";

// Add team screen:
const addManferCode = `
     <h2>Add new Manufacturer:</h2>
     <hr />
     <form action="manufacturers.html" method="post" onsubmit="postManfer(event)">
          <p>
               <label for="manfername">New team :</label>
               <input type="text" name="manfername" id="manfername" />
          </p>
          <p>
               <input class="btn btn-primary" type="submit" value="Create" />
          </p>
     </form>
`;

let screen = document.getElementById('screen');

function viewManfers(json){
     // SET UP
     var manfers = json;
     
     let screen = document.getElementById('screen');
     clearOldData(screen);

     // PERFORM
     screen.innerHTML += `
          <h2>Current Manufacturers:</h2><hr/><br>
          <table id="manfertable">
               <tr>
                    <th>
                         Manufacturer:
                    </th>
                    <th>
                         Options:
                    </th>
               </tr>
     
     `;

     manfers.forEach( item => {
          let manferTable = document.getElementById('manfertable');
          let tableRow = document.createElement('tr');
          let tableDataManferName = document.createElement('td');
          let tableDataOptions = document.createElement('td');

          tableDataManferName.innerHTML = item.manufacturerName;
          tableDataOptions.innerHTML = `
               <button id="view" class="btn btn-info" onclick="manferDetail(${item.manufacturerId})">View</a>
               `;

          manferTable.appendChild(tableRow);
          tableRow.appendChild(tableDataManferName);
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

function addManfer(){
     clearOldData(screen);
     screen.innerHTML += addManferCode;
     turnOnDiv();
}

function postManferResponse(info){
     document.getElementById('screen').innerHTML = addManferCode + `
          <h3>Successfully created new manufacturer</h3>
          <p>
               <strong>Manufacturer name:</strong><br />
               ${info.manufacturerName}
          </p>
     `
}

function viewManferDetail(data){
     screen.innerHTML += `
          <h2>${data.manufacturerName}</h2>
          <hr/>
          <form action="manufacturers.html" method="put" onsubmit="editManufacturer(${data.manufacturerId})">
               <p>
                    <label for="manfername">Edit manufacturer name:</label>
                    <input type="text" name="manfername" id="manfername" />
               </p>
               <p>
                    <input type="submit" class="btn btn-warning" value="Edit" />
               </p>
          </form>
          <button id="delete" class="btn btn-danger" onclick="deleteManferWarning(${data.manufacturerId})">Delete</button>
     `;
}

function deleteManferWarning(id){
     screen.innerHTML += `
          <div class="alert alert-danger" role="alert">
               <p>
                    Are you sure you want to delete this manufacturer?
               </p>
               <button id="delete" class="btn btn-danger" onclick="deleteManfer(${id})">Delete</button>
               <button id="back" class="btn btn-success" onclick="fetchResults()">Go back</button>
          </div>
     `;
}





// API CALLS

// CREATE TEAM
function postManfer(event){
     event.preventDefault();
     let manufacturer = {
          'manufacturerName':`${document.getElementById('manfername').value}`,
     }

     fetch(baseUrl, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(manufacturer)
     })
     .then(res => res.json()
     )
     .then(data => postManferResponse(data))
}

// GET ALL TEAMS
function fetchResults(){
     fetch(baseUrl)
     .then(function(result){
          return result.json();
     })
     .then(function(json){
          viewManfers(json);
     });
}

// UPDATE TEAM
function editManufacturer(id){
     let manfer = {
          'manufacturerId':id,
          'manufacturerName':`${document.getElementById('manfername').value}`
     }

     fetch(`${baseUrl}/${id}`, {
          method: 'PUT',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(manfer)
     })
     .then(res => res.json())
     .then(fetchResults);
}

// GET ONE TEAM
function manferDetail(id){
     clearOldData(document.getElementById('screen'));
     
     fetch(`${baseUrl}/${id}`)
     .then(res => res.json())
     .then(data => viewManferDetail(data));
}

// DELETE TEAM
function deleteManfer(id){
     fetch(`${baseUrl}/${id}`, {
          method: 'DELETE',
          headers: {
               'content-Type': 'application/json'
          },
          body: JSON.stringify(id)
     })
     // TODO: WRITE SUCCESS RESPOSNE FUNCTION
}