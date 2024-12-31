const { exec } = require("child_process");

// Define the command to run the Python script
const RunPython = () => {
  const command = 'python3 lyric.py "adele" "easy on me"';

  // Use exec to run the Python script
  exec(command, (err, stdout, stderr) => {
    if (err) {
      // Handle error if Python script fails
      console.error(`exec error: ${err}`);
      return;
    }

    if (stderr) {
      // Handle any standard error from the Python script
      console.error(`stderr: ${stderr}`);
      return;
    }

    // Output the result from Python script
    console.log(`stdout: ${stdout}`);
  });
};

export default RunPython;
