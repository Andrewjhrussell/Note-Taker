
var express = require("express");
var fs = require('fs');
var app = express();
var path = require("path")
var db = require('./db/db.json')
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'))

app.get('/notes', (req, res)=>{
    res.sendFile(path.join(__dirname, "/public/note.html"));
});
app.get('/api/notes', (req, res)=>{
    res.json(db)
})
app.post('/api/notes',(req, res)=>{
    const newNote = req.body
    if(db.length){
        newNote.id = db[db.length-1].id+1
    }else{
        newNote.id = 1
    }
    db.push(newNote)
    fs.writeFile('./db/db.json', JSON.stringify(db), 'utf8',err=>{
        if(err) throw err
        res.sendStatus(200)
    })
})
app.delete('/api/notes/:id', (req, res)=>{
    var noteID = req.params.id
    console.log(noteID)
    var index = db.findIndex(note=> note.id === parseInt(noteID));
    console.log(index)
    db.splice(index, 1)
    fs.writeFile('./db/db.json', JSON.stringify(db), 'utf8',err=>{
        if(err) throw err
        res.sendStatus(200)
    })
})
app.listen(PORT, function() {
  console.log("App listening on PORT: " + PORT);
});
