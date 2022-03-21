const { MongoClient} = require('mongodb');
// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://admin:BoomFire%40123@34.226.101.96:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'fireinspection';

async function pdf() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('formstemplates');
    const newPdfResult = await collection.find({}).toArray();
    console.log('Found documents =>', newPdfResult.length);
    //   https://boom-fire-s3.s3.amazonaws.com/develop/templates/boom-fire_1585383165064.pdf
    //   https://boom-fire.s3.amazonaws.com/develop/templates/boom-fire_1588756307673.pdf
    newPdfResult.forEach((element, index) => {
        let oldPdfUrl = element.pdfUrl;
        let newPdfUrl = oldPdfUrl.replace("boom-fire.s3", "boom-fire-s3.s3");
        console.log(newPdfUrl)
        element.pdfUrl = newPdfUrl
        let document = { _id: element._id };
        console.log(document);
        db.collection('formstemplates')
            .replaceOne(document, element, (err, res) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log("1 document pdf replaced", element._id);
                }
            });

    })
    return;
}
async function image() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('formimages');
    const newImageResult = await collection.find({}).toArray();
    console.log('Found documents =>', newImageResult.length);
    // https://boom-fire.s3.amazonaws.com/develop/images/boom-fire_1630058653740.png
    // https://boom-fire-s3.s3.amazonaws.com/develop/images/boom-fire_1642053766592.png
    newImageResult.forEach((element, index) => {
        if (index == 0) {
            let oldImageURL = element.imagesUrl;
            oldImageURL.forEach((elem, index) => {
                let oldImage = elem.imageUrl
                let newformUrl = oldImage.replace("boom-fire.s3", "boom-fire-s3.s3");
                console.log(newformUrl)
                elem.imageUrl = newformUrl

            })
            // element.imagesUrl = oldImageURL;
            let document = { _id: element._id };
            console.log(document);
            db.collection('formimages')
                .replaceOne(document, element, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("1 document formimages replaced", element._id);
                    }
                });
        }

    })
    return;
}

async function signature() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('refforms');
    const newsignature = await collection.find({}).toArray();
    console.log('Found documents =>', newsignature.length);
    newsignature.forEach((element, index) => {
        let oldformUrl = element.signature;
        oldformUrl.forEach((elem, index) => {
            let oldForm = elem.signatureImageUrl
            let newformUrl = oldForm.replace("boom-fire.s3", "boom-fire-s3.s3");
            console.log(newformUrl)
            elem.signatureImageUrl = newformUrl
            let document = { _id: element._id };
            console.log(document);
            db.collection('refforms')
                .replaceOne(document, element, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("1 document signature replaced", element._id);
                    }
                });
        })

    })
    return;
}
async function form() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('refforms');
    const newformPdf = await collection.find({}).toArray();
    console.log('Found documents =>', newformPdf.length);
    newformPdf.forEach((element, index) => {
            let oldformPdf = element.filledFormPdf;
            let newformUrl = oldformPdf.replace("boom-fire.s3", "boom-fire-s3.s3");

            
            // console.log(newformUrl)
            element.filledFormPdf = newformUrl;
            element.signature.forEach(ele => {
                if ("signatureImageUrl" in ele) {
                    let newsignatureImageUrl = ele.signatureImageUrl.replace("boom-fire.s3", "boom-fire-s3.s3");
    
                    ele.signatureImageUrl = newsignatureImageUrl
                }
            })
            let document = { _id: element._id };
            console.log(document);
            db.collection('refforms')
                .replaceOne(document, element, (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("1 document forms replaced", element._id);
                    }
                });

    })
    return;
}
// pdf(),
form()
    //     signature(),
    //     image
    // image()
    .then(console.log)
    .catch(console.error)
        // .finally(() => client.close());