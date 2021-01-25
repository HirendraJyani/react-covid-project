import React from "react";
import numeral from "numeral";
import {Circle, Popup} from "react-leaflet";

const casesTypeColors = {
    cases: {
        hex:"#cc1034",
        multiplayer:500,
    },
    recovered: {
        hex:"#7dd71d",
        multiplayer:900,
    },
    deaths: {
        hex:"#fb4443",
        multiplayer:1700,
    }
};

export const sortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a,b) => (a.cases > b.cases ? -1 : 1)); 
   
};

export const prettyPrintStat = (stat) => 
stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataMap = (data, casesType="cases") => (
   data.map(country => (
       <Circle
       center={[country.countryInfo.lat, country.countryInfo.long]}
       fillOpacity={0.4}
       color={casesTypeColors[casesType].hex}
       fillColor={casesTypeColors[casesType].hex}
       radius={
           Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplayer
       }
       >
           <Popup>
               <div className="info-container">
               <div 
               className="info-flag"
                 style={{backgroundImage: `url(${country.countryInfo.flag})`}}
                />
               <div className="info-name">{country.country}</div>
               <div className="info-confirmed">Cases:{numeral(country.cases).format("0.0")}</div>
               <div className="info-recovered">Recovered:{numeral(country.recovred).format("0.0")}</div>
               <div className="info-deaths">Deaths: {numeral(country.deaths).format("0.0")}</div>
               </div>
            </Popup>
       </Circle>
   ))
);