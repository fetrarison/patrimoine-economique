import React, { useState, useEffect, useMemo } from "react";
import data from "../../data/data.json";
import Argent from "../../models/possessions/Argent.js";
import BienMateriel from "../../models/possessions/BienMateriel.js";
import Flux from "../../models/possessions/Flux.js";
import Patrimoine from "../../models/Patrimoine.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { Link } from "react-router-dom";
import { FaEdit, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";
import "./App.css";
import Chart from "./components/chart/LineChart";

const PatrimoineApp = () => {
  const [selectedPerson, setSelectedPerson] = useState("");
  const [patrimoine, setPatrimoine] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [error, setError] = useState("");
  const [patrimoineTotal, setPatrimoineTotal] = useState(null);

  useEffect(() => {
    const person = data.find((p) => p.nom === selectedPerson);
    if (person) {
      const possessionsInstances = person.possessions.map((possession) => {
        switch (possession.type) {
          case "Argent":
            return new Argent(
              person.nom,
              possession.libelle,
              possession.valeur,
              new Date(possession.dateDebut),
              possession.dateFin ? new Date(possession.dateFin) : null,
              possession.tauxAmortissement,
              possession.typeArgent
            );
          case "BienMateriel":
            return new BienMateriel(
              person.nom,
              possession.libelle,
              possession.valeur,
              new Date(possession.dateDebut),
              possession.dateFin ? new Date(possession.dateFin) : null,
              possession.tauxAmortissement
            );
          case "Flux":
            return new Flux(
              person.nom,
              possession.libelle,
              possession.valeurConstante,
              new Date(possession.dateDebut),
              possession.dateFin ? new Date(possession.dateFin) : null,
              possession.tauxAmortissement,
              possession.jour
            );
          default:
            return null;
        }
      });
      setPatrimoine(new Patrimoine(person.nom, possessionsInstances));
      setPatrimoineTotal(null);
    }
  }, [selectedPerson]);

  const handleChange = (event) => {
    setSelectedPerson(event.target.value);
  };

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setError("");
  };

  const calculateCurrentValue = (possession, date) => {
    let currentValue = possession.getValeurApresAmortissement(new Date(date));
    if (possession.valeur === 0 && possession.valeurConstante) {
      const startDate = new Date(possession.dateDebut);
      const monthDiff =
        (new Date(date).getFullYear() - startDate.getFullYear()) * 12 +
        (new Date(date).getMonth() - startDate.getMonth());
      if (monthDiff >= 1) {
        currentValue += monthDiff * possession.valeurConstante;
      }
    }
    return currentValue;
  };

  const values = useMemo(() => {
    if (!patrimoine || !selectedDate) return [];
    return patrimoine.possessions.map((possession) =>
      calculateCurrentValue(possession, selectedDate)
    );
  }, [patrimoine, selectedDate]);

  const handleValidate = () => {
    if (!selectedDate) {
      setError("Please select a date before validating.");
      return;
    }

    const total = values.reduce((acc, curr) => acc + curr, 0);
    setPatrimoineTotal(total);
  };

  return (
    <div className="container mt-5 bg-light text-dark rounded-lg shadow-lg p-4">
      <h1 className="mb-4 text-center text-primary">
        Wealth Calculator
      </h1>
      <div className="mb-3">
        <label htmlFor="personSelect" className="form-label">
          Select a person:
        </label>
        <select
          id="personSelect"
          className="form-select bg-secondary text-light"
          onChange={handleChange}
          value={selectedPerson}
        >
          <option value="">--Please select a person--</option>
          {data.map((person) => (
            <option key={person.nom} value={person.nom}>
              {person.nom}
            </option>
          ))}
        </select>
      </div>

      {patrimoine && patrimoine.possessions.length > 0 && (
        <div className="mt-4">
          <table className="table table-striped table-hover table-light">
            <thead className="bg-primary text-light">
              <tr>
                <th>Description</th>
                <th>Initial Value</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Depreciation Rate</th>
                <th>Current Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patrimoine.possessions.map((possession, index) => (
                <tr key={index}>
                  <td>{possession.libelle}</td>
                  <td>{`${
                    possession.valeur || possession.valeurConstante
                  } Ar`}</td>
                  <td>{possession.dateDebut.toISOString().split("T")[0]}</td>
                  <td>
                    {possession.dateFin
                      ? possession.dateFin.toLocaleDateString()
                      : "Not defined"}
                  </td>
                  <td>
                    {possession.tauxAmortissement !== null
                      ? `${possession.tauxAmortissement} %`
                      : "N/A"}
                  </td>
                  <td>
                    {selectedDate
                      ? `${calculateCurrentValue(
                          possession,
                          selectedDate
                        ).toFixed(2)} Ar`
                      : "Select a date"}
                  </td>
                  <td>
                    <Link to="/show">
                      <button
                        className="btn btn-warning"
                      >
                        <FaEdit />
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4">
            <label htmlFor="dateInput" className="form-label">
              Choose a date:
            </label>
            <div className="input-group">
              <input
                type="date"
                id="dateInput"
                className="form-control bg-secondary text-light"
                value={selectedDate}
                onChange={handleDateChange}
              />
              <button className="btn btn-success ms-2" onClick={handleValidate}>
                <FaCheckCircle /> Validate
              </button>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger mt-3">
              <FaExclamationCircle /> {error}
            </div>
          )}

          {patrimoineTotal !== null && (
            <div className="mt-4">
              <h2 className="text-success">
                Total Wealth Value: {patrimoineTotal.toFixed(2)} Ar
              </h2>
            </div>
          
          )}
              <div>
              <Chart  />
              </div>
        </div>
      )}
    </div>
  );
};

export default PatrimoineApp;
