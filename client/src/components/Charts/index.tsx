import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from "chart.js";

// Register required components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the TypeScript interface for props
interface LineChartProps {
  labels: string[]; // Single set of labels for the x-axis
  datasets: { label: string; data: number[]; backgroundColor: string }[]; // Array of multiple datasets
  title: string;
}

// Define the LineChart component
const LineChart = ({ labels, datasets, title }: LineChartProps): JSX.Element => {
  // Create chart data using the props
  const data: ChartData<"line"> = {
    labels: labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.backgroundColor, // Add border color to line chart
      fill: false, // Do not fill the area under the line
      tension: 0.4, // Smooth the lines (optional)
    })),
  };

  // Chart options
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "white", // Set legend text color to white
          font: {
            family: "JetBrainsMono-Regular", // Set font to JetBrainsMono-Regular
            size: 14, // You can adjust the font size as needed
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: "white", // Set title text color to white
        font: {
          family: "JetBrainsMono-Regular", // Set font to JetBrainsMono-Regular
          size: 16, // You can adjust the font size as needed
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color: "white", // Set x-axis ticks (labels) color to white
          font: {
            family: "JetBrainsMono-Regular", // Set font to JetBrainsMono-Regular
            size: 12, // You can adjust the font size as needed
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color: "white", // Set y-axis ticks (labels) color to white
          font: {
            family: "JetBrainsMono-Regular", // Set font to JetBrainsMono-Regular
            size: 12, // You can adjust the font size as needed
          },
        },
      },
    },
  };

  return <Line className="bg-glass !p-2 !w-full text-white" data={data} options={options} />;
};

export default LineChart;
