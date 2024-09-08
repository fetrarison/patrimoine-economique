const express = require("express");
const router = express.Router();
const {
  getPersons,
  getPersonByName,
  addPerson,
  addPossessionToPerson,
  deletePerson,
} = require("../controllers/personController");

// Récupérer toutes les personnes
router.get("/", getPersons);

// Récupérer une personne par nom
router.get("/:nom", getPersonByName);

// Ajouter une nouvelle personne
router.post("/", addPerson);

// Ajouter une possession à une personne existante
router.put("/:nom/possession", addPossessionToPerson);

// Supprimer une personne
router.delete("/:nom", deletePerson);

module.exports = router;
