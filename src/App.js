import { Oval } from "react-loader-spinner";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFrown } from "@fortawesome/free-solid-svg-icons";
import "./App.css";

function Grp204WeatherApp() {
  const [input, setInput] = useState("");
  const [weather, setWeather] = useState({
    loading: false,
    data: {},
    error: false,
  });
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const toDateFunction = () => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date().toLocaleDateString(undefined, options);
  };

  const search = async (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (input.trim() === "") return;

      setWeather({ ...weather, loading: true });
      const url = "https://api.openweathermap.org/data/2.5/weather";
      const api_key = process.env.REACT_APP_API_KEY;

      try {
        const res = await axios.get(url, {
          params: { q: input, units: "metric", appid: api_key },
        });
        setWeather({ data: res.data, loading: false, error: false });
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setWeather({ ...weather, data: {}, error: true });
        setInput("");
      }
    }
  };

  const addToFavorites = (city) => {
    if (city && !favorites.includes(city)) {
      const updatedFavorites = [...favorites, city];
      setFavorites(updatedFavorites);
      localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
    }
  };

  return (
    <div className="App">
      <h1 className="app-name">Application Météo grp204</h1>
      <div className="search-bar">
        <input
          type="text"
          className="city-search"
          placeholder="Entrez le nom de la ville..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyPress={search}
        />
        <button onClick={() => addToFavorites(weather.data.name)}>
          Ajouter aux favoris
        </button>
      </div>
      {weather.loading && (
        <Oval type="Oval" color="black" height={100} width={100} />
      )}
      {weather.error && (
        <span className="error-message">
          <FontAwesomeIcon icon={faFrown} />
          <span>Ville introuvable</span>
        </span>
      )}
      {weather.data.main && (
        <div>
          <h2>
            {weather.data.name}, {weather.data.sys.country}
          </h2>
          <span>{toDateFunction()}</span>
          <img
            src={`https://openweathermap.org/img/wn/${weather.data.weather[0].icon}@2x.png`}
            alt={weather.data.weather[0].description}
          />
          <p>{Math.round(weather.data.main.temp)}°C</p>
          <p>Vitesse du vent : {weather.data.wind.speed} m/s</p>
        </div>
      )}
      <div className="favorites-list">
        {favorites.map((city, index) => (
          <div
            key={index}
            onClick={() => {
              setInput(city);
              search({ key: "Enter" });
            }}
            className="favorite-city"
          >
            {city}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Grp204WeatherApp;
