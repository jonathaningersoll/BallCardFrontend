const baseUrl = "http://localhost:2200/api/sets";
const manUrl = "http://localhost:2200/api/manufacturers";

let setInfo;
let setManufacturer;
let newSetManufacturer;
// Add set screen:
const addSetCode = `
     <h2>Add new set:</h2>
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
               <label for="manufacturerid">Manufacturer ID: </label>
               <input type="text" name="manufacturerid" id="manufacturerid" />
          </p>
          <p>
               <input class="btn btn-primary" type="submit" value="Create" />
          </p>
     </form>
`;

let screen = document.getElementById('screen');

function viewSets(json){
     // SET UP
     var sets = json;
     clearOldData(screen);

     // PERFORM
     screen.innerHTML += `
          <h2>Current Sets:</h2><hr/><br>
          <table id="settable">
               <tr>
                    <th>
                         Title:
                    </th>
                    <th>
                         Year:
                    </th>
                    <th>
                         Options:
                    </th>
               </tr>
     `;

     sets.forEach( item => {
          let setTable = document.getElementById('settable');
          let tableRow = document.createElement('tr');
          let tableDataSetTitle = document.createElement('td');
          let tableDataSetYear = document.createElement('td');
          let tableDataOptions = document.createElement('td');

          tableDataSetTitle.innerHTML = item.setName;
          tableDataSetYear.innerHTML = item.setYear;
          tableDataOptions.innerHTML = `
               <button id="view" class="btn btn-info" onclick="setDetail(${item.setId})">View</a>
               `;

          setTable.appendChild(tableRow);
          tableRow.appendChild(tableDataSetTitle);
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

function addSet(){
     clearOldData(screen);
     screen.innerHTML += addSetCode;
     turnOnDiv();
}

function PostSetSuccess(info){
     screen.innerHTML = addSetCode + `
          <h3>Successfully created new set</h3>
          <p>
               <strong>Set: </strong> ${info.setName}
               <br />
               <strong>ManufacturerId: </strong> ${info.manufacturerId}
               <br />
               <strong>Set Year: </strong>${info.setYear}
          </p>
     `
}

// Contains edit functions
function viewSetDetail(set){

     setInfo = set;
     fetch(`${manUrl}/${set.manufacturerId}`)
     .then(res => res.json())
     .then(data => {
          setManufacturer = data;
          screen.innerHTML += `
               <h2>${set.setName}</h2>
               <hr/>
               <p>
                    <strong>Manufacturer: </strong> ${data.manufacturerName}
               </p>
               <p>
                    <strong>Set Year: </strong> ${set.setYear}
               </p>
               <hr />
               <form action="sets.html" method="put" onsubmit="editSet(${set.setId})">
                    <p>
                         <label for="setname">Set Title: </label>
                         <input type="text" name="setname" id="setname" />
                    </p>
                    <p>
                         <label for="setyear">Edit Set Year: </label>
                         <input type="text" name="setyear" id="setyear" />
                    </p>
                    <p>
                         <label for="manufacturer">Edit Manufacturer: </label>
                         <select name="manufacturerlist" id="list" onchange="resetManufacturer()">
                         
                              ${fetch(`${manUrl}`)
                                   .then(res => res.json())
                                   .then(data => fillManufacturerList(data))
                              }
     
                         </select>
                    </p>
                    <p>
                         <input type="submit" class="btn btn-warning" value="Edit" />
                    </p>
               </form>
               <button id="delete" class="btn btn-danger" onclick="deleteSetWarning(${data.setId})">Delete</button>
          `;


          
     });


     
}

function deleteSetWarning(id){
     screen.innerHTML += `
          <div class="alert alert-danger" role="alert">
               <p>
                    Are you sure you want to delete this set?
               </p>
               <button id="delete" class="btn btn-danger" onclick="deleteSet(${id})">Delete</button>
               <button id="back" class="btn btn-success" onclick="fetchResults()">Go back</button>
          </div>
     `;
}

function deleteSetSuccess(){
     screen.innerHTML = `
          <div class="alert alert-danger" role="alert">
               <p>
                    Successfully removed set.
               </p>
               <button id="ok" class="btn btn-success" onclick="fetchResults()">OK</button>
          </div>
     `
}

function addSetDisplay(data){
     clearOldData(screen);
     screen.innerHTML +=`
          <h2>Add new set:</h2>
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
                    <label for="manufacturerlist" >Manufacturer ID: </label>
                    <select name="manufacturers" id="manlist" onchange="resetManufacturer()">
                         ${data.forEach(item => {
                              let opt = document.createElement('option');
                              let select = document.getElementById('manlist');
                              opt.innerText = item.manufacturerName;
                              opt.value = item.manufacturerId;
                              select.appendChild(opt);
                         })}
                    </select>
               </p>
               <p>
                    <input class="btn btn-primary" type="submit" value="Create" />
               </p>
          </form>
     `;
     turnOnDiv();
}




// API CALLS

// CREATE Sets
function postSet(event){
     event.preventDefault();
     let setData = {
          'setName':`${document.getElementById('setname').value}`,
          'setYear':`${document.getElementById('setyear').value}`,
          'manufacturerId':`${document.getElementById('list').value}`
     }

     fetch(baseUrl, {
          method: 'POST',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(setData)
     })
     .then(res => res.json()
     )
     .then(data => PostSetSuccess(data))
}

// GET ALL Sets
function fetchResults(){
     fetch(baseUrl)
     .then(function(result){
          return result.json();
     })
     .then(function(json){
          viewSets(json);
     });
}

// UPDATE TEAM
function editSet(id){
     let setData = {
          'setId':id,
          'setName':`${document.getElementById('setname').value}`,
          'setYear':`${document.getElementById('setyear').value}`,
          'manufacturerId':`${newSetManufacturer}`
     }

     fetch(`${baseUrl}/${id}`, {
          method: 'PUT',
          headers: {
               'Content-Type': 'application/json'
          },
          body: JSON.stringify(setData)
     })
     .then(res => res.json())
     .then(data => {console.log(data)
          fetchResults()});

}

function newAddSet(){
     fetch(manUrl)
     .then(res => res.json())
     .then(data => {addSetDisplay(data)})
}

// GET ONE SET
function setDetail(id){
     clearOldData(document.getElementById('screen'));
     
     fetch(`${baseUrl}/${id}`)
     .then(res => res.json())
     .then(data => viewSetDetail(data));
}

// DELETE TEAM
function deleteSet(id){
     fetch(`${baseUrl}/${id}`, {
          method: 'DELETE',
          headers: {
               'content-Type': 'application/json'
          },
          body: JSON.stringify(id)
     })
     .then(deleteSetSuccess());
}




// Extra API calls
// take this out? :
function getManufacturer(id){
     fetch(`${manUrl}/${id}`)
     .then()
}

// take this out? :
function getManufacturers(){
     let x;
     let res = fetch(`${manUrl}`)
     .then(res => x = res.json())
     .then()
}


function fillManufacturerList(manufacturers){
     manufacturers.forEach(item => {
          let opt = document.createElement('option');
          let list = document.getElementById('list');
     
          opt.value = `${item.manufacturerId}`;
          opt.textContent = `${item.manufacturerName}`;
          list.appendChild(opt);
     })
}

function resetManufacturer(){
     newSetManufacturer = document.getElementById('list').value;
}

function setManufacturerValue(){

}

function asdf(data){
     console.log(document.getElementById('manlist'));
     data.forEach(item => {
          let opt = document.createElement('option');
          let select = document.getElementById('manlist');
          opt.value = item.manufacturerId;
          opt.textContent = item.manufacturerName;
          select.appendChild(opt)
     })
}