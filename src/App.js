import { Card, CardContent, FormControl, MenuItem, Select } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import './App.css';
import InfoBox from "./InfoBox.js";
import Map from "./Map.js";
import Table from "./Table.js";
import {sortData, prettyPrintStat} from "./util.js";
import LineGraph from "./LineGraph.js";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState(["USA","UK","INDIA"]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  console.log("lat and long >>>",mapCenter);
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
    .then(response => response.json())
    .then(data => {
      setCountryInfo(data);
    })
  },[])

  // https://disease.sh/v3/covid-19/countries

  useEffect(() =>{
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => (
          {
            name:country.country,
            value:country.countryInfo.iso2
          }
        ));
        const sortedData = sortData(data);
        setTableData(sortedData);
        setMapCountries(data);
        setCountries(countries);
      });
    }
    getCountriesData();
  },[]);

  const onCountryChange = async (event) => {
    const countryCode= event.target.value;

    const url = countryCode ===`worldwide` 
      ? `https://disease.sh/v3/covid-19/all` 
      : `https://disease.sh/v3/covid-19/countries/${countryCode}` 
    await fetch(url)
    .then(response => response.json())
    .then((data) => {
      setCountry(countryCode);
      setCountryInfo(data);

      setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
      setMapZoom(4);
    });
  };

  console.log("country info >>>",countryInfo);

  return (
    <div className="app">
      <div className="app__left">
      <div className="app__header">
        <h1>COVID 19 TRACKER</h1>
        <FormControl className="app__dropdown">
          <Select 
          onChange={onCountryChange}
          variant="outlined"
          value={country}>
            <MenuItem value="worldwide">Worldwide</MenuItem>
            {countries.map((country) => (
              <MenuItem value={country.value}>{country.name}</MenuItem>
            ))}
            
          </Select>
        </FormControl>
      </div>

      <div className="app__stats">
        <InfoBox
        isRed
        active={casesType === "cases"}
        onClick ={e=> setCasesType("cases")}
        title ="Coronavirus Cases"
        total={prettyPrintStat(countryInfo.cases)}
        cases={prettyPrintStat(countryInfo.todayCases)}
        />
        <InfoBox 
        active={casesType === "recovered"}
        onClick ={e=> setCasesType("recovered")}
        title="Recovered"
        total={prettyPrintStat(countryInfo.recovered)}
        cases={prettyPrintStat(countryInfo.todayRecovered)}
        />
        <InfoBox 
        isRed
        active={casesType === "deaths"}
        onClick ={e=> setCasesType("deaths")}
        title="Deaths"
        total={prettyPrintStat(countryInfo.deaths)}
        cases={prettyPrintStat(countryInfo.todayDeaths)}
        />
      </div>
      
      <Map 
      casesType={casesType}
      countries={mapCountries}
      center={mapCenter}
      zoom={mapZoom}
      />
      </div>

      <Card className="app__right" >
        <CardContent>
          <h3>Live cases</h3>
          <Table countries={tableData} />
          <h3 className="app__graphTitle">worldwide new {casesType}</h3>
          <LineGraph className= "app__graph" casesType={casesType}/>
        </CardContent>
      </Card>
      
    </div>
  );
}

export default App;
