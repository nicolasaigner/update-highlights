
import path from 'path';
import LogAnalyzerController from './log-analyzer-controller.js';
import LogReaderController from './log-reader-controller.js';


class AppController {
  constructor() {
    this.logAnalyzer = new LogAnalyzerController();
  }

  async getLogsObjects() {
    const logFiles = await this.logAnalyzer.getLogFiles();
    const logs = await Promise.all(logFiles.map(async logFile => {
      const name = path.basename(logFile);
      const logReader = new LogReaderController(logFile);
      const logContent = await logReader.read();
      if (logContent.length > 0) {
        return {
          name,
          size: logContent.length,
          logs: logContent
        }
      } else {
        return {
          name,
          size: 0,
          logs: []
        }
      }
    }));
    return logs;
  }

  async run() {
    let logsObjects = await this.getLogsObjects();
    console.log('logsObjects', logsObjects);

    logsObjects[0].logs.forEach((item) => {
     console.log('ITEM', item);
    });
    this.temp();
  }

}

export default AppController;
