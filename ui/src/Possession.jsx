import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaPlus, FaUser, FaCalendarAlt, FaTag, FaDollarSign } from "react-icons/fa";
import "./App.css";

const Possession = () => {
  const [persons, setPersons] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [patrimoine, setPatrimoine] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [patrimoineTotal, setPatrimoineTotal] = useState(null);
  const [newPerson, setNewPerson] = useState({ nom: "", possessions: [] });
  const [newPossession, setNewPossession] = useState({
    type: "",
    libelle: "",
    valeur: "",
    dateDebut: "",
    dateFin: "",
    tauxAmortissement: "",
    valeurConstante: "",
  });

  useEffect(() => {
    const fetchPersons = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/persons");
        setPersons(response.data);
      } catch (error) {
        console.error("Error loading persons", error);
      }
    };
    fetchPersons();
  }, []);

  useEffect(() => {
    if (selectedPerson) {
      const person = persons.find((p) => p.nom === selectedPerson);
      setPatrimoine(person || null);
      setPatrimoineTotal(null);
    }
  }, [selectedPerson, persons]);

  const handleChange = (event) => {
    setSelectedPerson(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setError("");
  };

  const handleAddPerson = async () => {
    if (!newPerson.nom) return;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/persons",
        newPerson
      );
      setPersons([...persons, response.data]);
      setSelectedPerson(response.data.nom);
      resetNewPersonForm();
    } catch (error) {
      console.error("Error adding person", error);
    }
  };

  const handleAddPossession = () => {
    if (!newPossession.libelle) return;
    setNewPerson((prev) => ({
      ...prev,
      possessions: [...prev.possessions, newPossession],
    }));
    resetNewPossessionForm();
  };

  const handleValider = () => {
    if (!selectedDate) {
      setError("Please select a date before validating.");
      return;
    }

    if (!patrimoine || !patrimoine.possessions) {
      setError("Please select a valid person.");
      return;
    }

    const total = patrimoine.possessions.reduce((acc, possession) => {
      return acc + Number(possession.valeur || possession.valeurConstante || 0);
    }, 0);

    setPatrimoineTotal(total);
  };

  const resetNewPersonForm = () => {
    setNewPerson({ nom: "", possessions: [] });
    resetNewPossessionForm();
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
  };

  return (
    <div className="container mt-5 p-5 bg-light rounded-lg shadow-lg">
      <h2 className="text-primary mb-4">
        Add a New Person
      </h2>

      <div className="form-group mb-4">
        <label htmlFor="personName" className="form-label">
          Name
        </label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light">
            <FaUser />
          </span>
          <input
            type="text"
            id="personName"
            className="form-control"
            placeholder="Name"
            value={newPerson.nom}
            onChange={(e) =>
              setNewPerson({ ...newPerson, nom: e.target.value })
            }
          />
        </div>
      </div>

      <h3 className="text-success mb-4">
        Add Possessions:
      </h3>

      <div className="form-group mb-4">
        <label htmlFor="possessionType" className="form-label">
          Type
        </label>
        <select
          id="possessionType"
          className="form-control"
          value={newPossession.type}
          onChange={(e) =>
            setNewPossession({ ...newPossession, type: e.target.value })
          }
        >
          <option value="">Select Type</option>
          <option value="BienMateriel">Material Asset</option>
          <option value="Flux">Flow</option>
          <option value="Argent">Money</option>
        </select>

        <label htmlFor="possessionLibelle" className="form-label">
          Label
        </label>
        <input
          type="text"
          id="possessionLibelle"
          placeholder="Label"
          className="form-control"
          value={newPossession.libelle}
          onChange={(e) =>
            setNewPossession({ ...newPossession, libelle: e.target.value })
          }
        />

        <label htmlFor="possessionValeur" className="form-label">
          Value
        </label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light">
            <FaDollarSign />
          </span>
          <input
            type="number"
            id="possessionValeur"
            placeholder="Value"
            className="form-control"
            value={newPossession.valeur}
            onChange={(e) =>
              setNewPossession({ ...newPossession, valeur: e.target.value })
            }
          />
        </div>

        <label htmlFor="possessionDateDebut" className="form-label">
          Start Date
        </label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light">
            <FaCalendarAlt />
          </span>
          <input
            type="date"
            id="possessionDateDebut"
            className="form-control"
            value={newPossession.dateDebut || ""}
            onChange={(e) =>
              setNewPossession({ ...newPossession, dateDebut: e.target.value })
            }
          />
        </div>

        <label htmlFor="possessionDateFin" className="form-label">
          End Date
        </label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light">
            <FaCalendarAlt />
          </span>
          <input
            type="date"
            id="possessionDateFin"
            className="form-control"
            value={newPossession.dateFin || ""}
            onChange={(e) =>
              setNewPossession({ ...newPossession, dateFin: e.target.value })
            }
          />
        </div>

        <label htmlFor="possessionTauxAmortissement" className="form-label">
          Depreciation Rate
        </label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light">
            <FaTag />
          </span>
          <input
            type="number"
            id="possessionTauxAmortissement"
            placeholder="Depreciation Rate"
            className="form-control"
            value={newPossession.tauxAmortissement || ""}
            onChange={(e) =>
              setNewPossession({
                ...newPossession,
                tauxAmortissement: e.target.value,
              })
            }
          />
        </div>

        <label htmlFor="possessionValeurConstante" className="form-label">
          Constant Value
        </label>
        <div className="input-group">
          <span className="input-group-text bg-primary text-light">
            <FaDollarSign />
          </span>
          <input
            type="number"
            id="possessionValeurConstante"
            placeholder="Constant Value"
            className="form-control"
            value={newPossession.valeurConstante || ""}
            onChange={(e) =>
              setNewPossession({
                ...newPossession,
                valeurConstante: e.target.value,
              })
            }
          />
        </div>
      </div>

      <div className="d-flex justify-content-between mb-4">
        <button
          className="btn btn-outline-success"
          onClick={handleAddPossession}
        >
          <FaPlus /> Add Possession
        </button>
        <button
          className="btn btn-outline-info"
          onClick={handleAddPerson}
        >
          <FaPlus /> Add Person
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mt-4 shadow-sm" role="alert">
          {error}
        </div>
      )}
    </div>
  );
};

export default Possession;
