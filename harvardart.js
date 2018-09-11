let button = document.getElementById("getGalleries");
button.addEventListener("click", getGalleries);

function getObjects(id) {
    let url = 'https://api.harvardartmuseums.org/object?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce&gallery=' + id;
    fetch(url)
    .then((response) => response.json())
    .then((data) => {
        let objects = `<h2>Objects</h2>`;
        let totalObjects = data.info.totalrecords;
        if (totalObjects === 0) {
            objects += `
                <div>
                    <h3> no objects </h3>
                <div>
            `;
        } else {
        let newUrl = url + '&size=' + totalObjects;

            fetch(newUrl)
            .then((response) => response.json())
            .then((data) => {
                let records = data.records;


                records.forEach((object) => {
                    objects += `
                        <div>
                            <p>${object.title}</p>
                        </div>
                    `;
                });

                console.log(objects);
                document.getElementById('objects').innerHTML = objects;
            });

        }
        document.getElementById('objects').innerHTML = objects;
    });
}

function getGalleries() {
    fetch('https://api.harvardartmuseums.org/gallery?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce')
    .then((response) => response.json())
    .then((data) => {
        let totalRecords = data.info.totalrecords;
        //let page;
        let url = 'https://api.harvardartmuseums.org/gallery?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce&size=' + totalRecords;

        let output = `<h2>Galleries</h2>`;
        fetch(url)
        .then((response) => response.json())
        .then((data) => {
            let records = data.records;

            records.forEach((gallery) => {
                output += `
                  <div>
                    <button id="${gallery.id}" class="galleries" onClick="getObjects(this.id)"> ${gallery.name} </button>
                  </div>
                  `;
            });
            document.getElementById('output').innerHTML = output;
        })
        // .then(() => {
        //     let gbutton = document.querySelectorAll(".galleries");
        //     gbutton.addEventListener("click", () => {

        //     })
        // })


    });


}



