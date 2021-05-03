const baseUrl = "http://localhost:2200/api/sets";

let sets = [];

getSets();

function getSets(){
     fetch(baseUrl)
     .then(res => res.json())
     .then(data => displayItems(data))
     .catch(err => console.error(err));
}

function displayItems(data){
     console.log(data);
     const tBody = document.getElementById('tableBody')
     tBody.innerHTML = "";

     const button = document.createElement('button');

     data.forEach(item => {
          let deleteButton = document.createElement('button');
          let viewButton = document.createElement('button');
          let tr = tBody.insertRow();

          viewButton.innerText = "View";
          viewButton.classList.add('btn');
          viewButton.classList.add('btn-info');
          viewButton.setAttribute("data-bs-toggle", "modal");
          viewButton.setAttribute("data-bs-target", "#exampleModal");
          viewButton.setAttribute("onclick", `getDetails(${item.setId})`);
          
          deleteButton.innerText = "Delete";
          deleteButton.classList.add('btn');
          deleteButton.classList.add('btn-danger');
          deleteButton.setAttribute("data-target", "#newModal");
          deleteButton.setAttribute("data-toggle", "modal");

          let tdTitle = tr.insertCell(0);
          let textTitle = document.createTextNode(item.setName);
          tdTitle.appendChild(textTitle);

          
          let tdYear = tr.insertCell(1);
          let textYear = document.createTextNode(item.setYear);
          tdYear.appendChild(textYear);
          
          let tdOptions = tr.insertCell(2);
          tdOptions.appendChild(viewButton);
          tdOptions.appendChild(deleteButton);
     })


     
}

function getDetails(id){
console.log(`${baseUrl}/${id}`);
     fetch(`${baseUrl}/${id}`)
     .then(res => res.json())
     .then(data => displayDetails(data));

}

function displayDetails(data){
     let modalBody = document.getElementById('modal-body');
     console.log(data);
     modalBody.innerText = data.cards;
     
}