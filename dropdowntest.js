const baseUrl = "http://localhost:2200/api/sets";
const manUrl = "http://localhost:2200/api/manufacturers";
const playerUrl = "http://localhost:2200/api/players";

document.addEventListener('keyup', e => {
     fetchNames(document.getElementById('nameinput').value)
});

function fetchNames(term){
     term ?
          fetch(`${playerUrl}/search/${term}`)
               .then(res => res.json())
               .then(data => populateNameList(data))
     : console.log("no terms");
}

function addOptionsToList(data){
     data.forEach(name => {
          let option = document.createElement('option');
          option.value = name.lastName;
          document.getElementById('names');
          names.appendChild(option);
     })
}

// for (let i = 0; i < 6; i++) {
//      console.log(i);
//      let datalistOption = document.createElement('option');
//      datalistOption.value = i;
//      document.getElementById('names').appendChild(datalistOption);
// }

function populateNameList(data){
     console.log("populating list");
     for(let i = 0; i < data.length; i++){
          let option = document.createElement('option');
          option.value = data[i].lastName;
          document.getElementById('names').appendChild(option);
     }
}
