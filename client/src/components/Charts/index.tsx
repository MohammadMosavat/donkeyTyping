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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  labels: string[];
  datasets: { label: string; data: number[]; backgroundColor: string }[];
  title: string;
}

const LineChart = ({ labels, datasets, title }: LineChartProps): JSX.Element => {
  const data: ChartData<"line"> = {
    labels: labels,
    datasets: datasets.map((dataset) => ({
      label: dataset.label,
      data: dataset.data,
      backgroundColor: dataset.backgroundColor,
      borderColor: dataset.backgroundColor,
      fill: false,
      tension: 0.4,
    })),
  };

  const rootStyles = getComputedStyle(document.documentElement);
  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color:  rootStyles.getPropertyValue("--primary").trim() || "#ffffff",
          font: {
            family: "JetBrainsMono-Regular",
            size: 14,
          },
        },
      },
      title: {
        display: true,
        text: title,
        color:  rootStyles.getPropertyValue("--primary").trim() || "#ffffff",
        font: {
          family: "JetBrainsMono-Regular",
          size: 16,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: {
          color:  rootStyles.getPropertyValue("--primary").trim() || "#ffffff",
          font: {
            family: "JetBrainsMono-Regular",
            size: 12,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          color:  rootStyles.getPropertyValue("--primary").trim() || "#ffffff",
          font: {
            family: "JetBrainsMono-Regular",
            size: 12,
          },
        },
      },
    },
  };

  return <Line className=" !p-2 !w-full text-primary" data={data} options={options} />;
};

export default LineChart;
