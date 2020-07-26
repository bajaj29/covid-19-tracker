import React from 'react';
import "./Map.css";
import { Map as Leaflet, Popup, TileLayer, Circle } from 'react-leaflet';
import numeral from 'numeral';


const casesTypeColors = {
    cases: {
        hex : "#CC1034",
        multiplier : 80000
    },
    recovered: {
        hex : "#7dd71d",
        multiplier : 120000
    },
    deaths: {
        hex : "#CD5C5C",
        multiplier : 200000
    }

};

function Map({countries, casesType, center, zoom}) {
    return (
        <div className="map">
            <Leaflet center={center} zoom={zoom}>
                <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {countries.map(country => (
                        <Circle
                            center={[country.countryInfo.lat, country.countryInfo.long]}
                            fillOpacity={0.4}
                            color={casesTypeColors[casesType].hex}
                            fillColor={casesTypeColors[casesType].hex}
                            radius={
                                Math.sqrt(country[casesType] * casesTypeColors[casesType].multiplier)
                            }
                        >
                            <Popup>
                                <div className="info__container">
                                    <div className="info__flag" style={{ backgroundImage: `url(${country.countryInfo.flag})`}}></div>
                                    <div>{country.country}</div>
                                    <div>Cases: {numeral(country.cases).format("0,0")}</div>
                                    <div>Recovered: {numeral(country.recovered).format("0,0")}</div>
                                    <div>Deaths: {numeral(country.deaths).format("0,0")}</div>
                                </div>
                            </Popup>
                        </Circle>
                ))}
            </Leaflet>
        </div>
    )
}

export default Map
