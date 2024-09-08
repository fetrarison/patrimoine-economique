const { readData, writeData } = require("../data");

const getPersons = (req, res) => {
  const data = readData();
  const persons = data.filter((entry) => entry.model === "Personne").map((entry) => entry.data);
  res.json(persons);
};

const getPersonByName = (req, res) => {
  const { nom } = req.params;
  const data = readData();

  const person = data.find((entry) => entry.model === "Personne" && entry.data.nom === nom);

  if (person) {
    res.json(person.data);
  } else {
    res.status(404).json({ message: "Personne non trouvée" });
  }
};

// Ajouter une nouvelle personne
const addPerson = (req, res) => {
  const newPerson = {
    model: "Personne",
    data: req.body,
  };
  const data = readData();
  data.push(newPerson);
  writeData(data);
  res.status(201).json(newPerson);
};

// Ajouter une possession à une personne existante
const addPossessionToPerson = (req, res) => {
  const { nom } = req.params;
  const newPossession = req.body;

  const data = readData();

  const person = data.find((entry) => entry.model === "Personne" && entry.data.nom === nom);

  if (person) {
    person.data.possessions.push(newPossession);
    writeData(data);
    res.status(201).json({ message: "Possession ajoutée avec succès" });
  } else {
    res.status(404).json({ message: "Personne non trouvée" });
  }
};

// Supprimer une personne
const deletePerson = (req, res) => {
  const { nom } = req.params;
  const data = readData();

  const updatedData = data.filter((entry) => entry.model !== "Personne" || entry.data.nom !== nom);

  if (updatedData.length === data.length) {
    return res.status(404).json({ message: "Personne non trouvée" });
  }

  writeData(updatedData);
  res.json({ message: "Personne supprimée avec succès" });
};

module.exports = {
  getPersons,
  getPersonByName,
  addPerson,
  addPossessionToPerson,
  deletePerson,
};
