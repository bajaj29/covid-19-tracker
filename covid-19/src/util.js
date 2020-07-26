import numeral from 'numeral';

export const sortData = (data) => {
    const sortedData = [...data];
    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
};

export const prettyPrintStat = (stat) => {
  return stat ? `+${numeral(stat).format("0.0a")}` : "+0";
};

export const mapPieData = (listData) => {
    const pieData = {
        labels: ['Total Cases', 'Recovered', 'Deaths'],
        datasets: [
          {
            label: 'Covid 19 ',
            height: 500,
            width: 500,
            backgroundColor: [
              '#CC1034',
              '#7dd71d',
              '#CD5C5C',
            ],
            hoverBackgroundColor: [
                '#FF7F50',
                '#7CFC00',
                '#FF0000',
            ],
            data: listData
          }
        ]
      };
    console.log(pieData);
    return pieData;
};
