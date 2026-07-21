const { exec } = require("child_process");

const RunPython = () => {
  const command = 'python3 lyric.py "adele" "easy on me"';

  exec(command, (err, stdout, stderr) => {
    if (err) {
      console.error(`exec error: ${err}`);
      return;
    }

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`stdout: ${stdout}`);
  });
};

export default RunPython;
