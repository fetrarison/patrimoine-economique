import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { FaCheckCircle } from "react-icons/fa";
import Chart from "./components/chart/LineChart";
import "./App.css";

const PatrimoineApp = () => {
  const [persons, setPersons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [validatedDate, setValidatedDate] = useState(selectedDate);
  const [patrimoineTotals, setPatrimoineTotals] = useState({});
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Valeur du patrimoine",
        data: [],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.2)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  });

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

  useEffect(() => {
    const calculatePatrimoineAtDate = async () => {
      const totals = {};
      const chartValues = [];
      const labels = [];

      for (const person of persons) {
        let totalPatrimoine = 0;
        for (const possession of person.possessions) {
          const valueAtDate = calculatePossessionValue(possession, validatedDate);
          totalPatrimoine += valueAtDate;
        }
        totals[person.nom] = totalPatrimoine;
        chartValues.push(totalPatrimoine);
        labels.push(person.nom);
      }
      setPatrimoineTotals(totals);
      setChartData({
        labels: labels,
        datasets: [
          {
            label: "Valeur du patrimoine",
            data: chartValues,
            borderColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderWidth: 2,
            tension: 0.3,
            fill: true,
            pointBackgroundColor: ["#ff6384", "#36a2eb", "#cc65fe", "#ffce56"],
          },
        ],
      });
    };

    if (persons.length > 0) {
      calculatePatrimoineAtDate();
    }
  }, [persons, validatedDate]);

  const calculatePossessionValue = (possession, date) => {
    if (!possession || !possession.valeur || isNaN(possession.valeur)) {
      return 0;
    }

    const startDate = new Date(possession.dateDebut);
    const givenDate = new Date(date);

    if (possession.dateFin && new Date(possession.dateFin) < givenDate) {
      return 0;
    }

    const daysDiff = Math.floor((givenDate - startDate) / (1000 * 60 * 60 * 24));

    if (!possession.tauxAmortissement || possession.tauxAmortissement === 0) {
      return possession.valeur;
    }

    const depreciationRate = possession.tauxAmortissement / 100;
    const dailyDepreciation = depreciationRate / 30;
    const currentValue = possession.valeur * Math.pow(1 - dailyDepreciation, daysDiff);

    return currentValue > 0 ? currentValue : 0;
  };

  const handleValidateDate = () => {
    setValidatedDate(selectedDate);
  };

  return (
    <div className="container mt-5 bg-light text-dark p-5 rounded-lg shadow-lg animated fadeIn">
      <h1 className="text-center mb-4 text-primary animated bounceIn">Aperçu du Patrimoine</h1>

      <div className="mb-4">
        <label htmlFor="dateSelect" className="form-label">Sélectionner la date :</label>
        <div className="input-group">
          <input
            type="date"
            id="dateSelect"
            className="form-control"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <button className="btn btn-success ms-2" onClick={handleValidateDate}>
            <FaCheckCircle /> Valider
          </button>
        </div>
      </div>

      {persons.length === 0 ? (
        <p className="text-warning">Aucune donnée disponible.</p>
      ) : (
        <div>
          {persons.map((person, index) => (
            <div key={index} className="mb-4 animated fadeIn">
              <h3 className="text-success">
                {person.nom}'s Total Wealth on {validatedDate}: {Number(patrimoineTotals[person.nom] || 0).toFixed(2)} Ar
              </h3>
              <table className="table table-striped table-hover">
                <thead className="bg-primary text-light">
                  <tr>
                    <th>Description</th>
                    <th>Initial Value</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Depreciation Rate</th>
                    <th>Current Value on {validatedDate}</th>
                  </tr>
                </thead>
                <tbody>
                  {person.possessions.map((possession, posIndex) => (
                    <tr key={posIndex}>
                      <td>{possession.libelle}</td>
                      <td>{possession.valeur} Ar</td>
                      <td>{new Date(possession.dateDebut).toLocaleDateString()}</td>
                      <td>{possession.dateFin ? new Date(possession.dateFin).toLocaleDateString() : "N/A"}</td>
                      <td>{possession.tauxAmortissement !== null ? `${possession.tauxAmortissement} %` : "N/A"}</td>
                      <td>{Number(calculatePossessionValue(possession, validatedDate)).toFixed(2)} Ar</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}

          <div className="mt-5">
            <Chart patrimoineHistory={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PatrimoineApp;
