let button = document.getElementById("getGalleries");
button.addEventListener("click", getGalleries);

// async function getFormat(url) {
//     let info = url + "/info.json"
//     let format = null;

//     let res = await fetch(info);
//     res = await res.json();

//     let formats = res.profile[1].formats;
//     formats.forEach((type) => {
//         if(type === "png") {
//             format = "png";
//         } else {
//             format = "jpg";
//         }
//     });

//     return Promise.resolve(format);
// }

function getImage(url) {
    // let info = url + "/info.json"
    // let format = null;
    // fetch(info)
    // .then((res) => res.json())
    // .then((data) => {
    //     let formats = data.profile[1].formats;
    //     formats.forEach((type) => {
    //         if(type === "png") {
    //             format = "png";
    //         } else {
    //             format = "jpg";
    //         }
    //     });
    //     return format;
    // });


    newUrl = url + '/full/400,/0/default.' + format;
    let image = `<img id="${url}" src="${newUrl}" onClick="fullImage(this.id)">`
    return image;
}

function fullImage(url) {
    newUrl = url + '/full/full/0/default.jpg'
    let image = `<img src="${newUrl}">`
    document.getElementById('image').innerHTML = image;
}

async function getObjectDetails(objectId) {
    //get details
    let url = 'https://api.harvardartmuseums.org/object/' + objectId + '?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce';
    let output = `<h2>Details</h2>` + `<table>`;

    let res = await fetch(url);
    res = await res.json();
    for (let record in res) {
        output += `
            <tr><td>` + record + `</td><td>` + res[record] + `</td></tr>`;
    };
    output += `</table> `;
    document.getElementById('objectDetails').innerHTML = output;

    //get images
    let printImage = `<h2> Picture </h2>`;
    let images = res.images;

    images.forEach((image) => {
        console.log(image.iiifbaseuri);
        printImage += getImage(image.iiifbaseuri);
    })
    document.getElementById('image').innerHTML = printImage;
}


async function getObjects(id) {
    let url = 'https://api.harvardartmuseums.org/object?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce&gallery=' + id;

    let res = await fetch(url);
    res = await res.json();

    let objects = `<h2>Objects</h2>`;

    let totalObjects = res.info.totalrecords;
    if(totalObjects === 0) {
        objects += `
                <div>
                    <h3> no objects </h3>
                <div>
            `;
    } else {
        let newUrl = url + '&size=' + totalObjects;

        let objectList = await fetch(newUrl);
        objectList = await objectList.json();

        let records = objectList.records;
        records.forEach((object) => {
            objects += `
                <div>
                    <button id="${object.id}" onClick="getObjectDetails(this.id)">${object.title}</button>
                </div>
            `;
        });
        document.getElementById('objects').innerHTML = objects;
    }
    document.getElementById('objects').innerHTML = objects;
}

async function getGalleries() {
    let response = await fetch('https://api.harvardartmuseums.org/gallery?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce')
    response = await response.json();

    let totalRecords = response.info.totalrecords;
    let url = 'https://api.harvardartmuseums.org/gallery?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce&size=' + totalRecords;

    let galleries = await fetch(url);
    galleries = await galleries.json();

    let output = `<h2>Galleries</h2>`
    let records = galleries.records;
    records.forEach((gallery) => {
        output += `
            <div>
                <button id="${gallery.id}" class="galleries" onClick="getObjects(this.id)"> ${gallery.name} </button>
            </div>
        `;
    });
    document.getElementById('output').innerHTML = output;
}



