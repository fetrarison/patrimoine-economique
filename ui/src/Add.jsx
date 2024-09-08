import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlus, FaUser, FaCalendarAlt, FaDollarSign } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css"; // Animations

const Add = () => {
  const [persons, setPersons] = useState([]); // Initialisation des personnes
  const [selectedPerson, setSelectedPerson] = useState(""); // Pour stocker la personne sélectionnée
  const [newPossession, setNewPossession] = useState({
    type: "",
    libelle: "",
    valeur: "",
    dateDebut: "",
    dateFin: "",
    tauxAmortissement: "",
    valeurConstante: "",
  });
  const [error, setError] = useState(""); // Pour afficher les erreurs

  // Chargement des personnes depuis l'API lors du premier rendu
  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/persons");
        setPersons(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des personnes", error);
      }
    };
    fetchPersons();
  }, []);

  const handleAddPossession = async () => {
    if (!newPossession.libelle || !newPossession.valeur || !newPossession.dateDebut || !selectedPerson) {
      setError("Les champs libellé, valeur, date de début et personne sont obligatoires");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/persons/possession`,
        {
          possesseur: selectedPerson,
          libelle: newPossession.libelle,
          updatedPossession: newPossession,
        }
      );
      console.log("Possession ajoutée avec succès", response.data);
      resetNewPossessionForm();
    } catch (error) {
      console.error("Erreur lors de l'ajout de la possession", error);
    }
  };

  const resetNewPossessionForm = () => {
    setNewPossession({
      type: "",
      libelle: "",
      valeur: "",
      dateDebut: "",
      dateFin: "",
      tauxAmortissement: "",
      valeurConstante: "",
    });
    setSelectedPerson(""); // Réinitialise la personne sélectionnée
  };

  return (
    <div className="container mt-5 p-5 bg-light rounded-lg shadow-lg animated fadeIn">
      <h2 className="text-primary mb-4 animated bounceIn">Ajouter une nouvelle possession</h2>

      {error && <div className="alert alert-danger animated fadeIn">{error}</div>}

      {/* Sélectionner une personne */}
      <div className="form-group mb-4 animated fadeInLeft">
        <label htmlFor="personSelect" className="form-label">Choisir une personne</label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light"><FaUser /></span>
          <select
            id="personSelect"
            className="form-control"
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
          >
            <option value="">Sélectionner une personne</option>
            {persons.map((person, index) => (
              <option key={`${person.nom}-${index}`} value={person.nom}>
                {person.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <h3 className="text-success mb-4 animated bounceIn">Ajouter des possessions:</h3>

      {/* Formulaire pour ajouter une possession */}
      <div className="form-group mb-4 animated fadeInRight">
        <label htmlFor="possessionType" className="form-label">Type</label>
        <select
          id="possessionType"
          className="form-control"
          value={newPossession.type}
          onChange={(e) => setNewPossession({ ...newPossession, type: e.target.value })}
        >
          <option value="">Sélectionner le type</option>
          <option value="BienMateriel">Bien Matériel</option>
          <option value="Flux">Flux</option>
          <option value="Argent">Argent</option>
        </select>

        <label htmlFor="possessionLibelle" className="form-label">Libellé</label>
        <input
          type="text"
          id="possessionLibelle"
          placeholder="Libellé"
          className="form-control"
          value={newPossession.libelle}
          onChange={(e) => setNewPossession({ ...newPossession, libelle: e.target.value })}
        />

        <label htmlFor="possessionValeur" className="form-label">Valeur</label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light"><FaDollarSign /></span>
          <input
            type="number"
            id="possessionValeur"
            placeholder="Valeur"
            className="form-control"
            value={newPossession.valeur}
            onChange={(e) => setNewPossession({ ...newPossession, valeur: e.target.value })}
          />
        </div>

        <label htmlFor="possessionDateDebut" className="form-label">Date de début</label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light"><FaCalendarAlt /></span>
          <input
            type="date"
            id="possessionDateDebut"
            className="form-control"
            value={newPossession.dateDebut || ""}
            onChange={(e) => setNewPossession({ ...newPossession, dateDebut: e.target.value })}
          />
        </div>

        <label htmlFor="possessionDateFin" className="form-label">Date de fin</label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light"><FaCalendarAlt /></span>
          <input
            type="date"
            id="possessionDateFin"
            className="form-control"
            value={newPossession.dateFin || ""}
            onChange={(e) => setNewPossession({ ...newPossession, dateFin: e.target.value })}
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mb-4 animated fadeInUp">
        <button className="btn btn-outline-success" onClick={handleAddPossession}>
          <FaPlus /> Ajouter Possession
        </button>
      </div>

      {/* Liste des personnes */}
      <div className="mt-5">
        <h4>Liste des personnes</h4>
        <ul className="list-group">
          {Array.isArray(persons) && persons.length > 0 ? (
            persons.map((person, index) => (
              <li key={`${person.nom}-${index}`} className="list-group-item d-flex justify-content-between">
                {person.nom}
              </li>
            ))
          ) : (
            <p>Aucune personne trouvée</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Add;
