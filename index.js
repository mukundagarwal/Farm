//fs is required for reading files
const { error } = require("console");
const fs = require("fs");
const slugify = require("slugify");
// // READING FROM A FILE
// const textIn = fs.readFileSync("./txt/input.txt", "utf-8");
// console.log(textIn);

// //WRITING TO A FILE
// const textOut = `This is what we know about avacado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync("./txt/output.txt", textOut); //textOut is the text we want to write to that file
// console.log("File Written");

// //SYNCHRONOUS CODE- Means each statement is executed line by line so until the prev line executes the next line cannot therefore it is called blocking code
// //ASYNCHRONOUS CODE- Non Blocking code - A call back function is given and code keeps on executing further

// //There is one single thread in node.js
// //therefore use asynchronous file read function

// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//   if (err) return console.log("ERROR!");
//   fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//     console.log(data2);
//     fs.readFile("./txt/append.txt", "utf-8", (err, data3) => {
//       fs.writeFile("./txt/final.txt", `${data2}\n${data3}`, "utf-8", (err) => {
//         console.log("FIle is written");
//       });
//     });
//   });
// });
// console.log("Will Read file"); //this executes first

//----------------CREATING A WEB SERVER---------------------
//importing
const http = require("http");
const path = require("path");
const { escape } = require("querystring");
//we create a server using createServer

//--------------ROUTING-----------------
//it means implementing different actions for different url
const url = require("url");
const replaceTemplate = require("../modules/replaceTemplate");

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  "utf-8"
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  "utf-8"
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
//importing replaceTemplate function
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const dataObj = JSON.parse(data); //converts string to an array of objects
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true); //parses the url into an object
  //and destruturing the object into variables
  //overview page
  if (pathname === "/overview") {
    response.writeHead(200, { "Content-type": "text/html" });
    const cardsHtml = dataObj
      .map((element) => replaceTemplate(tempCard, element))
      .join(""); //.join() joins the elements of the array and converts it into a string with the given delimiter
    //replacing the {%PRODUCT_CARDS%} placeholder
    const output = tempOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    response.end(output);

    //Product page
  } else if (pathname === "/product") {
    response.writeHead(200, { "Content-type": "text/html" });
    const product = dataObj[query.id]; //selects that position in the array
    //replacing everything in product page using the current product id
    const output = replaceTemplate(tempProduct, product);
    response.end(output);
    //-------API-------
    //what we can do is read the file in the beginning in a synchronous way and that way it doesnt have to be read again when its requested
  } else if (pathname === "/api") {
    // console.log(productData);
    response.writeHead(200, { "Content-type": "application/json" });
    response.end(data);

    //NOT FOUND
  } else {
    response.writeHead(404, {
      //this is used for sending headers to inform the browser
      "Content-type": "text/html",
      "my-own-header": "Hello-world", //my own made up header
    });
    response.end("<h1>Page not found</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  //takes port no. , local hostname , call back function which is optional
  console.log("Listening to requests on port 8000");
});

//------------API--------------
//service through which we can request some data
//json file
//data.json file has array of objects which have the data in them
