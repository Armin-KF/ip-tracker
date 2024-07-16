import { useMap } from "react-leaflet";
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./App.css";

const UpdateMapCenter = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], map.getZoom());
    }
  }, [lat, lng, map]);

  return null;
};

function App() {
  const [ipInfo, setIpInfo] = useState({
    ip: "",
    location: "",
    timezone: "",
    isp: "",
    lat: 51.505,
    lng: -0.09,
  });
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    fetchIpInfo();
  }, []);

  const fetchIpInfo = async (query = "") => {
    const apiKey = process.env.REACT_APP_API_KEY;
    const url = `https://geo.ipify.org/api/v2/country,city?apiKey=${apiKey}&ipAddress=${query}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setIpInfo({
        ip: data.ip,
        location: `${data.location.city}, ${data.location.country}`,
        timezone: `UTC ${data.location.timezone}`,
        isp: data.isp,
        lat: data.location.lat,
        lng: data.location.lng,
      });
    } catch (error) {
      console.error("Failed to fetch IP information");
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = () => {
    fetchIpInfo(inputValue);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div id="upper-part">
          <div>
            <h1 id="title">IP Address Tracker</h1>
            <input
              id="search-bar"
              type="text"
              placeholder="Search for any IP address or domain"
              value={inputValue}
              onChange={handleInputChange}
            />
            <button id="submit-btn" onClick={handleSearch}>
              {" "}
              {">"}{" "}
            </button>
          </div>
          <div id="info-bar">
            <p id="ip-p">IP ADDRESS</p>
            <h1 id="ip-h1">{ipInfo.ip}</h1>
            <div className="line"></div>
            <p id="location-p">LOCATION</p>
            <h1 id="location-h1">{ipInfo.location}</h1>
            <div className="line-2"></div>
            <p id="timezone-p">TIMEZONE</p>
            <h1 id="timezone-h1">{ipInfo.timezone}</h1>
            <div className="line-3"></div>
            <p id="isp-p">ISP</p>
            <h1 id="isp-h1">{ipInfo.isp}</h1>
          </div>
        </div>
        <div
          id="map"
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            marginTop: "0px",
            zIndex: "0",
          }}
        >
          <MapContainer
            center={[ipInfo.lat, ipInfo.lng]}
            zoom={13}
            style={{
              height: "100%",
              width: "100%",
              border: "none",
              position: "absolute",
            }}
            zoomControl={false}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            <UpdateMapCenter lat={ipInfo.lat} lng={ipInfo.lng} />
          </MapContainer>
        </div>
      </header>
    </div>
  );
}

export default App;
