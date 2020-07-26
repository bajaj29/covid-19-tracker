import React, {useState, useEffect} from 'react';
import {FormControl, Select, MenuItem, Card, CardContent} from '@material-ui/core';
import InfoBox from './InfoBox';
import './App.css';
import Map from './Map';
import Table from './Table';
import { sortData , mapPieData} from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import { Pie } from 'react-chartjs-2';
import CheckIcon from '@material-ui/icons/Check';
var handWashImage = require('../src/images/washing-hands.png');
var wearMaskImage = require('../src/images/wear_mask.png');
var handShakeImage = require('../src/images/hand-shake.jpg');
var stayHomeImage = require('../src/images/stay-home.jpg');
var covidImage = require('../src/images/corona.jpg');

//https://disease.sh/v3/covid-19/countries

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796});
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [pieData, setPieData] = useState({});
	const [caseType, setCaseType] = useState("cases");

	useEffect(() => {
		const getCountryInfo = async () => {
			await fetch("https://disease.sh/v3/covid-19/all")
			.then(response => response.json())
			.then(data => {
				setCountryInfo(data);
				const countryPieData = mapPieData([data.cases, data.recovered, data.deaths]);
				setPieData(countryPieData);
			});
		};
		getCountryInfo();
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch("https://disease.sh/v3/covid-19/countries")
			.then(response => response.json())
			.then(data => {
				var countries = data.map(country => ({
					name : country.country,
					value : country.countryInfo.iso2
				}));

			const sortedData = sortData(data);
			setTableData(sortedData);
			setMapCountries(data);	
			setCountries(countries);
			});
		};
		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;
		const url = countryCode === 'worldwide' 
			? "https://disease.sh/v3/covid-19/all" 
			: `https://disease.sh/v3/covid-19/countries/${countryCode}`;

		await fetch(url)
		.then(response => response.json())
		.then(data => {
			setCountry(countryCode);
			setCountryInfo(data);
			countryCode === 'worldwide' ? setMapCenter([34.80746, -40.4796]) : setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
			setMapZoom(4);
			const countryPieData = mapPieData([data.cases, data.recovered, data.deaths]);
			setPieData(countryPieData);
		});
	}

	return (
		<div className="main">
			<div className="app">
				<div className="app__left">
					<div className="app__header">	
						<div style={{display: "flex"}}>
							<img className="app__image" src={covidImage} style={{ width:"50px", height:"40px"}}></img>
							<h1 className="app__name" style={{color: "#CC1034"}}>NOVEL COVID-19</h1>
						</div>
						<FormControl className="app__dropdown">
							<Select
								variant="outlined"
								value={country}
								onChange={onCountryChange}
							>
								<MenuItem value="worldwide">Worldwide</MenuItem>
								{countries.map(country => (
									<MenuItem value={country.value}>{country.name}</MenuItem>
								))} 
							</Select>
						</FormControl>
					</div>
					<div className="app__stats">
						<InfoBox onClick={e => setCaseType('cases')} isRed active={caseType === 'cases'} title="Coronovirus Cases" total={countryInfo.cases} cases={countryInfo.todayCases}/>
						<InfoBox onClick={e => setCaseType('recovered')} active={caseType === 'recovered'} title="Recovered"  total={countryInfo.recovered} cases={countryInfo.todayRecovered}/>
						<InfoBox onClick={e => setCaseType('deaths')} isRed active={caseType === 'deaths'} title="Deaths"  total={countryInfo.deaths} cases={countryInfo.todayDeaths}/>
					</div>
					<Map className="app__map" countries={mapCountries} center={mapCenter} zoom={mapZoom} casesType={caseType}/>
				</div>
				<Card className="app__right">
					<CardContent>
						<h3>Live Cases by Country</h3>
						<Table countries={tableData}/>
					</CardContent>
					{country !== 'worldwide' ? (<h3 style={{marginLeft:'20px'}}>{countryInfo.country} Cases - Pie Chart</h3>) : (<h3 style={{marginLeft:'20px'}}>Worldwide Cases - Pie Chart</h3>)}<br/>
					<Pie className="app__piechart"
						data={pieData}
						options={{
							legend:{
							display:true,
							position:'bottom'
							}
						}}
					/>
					<p style={{textAlign:"center"}}>Total Population : {countryInfo.population}</p>
				</Card>
			</div>
			<div className="app__info">
				<Card className="info__graph">
					<CardContent>
						{country !== 'worldwide' ? (<h3>{countryInfo.country} new {caseType} by day</h3>) : (<h3>Worldwide new {caseType} by day</h3>)}<br/>
						<LineGraph countryCode={country} casesType={caseType}/>
					</CardContent>
				</Card>
				<div className="info__spread">
					<div className="spread_title">
						<div className="spread_title_custom">SPREAD</div>
						<h1 className="spread_ques"><span style={{color: "#fc7b3b", fontWeight: 400}}>How</span> <span style={{fontWeight: 700}}>Virus Spreads</span></h1>
					</div>
					<br/>
					<p>Though COVID-19 is thought to spread mainly from person to person, we are still learning how it spreads. The virus spreads through:</p>
					<ul className="spread_list">
						<li className="list_item"><CheckIcon className="circle_icon"/><span className="list_text">From a close contact with an infected person</span></li>
						<li className="list_item"><CheckIcon className="circle_icon"/><span className="list_text">Droplets from infected person’s cough or sneeze</span></li>
						<li className="list_item"><CheckIcon className="circle_icon"/><span className="list_text">Touching objects that have sneeze droplets</span></li>
					</ul>
				</div>
			</div>
			<div className="app_precaution">
				<div className="precaution_title">
					<span className="title_custom">Precautions</span>
					<div className="title_custom_embed">
						<div>
							<h2>
								<span className="title_imp">Important</span>
								<span className="title_prec"> Precautions</span>
							</h2>
						</div>
						&nbsp;&nbsp;&nbsp;&nbsp;
						<div>
							<h4 className="title_ques">
								<span className="ques_text">What</span>
								<span> You Should Know</span>
							</h4>
						</div>
					</div>
				</div>
				<div className="precaution_content">
					<Card className="content_card">
						<CardContent>
							<img src={handWashImage} style={{ width:"100px", height:"100px"}}></img>
							<div style={{fontSize: "1.125rem", lineHeight: "1.35", marginTop: "1rem", fontWeight: "500", color: "#212836"}}>Wash Your Hands For 20sec</div>
							<div style={{marginTop: ".875rem"}}>It is recommended to wash your hands with anti bacterial soap for atleast 20 seconds.</div>
						</CardContent>
					</Card>
					<Card className="content_card">
						<CardContent>
							<img src={stayHomeImage} style={{ width:"100px", height:"100px"}}></img>
							<div style={{fontSize: "1.125rem", lineHeight: "1.35", marginTop: "1rem", fontWeight: "500", color: "#212836"}}>Stay at Home</div>
							<div style={{marginTop: ".875rem"}}>Practice social distancing and don’t leave your your home without any urgent need to stay safe.</div>
						</CardContent>
					</Card>
					<Card className="content_card">
						<CardContent>
							<img src={wearMaskImage} style={{ width:"100px", height:"100px"}}></img>
							<div style={{fontSize: "1.125rem", lineHeight: "1.35", marginTop: "1rem", fontWeight: "500", color: "#212836"}}>Wear a mask if available</div>
							<div style={{marginTop: ".875rem"}}>A face mask is a must if you have symptoms of cold, flu, COVID-19 or other viruses and infections.</div>
						</CardContent>
					</Card>
					<Card className="content_card">
						<CardContent>
							<img src={handShakeImage} style={{ width:"100px", height:"100px"}}></img>
							<div style={{fontSize: "1.125rem", lineHeight: "1.35", marginTop: "1rem", fontWeight: "500", color: "#212836"}}>Avoid direct contact</div>
							<div style={{marginTop: ".875rem"}}>Avoiding any direct contact allows you to increase your protection from the emerged COVID-19 virus.</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

export default App
