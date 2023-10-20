const express = require('express');
const path = require('path');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');
const notes = require('./db/db.json');
//notes keys = "title": "text":

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(express.static('public'));


//*****************maybe /pub/notes.html */
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

// GET request for title and text
app.get('/api/notes', (req, res) => {
    res.status(200).json(notes);
  });




// TODO: Create a route that will serve up the `public/paths.html` 

app.get('/', (req, res) => res.send('Navigate to /notes'));

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// app.get('/paths', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/paths.html'))
// );

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      note_id: uuid(),
    };

    const response = {
      status: 'success',
      body: newNote,
    };
    console.log(response);
    // res.json() returns data including a status message indicating the success of the request along with the newly created review data.
    res.status(201).json(response);
  } else {
    // the purpose of the else statement is to allow a way to throw an error if either the product, review, or username is not present.
    res.status(500).json('Error in posting review');
  }
});


app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/404.html'))
);


app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT}`)
);