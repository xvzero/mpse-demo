// import dependencies
const express = require('express');
const http = require('http')
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');
const socketIO = require('socket.io')

// get environment variables
require('dotenv').config();

const port = process.env.PORT || 4000

// define the Express app
const app = express();

// the database
const projects = [];

// enhance your app security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());

// enable all CORS requests
app.use(cors());

// log HTTP requests
app.use(morgan('combined'));

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_CLIENT_ID,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

// retrieve all projects
app.get('/', (req, res) => {
  const ps = projects.map(project => {
    const current_bid = project.bids.length > 0 ?
      project.bids.sort((a,b) => a.amount - b.amount)[0] :
      { amount: null, author: { avatar: null, username: null }}
    
    return {
      id: project.id,
      title: project.title,
      description: project.description,
      bids: project.bids.length,
      author: project.author,
      end_date: project.end_date,
      initial_bid: project.initial_bid,
      current_bid
    }
  });
  res.send(ps);
});

// get a specific project
app.get('/:id', (req, res) => {
  const project = projects.filter(p => (p.id === parseInt(req.params.id)));
  if (project.length > 1) return res.status(500).send();
  if (project.length === 0) return res.status(404).send();
  res.send(project[0]);
});

// insert a new project
app.post('/', checkJwt, (req, res) => {  
  console.log(req.body);
  const { picture, nickname } = req.user;
  const { title, initial_bid, description, end_date } = req.body;

  const newProject = {
    id: projects.length + 1,
    title,
    description,
    initial_bid,
    start_date: new Date(),
    end_date: new Date(end_date),
    bids: [],
    author: {
      avatar: picture,
      username: nickname
    }
  };
  projects.push(newProject);
  res.status(200).send();
});

// insert a new bid to a project
app.post('/bid/:id', checkJwt, (req, res) => {
  const { picture, nickname } = req.user;
  const { amount } = req.body;

  let index;
  for (let i=0; i<projects.length; i++) {
    if (projects[i].id === parseInt(req.params.id)) {
      index = i;
      break;
    }
  }

  if (index === null) return res.status(404).send();

  const current_bid = parseFloat(projects[index].current_bid)
  if (!current_bid || amount < current_bid) {
    projects[index].current_bid = amount;
  }

  projects[index].bids.push({
    amount,
    author: {
      avatar: picture,
      username: nickname
    }
  });

  res.status(200).send();
});

// our server instance
const server = http.createServer(app)
// This creates our socket using the instance of the server
const io = socketIO(server)

io.on("connection", socket => {
  console.log("New client connected")

  socket.on("disconnect", () => {
    console.log("Client disconnected")
  });

  socket.on("UPDATE_BID", () => {
    io.emit("UPDATE_BID")
  });

  socket.on("CREATE_PROJECT", () => {
    io.emit("CREATE_PROJECT")
  })

  socket.on("CLOSE_PROJECT", () => {
    io.emit("CLOSE_PROJECT")
  })
});

// start the server
server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
