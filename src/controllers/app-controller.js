import fs from 'fs';
import path from 'path';
import LogAnalyzerController from './log-analyzer-controller.js';
import JSONDBService from '../services/jsondb-service.js';

class AppController {
  constructor() {
    this.jsondbService = new JSONDBService('db');
    this.logAnalyzer = new LogAnalyzerController();
  }

  async run() {
    const logs = await this.logAnalyzer.getLogs();
    await this.saveLogsToDB(logs);
  }

  async saveLogsToDB(logs) {
    const highLightsLogs = [];
    const matchersLogs = [];

    let tempResult = {
      highLightsLogs: [],
      matchersLogs: []
    };

    logs.forEach((log, index) => {
      const filePath = log.path;
      const fileName = path.basename(filePath);

      if (fileName.startsWith('highlights') && fileName.endsWith('.log')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const regex = /\(INFO\) replay media event: ([\s\S]*?)\n\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/gm;
        // const matches = [...content.matchAll(regex)];
        const objects = [];
        let match;
        while ((match = regex.exec(content)) !== null) {
          const jsonString = match[1];
          const obj = JSON.parse(jsonString);
          objects.push(obj);
        }

        highLightsLogs.push({
          name: fileName,
          path: filePath,
          processed: false,
          id: index,
          values: objects
        });        
        tempResult.highLightsLogs = highLightsLogs;
      }

      if (fileName.startsWith('background.html') && fileName.endsWith('.log')) {
        const content = fs.readFileSync(filePath, 'utf8');
        const regex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3} \(INFO\) \<\/js\/chunk-vendors.js> \(:1\) - \[Overwolf \| Extension Service\] Update status: UpToDate\n^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2},\d{3} \(INFO\) \<\/js\/chunk-vendors.js> \(:1\) - /gm;
        const regexCode = /\{[\s\S]*\}/gm;
        const objects = [];
        for (const m of content.matchAll(regex)) {
          const objMatch = regexCode.exec(content.slice(m.index));
          if (objMatch) {
            objects.push(JSON.parse(objMatch[0]));
          }
        }
        if (objects.length > 0) {
          matchersLogs.push({
            name: fileName,
            path: filePath,
            processed: false,
            id: index,
            values: objects
          });
          tempResult.matchersLogs = matchersLogs;
        }
      }
    });
    this.jsondbService.push('/', tempResult);
    // console.log('tempResult', tempResult.matchersLogs[0].values[0].data.game.profile.matches.competitive);
  }
}

export default AppController;
