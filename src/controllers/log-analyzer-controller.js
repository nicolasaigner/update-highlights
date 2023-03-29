import fs from 'fs';
import path from 'path';

class LogAnalyzerController {
  constructor() {
    this.logsPath = path.join(process.cwd(), 'logs');
  }

  async getLogs() {
    const logs = [];

    const searchDir = (dirPath) => {
      const files = fs.readdirSync(dirPath, { withFileTypes: true });
      for (const file of files) {
        const fullPath = path.join(dirPath, file.name);
        if (file.isDirectory()) {
          searchDir(fullPath);
        } else if (file.isFile() && file.name.endsWith('.log')) {
          logs.push({ name: file.name, path: fullPath });
        }
      }
    };

    searchDir(this.logsPath);

    return logs;
  }
}

export default LogAnalyzerController;
