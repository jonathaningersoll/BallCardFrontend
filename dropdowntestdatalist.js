const baseUrl = "http://localhost:2200/api/sets";
const manUrl = "http://localhost:2200/api/manufacturers";
const playerUrl = "http://localhost:2200/api/players";

fetch(playerUrl)
     .then(res => res.json())
     .then(data => listResults(data))

function listResults(data){
     data.forEach(name => {
          let option = document.createElement('option');
          option.value = name.firstName + " " + name.lastName;
          document.getElementById('names').appendChild(option);
     })
}