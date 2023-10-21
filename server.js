
const fs = require("fs");
const express = require("express");
const path = require("path");
const uuid = require('./helpers/uuid');

const app = express();

const PORT = process.env.PORT || 3001;

//serve images, CSS files, and JavaScript files in a directory named public
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//route to notes.html
app.get("/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
});

//route to read the `db.json` file and return all saved notes as JSON.
app.get("/api/notes", (req, res) => {
    res.sendFile(path.join(__dirname, "/db/db.json"));
});

  // Wildcard route to direct users to a 404 page
  app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/404.html'))
);

// fs.readFileSync credit to 'bryanmac' on stackoverflow
app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let notelength = (noteList.length).toString();

    //create new property called id based on length and assign it to each json object
    newNote.id = uuid();
    //push updated note to the data containing notes history in db.json
    noteList.push(newNote);

    //write the updated data to db.json
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
    
})

// app.post('/api/notes', (req, res) => {
//   // Log that a POST request was received
//   console.info(`${req.method} request received to add a note`);

//   // Destructuring assignment for the items in req.body
//   const { title, text } = req.body;

//   // If all the required properties are present
//   if (title && text) {
//     // Variable for the object we will save
//     const newNote = {
//       title,
//       text,
//       note_id: uuid(),
//     };

//     const response = {
//       status: 'success',
//       body: newNote,
//     };
//     console.log(response);
// //     // res.json() returns data including a status message indicating the success of the request along with the newly created review data.
//     res.status(201).json(response);
//   } else {
//     // the purpose of the else statement is to allow a way to throw an error if either the product, review, or username is not present.
//     res.status(500).json('Error in posting review');
//   }
// });



//delete note according to their tagged id.
app.delete("/api/notes/:id", (req, res) => {
    let noteList = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteId = (req.params.id).toString();


    noteList = noteList.filter(selected =>{
        return selected.id != noteId;
    })

    //write the updated data to db.json and display the updated note
    fs.writeFileSync("./db/db.json", JSON.stringify(noteList));
    res.json(noteList);
});


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);


