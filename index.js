require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Person = require('./models/note');

const app = express();

app.use(express.static('build'));
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// let persons = [
//   { 
//     "id": 1,
//     "name": "Arto Hellas", 
//     "number": "040-123456"
//   },
//   { 
//     "id": 2,
//     "name": "Ada Lovelace", 
//     "number": "39-44-5323523"
//   },
//   { 
//     "id": 3,
//     "name": "Dan Abramov", 
//     "number": "12-43-234345"
//   },
//   { 
//     "id": 4,
//     "name": "Mary Poppendieck", 
//     "number": "39-23-6423122"
//   }
// ];

app.get('/info', (request, response) => {
  let date = new Date().toString();
  let html = (
    `<div>
      <p>Phonebook has info for ${persons.length} people</p>
      <p>${date}</p>
    </div>`
  );
  response.send(html);
});

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons);
  });
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find(p => p.id === id);
  
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter(person => person.id !== id);

  response.status(204).end();
});

app.post('/api/persons', (request, response) => {
  const body = request.body;

  const name = body.name;
  const number = body.number;

  if (!name) {
    return response.status(400).json({
      error: 'name missing'
    });
  }

  if (!number) {
    return response.status(400).json({
      error: 'number missing'
    });
  }

  // const existingPerson = persons.find(person => person.name === name);
  // if (existingPerson) {
  //   return response.status(400).json({
  //     error: 'name already exists'
  //   });
  // }

  // const person = {
  //   id: Math.ceil(Math.random() * 999999999999999999999),
  //   name: name,
  //   number: number
  // }

  // persons = persons.concat(person);

  const person = new Person({
    name: name,
    number: number
  });

  person.save().then(savedPerson => {
    response.json(savedPerson);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});