const express                           = require("express");
const cors                              = require("cors");
const { uuid, isUuid }                  = require("uuidv4");

const app                               = express();

app.use(express.json());
app.use(cors());

app.use('/repositories/:id', validateRepositoryID);

function validateRepositoryID(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id))
  return res.status(400).json({error: 'Invalid repository ID'});

  return next();
}

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id }                = request.params;

  const repository = repositories.find(repository => repository.id === id);

  if (!repository)
    return response.status(400).json({error: 'Repository not found'})

  const repositoryUpdated = {
    id,
    title,
    url,
    techs,
    likes: repository.likes
  }

  repositories[repository.id] = repositoryUpdated;

  return response.json(repositoryUpdated);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryId = repositories.findIndex(repository => repository.id === id);
  
  if (repositoryId < 0)
    return response.status(400).json({error: 'Repository not found'})

  repositories.splice(repositoryId, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find(repository => repository.id === id);
  
  if (!repository)
    return response.status(400).json({error: 'Repository not found'})

  repository.likes += 1;

  return response.json(repository);
});

module.exports = app;
