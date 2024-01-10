const fs = require('fs');
const http = require('http');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const notes = require('./db.json');

const app = express();

app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(cookieParser('1e32d6e879177269baf36b1018adbfc05d3e38c21d987030e241979af2a41f30'));

function saveNotes() {
    fs.writeFileSync('./db.json', JSON.stringify(notes));
}

app.get('/', (req, res) => {
    res.send('Note API');
});

app.get('/notes', (req, res) => {
    res.send(notes);
});

app.get('/notes/:uuid', (req, res) => {
    const note = notes.find((note) => note.id === req.params.uuid);

    if (!note) {
        return res.status(404).send('Not Found');
    }

    return res.send(note);
});

app.put('/notes', (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send('Bad Request');
    }

    const created_at = Date.now();
    const updated_at = created_at;
    const id = uuidv4();

    notes.unshift({
        id,
        title,
        body: '',
        created_at,
        updated_at,
    });

    saveNotes();

    return res.send({
        status: 'ok',
        id,
    });
});

app.post('/notes', (req, res) => {
    const { id, title, body } = req.body;

    if (!id) {
        return res.status(400).send('Bad Request');
    }

    const updated_at = Date.now();

    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
        return res.status(404).send('Not Found');
    }

    notes[noteIndex] = {
        ...notes[noteIndex],
        title,
        body,
        updated_at,
    }

    saveNotes();

    return res.send({
        status: 'ok',
        id,
        updated_at,
    });
});

app.delete(`/notes/:id`, (req, res) => {
    const {id} = req.params

    const noteIndex = notes.findIndex((note) => note.id === id);

    if (noteIndex === -1) {
        return res.status(404).send('Not Found');
    }

    notes.splice(noteIndex, 1)

    saveNotes();

    return res.send({
        status: 'ok',
    });
})


const server = http.createServer(app);

server.listen(3030, '0.0.0.0', () => {
    console.log('Server started at http://0.0.0.0:3030');
})
