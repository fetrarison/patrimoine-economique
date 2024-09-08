import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaTrashAlt, FaEdit, FaCheckCircle } from "react-icons/fa";
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
        const response = await axios.get("https://patrimoine-economique-hxk0.onrender.com/api/persons");
        setPersons(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des personnes", error);
      }
    };
    fetchPersons();
  }, []);

  const deletePerson = async (nom) => {
    try {
      await axios.delete(`https://patrimoine-economique-hxk0.onrender.com/api/persons/${encodeURIComponent(nom)}`);
      setPersons(persons.filter((person) => person.nom !== nom));
    } catch (error) {
      console.error("Erreur lors de la suppression de la personne", error);
    }
  };

  const handleEditPossession = (personName, possessionIndex) => {
    const personToEdit = persons.find((person) => person.nom === personName);
    const possessionToEdit = personToEdit.possessions[possessionIndex];
    setEditingPerson(personToEdit);
    setEditingPossession({ ...possessionToEdit });
    setEditingPossessionIndex(possessionIndex);
  };

  const savePossession = async () => {
    if (!editingPossession || !editingPerson || editingPossessionIndex === null) return;

    const updatedPerson = { ...editingPerson };
    updatedPerson.possessions[editingPossessionIndex] = editingPossession;

    try {
      await axios.put(
        `https://patrimoine-economique-hxk0.onrender.com/api/persons/${encodeURIComponent(editingPerson.nom)}`,
        updatedPerson
      );
      setPersons(persons.map((person) => (person.nom === editingPerson.nom ? updatedPerson : person)));
      setEditingPossession(null);
      setEditingPossessionIndex(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la possession", error);
    }
  };

  const handleDeletePossession = async (personName, possessionIndex) => {
    const personToEdit = persons.find((person) => person.nom === personName);
    const updatedPossessions = personToEdit.possessions.filter((_, index) => index !== possessionIndex);
    const updatedPerson = { ...personToEdit, possessions: updatedPossessions };

    try {
      await axios.put(
        `https://patrimoine-economique-hxk0.onrender.com/api/persons/${encodeURIComponent(personName)}`,
        updatedPerson
      );
      setPersons(persons.map((person) => (person.nom === personName ? updatedPerson : person)));
    } catch (error) {
      console.error("Erreur lors de la mise à jour des possessions", error);
    }
  };

  const closePossession = async (personName, possessionIndex) => {
    const personToEdit = persons.find((person) => person.nom === personName);
    const possessionToEdit = personToEdit.possessions[possessionIndex];
    possessionToEdit.dateFin = new Date().toISOString().split("T")[0];
    possessionToEdit.valeur = 0;

    const updatedPerson = { ...personToEdit };
    updatedPerson.possessions[possessionIndex] = possessionToEdit;

    try {
      await axios.put(
        `https://patrimoine-economique-hxk0.onrender.com/api/persons/${encodeURIComponent(personName)}`,
        updatedPerson
      );
      setPersons(persons.map((person) => (person.nom === personName ? updatedPerson : person)));
    } catch (error) {
      console.error("Erreur lors de la clôture de la possession", error);
    }
  };

  return (
    <div className="container mt-5 bg-light text-dark p-5 rounded-lg shadow-lg animated fadeIn">
      <h1 className="mb-4 text-center text-primary animated bounceIn">List of People and Their Possessions</h1>

      {persons.length === 0 ? (
        <p className="text-warning">No data available.</p>
      ) : (
        persons.map((person, personIndex) => (
          <div key={personIndex} className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h3>{person.nom}</h3>
              <div>
                <button
                  className="btn btn-warning text-light mx-2 py-2 px-3 rounded-lg shadow-md hover:shadow-lg"
                  onClick={() => handleEditPossession(person.nom, personIndex)}
                >
                  <FaEdit /> Edit
                </button>
                <button
                  className="btn btn-danger text-light mx-2 py-2 px-3 rounded-lg shadow-md hover:shadow-lg"
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
                  <th>Current Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {person.possessions.map((possession, possessionIndex) => {
                  const startDate = new Date(possession.dateDebut);
                  const currentDate = new Date();
                  const monthsDiff =
                    (currentDate.getFullYear() - startDate.getFullYear()) * 12 +
                    (currentDate.getMonth() - startDate.getMonth());

                  const depreciation = possession.tauxAmortissement || 0;
                  const currentValue =
                    possession.valeur - (possession.valeur * depreciation * monthsDiff) / 100;

                  return (
                    <tr key={possessionIndex}>
                      <td>{possession.type}</td>
                      <td>{possession.libelle}</td>
                      <td>{possession.valeur} Ar</td>
                      <td>{startDate.toLocaleDateString()}</td>
                      <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : "N/A"}</td>
                      <td>{depreciation} %</td>
                      <td>{currentValue > 0 ? currentValue.toFixed(2) : 0} Ar</td>
                      <td>
                        <button className="btn btn-warning btn-sm mx-1" onClick={() => handleEditPossession(person.nom, possessionIndex)}>
                          <FaEdit />
                        </button>
                        <button className="btn btn-danger btn-sm mx-1" onClick={() => handleDeletePossession(person.nom, possessionIndex)}>
                          <FaTrashAlt />
                        </button>
                        <button className="btn btn-dark btn-sm mx-1" onClick={() => closePossession(person.nom, possessionIndex)}>
                          <FaCheckCircle /> Clôture
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))
      )}
    </div>
  );
};

export default Show;
