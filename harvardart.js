let button = document.getElementById("getGalleries");
button.addEventListener("click", getGalleries);

function getImage(url) {
    url = url + '/full/full/0/default.jpg'
    let image = `<img src=${url}>`
    return image;
}

function getObjectDetails(objectId) {
    let url = 'https://api.harvardartmuseums.org/object/' + objectId + '?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce';
    let output = `<h2>Details</h2>` + `<table>`

    fetch(url)
    .then((res) => res.json())
    .then((data) => {
        for (let record in data) {
            output += `
                <tr><td>` + record + `</td><td>` + data[record] + `</td></tr>`;
        };
        output += `</table> `
        //console.log(output);
        document.getElementById('objectDetails').innerHTML = output;
        let printImage = `<h2> Picture </h2>`;
        let images = data.images;

        images.forEach((image) => {
            console.log(image.iiifbaseuri);
            printImage += getImage(image.iiifbaseuri);
        })

        // for(let image in images) {
        //     console.log(image.iiifbaseuri)
        //     //printImage += getImage(image.iiifbaseuri);
        // }
        document.getElementById('image').innerHTML = printImage;
    });

}

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
                            <button id="${object.id}" onClick="getObjectDetails(this.id)">${object.title}</button>
                        </div>
                    `;
                });

                //console.log(objects);
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



