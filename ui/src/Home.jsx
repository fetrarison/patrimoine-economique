import React from "react";
import { Link } from "react-router-dom";
import Chart from "./components/chart/LineChart";

const Home = () => {
  return (
    <div className="container mt-5 bg-light text-dark p-5 rounded-lg shadow-lg">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-primary">
        Wealth App
      </h1>
      
      <p className="text-center text-lg mb-8">
        WELCOME TO MY APPS
      </p>
      <div className="text-center">
        <button className="btn btn-primary py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
          <Link className="nav-link text-white" to="/show">
            View
          </Link>
        </button>
      </div>
    </div>
  );
};

export default Home;
