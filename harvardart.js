let button = document.getElementById("getGalleries");
button.addEventListener("click", getGalleries);

// let formButton = document.getElementById("getForm");
// formButton.addEventListener("click", showForm);

// function showForm() {
//     let newForm;
//     newForm = `<form class="contact-form">
//                 <input type="text" name=""/>
//                 <input type="submit" value="Submit"/>
//             </form>`;

//     console.log(newForm);
//     document.getElementById('createForm').innerHTML = newForm;
// }

function fullImage(url, format) {
    //console.log(format);
    newUrl = url + '/full/full/0/default.' + format;
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
    //console.log(images);
    for(let image in images) {
        //console.log(images[image]);
        // printImage += getImage(image.iiifbaseuri);
        //console.log(images[image].iiifbaseuri + "/info.json")
        let imageUrl = images[image].iiifbaseuri + '/full/400,/0/default.';

        let imageJSON = await fetch(images[image].iiifbaseuri + "/info.json")
        imageJSON = await imageJSON.json();
        let formats = imageJSON.profile[1].formats;
        let format;
        let newUrl;

        if (formats.includes("png")) {
            format = "png";
            newUrl = imageUrl + format;
            printImage += `<img id="${images[image].iiifbaseuri}" class="${format}" src="${newUrl}" onClick="fullImage(this.id, this.className)">`
        } else {
            format = "jpg";
            newUrl = imageUrl + format;
            printImage += `<img id="${images[image].iiifbaseuri}" class="${format}" src="${newUrl}" onClick="fullImage(this.id, this.className)">`
        }
    }
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

/**
 * Retrieves input data from a form and returns it as a JSON object.
 * @param  {HTMLFormControlsCollection} elements  the form elements
 * @return {Object}                               form data as an object literal
 */
const formToJSON = elements => [].reduce.call(elements, (data, element) => {

  data[element.name] = element.value;
  return data;

}, {});

const handleFormSubmit = event => {

  // Stop the form from submitting since we’re handling that with AJAX.
  event.preventDefault();

  // Call our function to get the form data.
  const data = formToJSON(form.elements);

  // Demo only: print the form data onscreen as a formatted JSON object.
  //const dataContainer = document.getElementsByClassName('results__display')[0];

  // Use `JSON.stringify()` to make the output valid, human-readable JSON.
  //dataContainer.textContent = JSON.stringify(data, null, "  ");

  // ...this is where we’d actually do something with the form data...
  search(data);
};

const form = document.getElementsByClassName('object')[0];
form.addEventListener('submit', handleFormSubmit);

async function search(data) {
    let parameter;
    let searchTerm;

    for (let record in data) {
        if(data[record] !== "") {
            // console.log(data);
            // console.log(data[record]);
            parameter = record;
            searchTerm = data[record];
        }
    }

    //note to change the construction of url if need to use 'q=field:value'
    let url = 'https://api.harvardartmuseums.org/object/?apikey=fc1b68f0-b251-11e8-b0af-a198bfdbf6ce&size=100&' + parameter + "=" + searchTerm;
    let res = await fetch(url);
    res = await res.json();
    results = res.records;
    console.log(results);
    let pages = res.info.pages;
    let pageNum = "&page="
    for(let i = 2; i <= pages; i++) {
        let nextPage = pageNum + i;
        let newRes = await fetch(url+nextPage);
        newRes = await newRes.json();
        newRes = newRes.records;
        results = results.concat(newRes);
    }

    let output = `<h2>Search Results</h2>`
    for(let record in results) {
        //console.log(results[record]);
        output += `
                <div>
                    <button id="${results[record].id}" onClick="getObjectDetails(this.id)">${results[record].title}</button>
                </div>
            `;
    }
    document.getElementsByClassName('results__display')[0].innerHTML = output;

}