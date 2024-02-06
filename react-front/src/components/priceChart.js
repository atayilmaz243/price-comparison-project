// Import Chart.js along with the Line component from react-chartjs-2
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';  // Importing the core chart library

// Define your data and options

// Create a React functional component
function PriceChart({data,options}) {
  return (
      <Line data={data} options = {options}/>
  );
}

export default PriceChart;
