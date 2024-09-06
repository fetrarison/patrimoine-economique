import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaTrashAlt, FaEdit, FaPlus } from "react-icons/fa";
import "./App.css";
import { Link } from "react-router-dom";

const Show = () => {
  const [persons, setPersons] = useState([]);
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingPossession, setEditingPossession] = useState(null);
  const [editingPossessionIndex, setEditingPossessionIndex] = useState(null);

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

  const deletePerson = async (nom) => {
    try {
      const response = await axios.delete(
        `http://localhost:5000/api/persons/${encodeURIComponent(nom)}`
      );
      console.log(response.data.message);
      setPersons(persons.filter((person) => person.nom !== nom));
    } catch (error) {
      console.error("Erreur lors de la suppression de la personne", error);
    }
  };

  const editPerson = (nom) => {
    const personToEdit = persons.find((person) => person.nom === nom);
    console.log("Personne sélectionnée pour modification:", nom);
    setEditingPerson(personToEdit);
  };

  const updatePerson = async () => {
    if (!editingPerson || !editingPerson.nom) {
      console.error(
        "Les données de la personne sont manquantes ou incomplètes"
      );
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/persons/${encodeURIComponent(
          editingPerson.nom
        )}`,
        editingPerson,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.message);
      setPersons(
        persons.map((person) =>
          person.nom === editingPerson.nom ? response.data.person : person
        )
      );
      setEditingPerson(null);
    } catch (error) {
      if (error.response) {
        console.error("Erreur serveur:", error.response.data);
      } else if (error.request) {
        console.error("Pas de réponse reçue:", error.request);
      } else {
        console.error("Erreur de configuration:", error.message);
      }
    }
  };

  const handleEditPossession = (personName, possessionIndex) => {
    const personToEdit = persons.find((person) => person.nom === personName);
    const possessionToEdit = personToEdit.possessions[possessionIndex];
    setEditingPerson(personToEdit);
    setEditingPossession({ ...possessionToEdit });
    setEditingPossessionIndex(possessionIndex);
    console.log("Possession: " + personName + possessionIndex);
  };

  const handleDeletePossession = async (personName, possessionIndex) => {
    const personToEdit = persons.find((person) => person.nom === personName);
    const updatedPossessions = personToEdit.possessions.filter(
      (_, index) => index !== possessionIndex
    );
    const updatedPerson = { ...personToEdit, possessions: updatedPossessions };

    try {
      await axios.put(
        `http://localhost:5000/api/persons/${encodeURIComponent(personName)}`,
        updatedPerson
      );
      setPersons(
        persons.map((person) =>
          person.nom === personName ? updatedPerson : person
        )
      );
    } catch (error) {
      console.error("Erreur lors de la mise à jour des possessions", error);
    }
  };

  const savePossession = async () => {
    if (
      !editingPossession ||
      !editingPerson ||
      editingPossessionIndex === null
    ) {
      console.error("Données de possession manquantes ou incomplètes");
      return;
    }

    const updatedPerson = { ...editingPerson };
    updatedPerson.possessions[editingPossessionIndex] = editingPossession;

    try {
      const response = await axios.put(
        `http://localhost:5000/api/persons/${encodeURIComponent(
          editingPerson.nom
        )}`,
        updatedPerson
      );
      setPersons(
        persons.map((person) =>
          person.nom === editingPerson.nom ? response.data.person : person
        )
      );
      setEditingPossession(null);
      setEditingPossessionIndex(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la possession", error);
    }
  };

  return (
    <div className="container mt-5 bg-light text-dark p-5 rounded-lg shadow-lg">
      <h1 className="mb-4 text-center text-primary">
        List of People and Their Possessions
      </h1>
      <Link to="/possession">
        <button
          className="btn btn-success mb-4 py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          onClick={() => setEditingPerson({ nom: "", possessions: [] })}
        >
          <FaPlus /> Add Person
        </button>
      </Link>
      {persons.length === 0 ? (
        <p className="text-warning">No people found.</p>
      ) : (
        persons.map((person, personIndex) => (
          <div key={personIndex} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>{person.nom}</h3>
              <div>
                <button
                  className="btn btn-warning text-light mx-2 py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  onClick={() => editPerson(person.nom)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-danger text-light mx-2 py-2 px-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
                  onClick={() => deletePerson(person.nom)}
                >
                  <FaTrashAlt /> Delete
                </button>
              </div>
            </div>
            <table className="table table-striped table-hover">
              <thead className="bg-primary text-light">
                <tr>
                  <th>Type</th>
                  <th>Label</th>
                  <th>Value</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Depreciation Rate</th>
                  <th>Constant Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {person.possessions.map((possession, possessionIndex) => (
                  <tr key={possessionIndex}>
                    <td>{possession.type}</td>
                    <td>{possession.libelle}</td>
                    <td>{possession.valeur} Ar</td>
                    <td>{possession.dateDebut}</td>
                    <td>{possession.dateFin ? possession.dateFin : "N/A"}</td>
                    <td>
                      {possession.tauxAmortissement !== null
                        ? `${possession.tauxAmortissement} %`
                        : "N/A"}
                    </td>
                    <td>
                      {possession.valeurConstante !== null
                        ? `${possession.valeurConstante} Ar`
                        : "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-warning text-light btn-sm mx-1"
                        onClick={() =>
                          handleEditPossession(person.nom, possessionIndex)
                        }
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-danger text-light btn-sm mx-1"
                        onClick={() =>
                          handleDeletePossession(person.nom, possessionIndex)
                        }
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      )}
      {editingPerson && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content bg-secondary text-light">
              <div className="modal-header">
                <h5 className="modal-title">Edit Person</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingPerson(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  id="personName"
                  name="personName"
                  type="text"
                  value={editingPerson.nom || ""}
                  onChange={(e) =>
                    setEditingPerson({ ...editingPerson, nom: e.target.value })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="Name"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setEditingPerson(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-info" onClick={updatePerson}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingPossession && (
        <div
          className="modal fade show"
          style={{ display: "block" }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content bg-secondary text-light">
              <div className="modal-header">
                <h5 className="modal-title">Edit Possession</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditingPossession(null)}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  id="possessionType"
                  name="possessionType"
                  type="text"
                  value={editingPossession.type || ""}
                  onChange={(e) =>
                    setEditingPossession({
                      ...editingPossession,
                      type: e.target.value,
                    })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="Type"
                />
                <input
                  id="possessionLibelle"
                  name="possessionLibelle"
                  type="text"
                  value={editingPossession.libelle || ""}
                  onChange={(e) =>
                    setEditingPossession({
                      ...editingPossession,
                      libelle: e.target.value,
                    })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="Label"
                />
                <input
                  id="possessionValeur"
                  name="possessionValeur"
                  type="number"
                  value={editingPossession.valeur || ""}
                  onChange={(e) =>
                    setEditingPossession({
                      ...editingPossession,
                      valeur: e.target.value,
                    })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="Value"
                />
                <input
                  id="possessionDateDebut"
                  name="possessionDateDebut"
                  type="date"
                  value={editingPossession.dateDebut || ""}
                  onChange={(e) =>
                    setEditingPossession({
                      ...editingPossession,
                      dateDebut: e.target.value,
                    })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="Start Date"
                />
                <input
                  id="possessionDateFin"
                  name="possessionDateFin"
                  type="date"
                  value={editingPossession.dateFin || ""}
                  onChange={(e) =>
                    setEditingPossession({
                      ...editingPossession,
                      dateFin: e.target.value,
                    })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="End Date"
                />
                <input
                  id="possessionTauxAmortissement"
                  name="possessionTauxAmortissement"
                  type="number"
                  value={editingPossession.tauxAmortissement || ""}
                  onChange={(e) =>
                    setEditingPossession({
                      ...editingPossession,
                      tauxAmortissement: e.target.value,
                    })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="Depreciation Rate"
                />
                <input
                  id="possessionValeurConstante"
                  name="possessionValeurConstante"
                  type="number"
                  value={editingPossession.valeurConstante || ""}
                  onChange={(e) =>
                    setEditingPossession({
                      ...editingPossession,
                      valeurConstante: e.target.value,
                    })
                  }
                  className="form-control mb-2 bg-dark text-light"
                  placeholder="Constant Value"
                />
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setEditingPossession(null)}
                >
                  Cancel
                </button>
                <button className="btn btn-info" onClick={savePossession}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Show;
