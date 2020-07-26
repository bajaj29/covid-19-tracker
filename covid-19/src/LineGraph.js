import React, {useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';
import numeral from 'numeral';

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    mainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0.0");
            },
        },
    },
    scales: {
        xAxes: [
            {
                type: "time",
                time: {
                    format: "MM/DD/YY",
                    tooltipFormat: "ll",
                },
            },
        ],
        yAxes: [
            {
                gridLines: {
                    display: false,
                },
                ticks: {
                    callback: function (value, index, values) {
                        return numeral(value).format("0a");
                    },
                },
            },
        ],
    },
}

const buildChartData = (data, casesType) => {
    let chartData = [];
    let lastDataPoint;
    console.log(casesType);

    for(let date in data[casesType]){
        if(lastDataPoint){
            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            };
            chartData.push(newDataPoint);
        }
        lastDataPoint = data[casesType][date];
    }
    return chartData;
};

function LineGraph({countryCode, casesType}) {
    const [data, setData] = useState({});
    const [color, setColor] = useState("#CC1034");
    const [backColor, setbackColor] = useState("rgba(204, 16, 52, 0.5)");

    useEffect(() => {
        const fetchData = async () => {
            const url = countryCode === 'worldwide' 
                ? "https://disease.sh/v3/covid-19/historical/all?lastdays=90" 
                : `https://disease.sh/v3/covid-19/historical/${countryCode}?lastdays=90`;
            await fetch(url)
            .then(response => response.json())
            .then(data => {
                console.log(countryCode);
                let chartData = countryCode === 'worldwide' ? buildChartData(data, casesType) : buildChartData(data.timeline, casesType);
                setData(chartData);
                if(casesType === 'recovered'){
                    setColor("#7dd71d");
                    setbackColor("rgba(125, 215, 29, 0.5)");
                } 
                else if(casesType === 'deaths'){
                    setColor("#CD5C5C");
                    setbackColor("rgba(204, 16, 52, 0.5)");
                }
                else{
                    setColor("#CC1034");
                    setbackColor("rgba(204, 16, 52, 0.5)");
                } 
            });
        };

        fetchData();
    }, [countryCode, casesType]);

    return (
        <div>
            {data && data.length > 0 && (
                <Line 
                    options={options} 
                    data={{
                        datasets: [
                            {
                                backgroundColor: backColor,
                                borderColor: color,
                                data: data
                            },
                        ],
                    }}
                />
            )}
        </div>
    )
}

export default LineGraph
