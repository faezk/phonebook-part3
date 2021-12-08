
const express = require('express')
let morgan = require('morgan')
const app = express()
const cors = require('cors')


app.use(cors())
app.use(express.json())
let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

//Define  post token
morgan.token('post', (req, res) => JSON.stringify(req.body))

app.use(morgan(function (tokens, req, res) {
  if (tokens.method(req, res) === 'POST'){
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      tokens.post(req, res)
        ].join(' ')
  } else {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms'
    ].join(' ')
  }
}))



app.get('/api/persons', (request, response) => {
  response.json(persons)
})



app.get('/info',(request,response)=>{
  //const person = persons.find(person => person)
   const currentDate = new Date().toLocaleString();
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
   response.send(      
    ` <p>Phonebook has info for ${persons.length} people</p>    
      <p>${currentDate} (${timeZone})</p>`  
   )
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  
  if (person) {
    response.json(person)
  } else {
     response.status(404).end()
 
  }
})

function generateId() {
  return Math.floor(Math.random() * 1000);
}

app.post('/api/persons', (request, response) => {

  const body = request.body

    if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'The name or number is missing' 
    })
  }
  
  const personExist=persons.find(person => person.name === body.name)
   if(personExist) {
    return response.status(400).json({ 
       error: 'name must be unique' 
    })
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(person)

  response.json(person)
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


  const PORT =  process.env.PORT || 3001
  app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
