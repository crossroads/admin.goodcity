const { execSync } = require("child_process");
const path = require("path");
const shell_script = path.join(__dirname, "../scripts/delete_arch.sh");
execSync("sh " + shell_script);
