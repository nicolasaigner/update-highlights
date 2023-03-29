import fs from 'fs/promises';
import path from 'path';
import JSONDBService from '../services/jsondb-service.js';

class LogAnalyzerController {
  db = new JSONDBService('db');

  constructor() {
    this.logDirectoryPath = path.join(path.resolve(''), 'logs');
  }

  async getLogFiles() {
    const logFiles = [];
    const files = await fs.readdir(this.logDirectoryPath);

    for (const file of files) {
      const filePath = path.join(this.logDirectoryPath, file);
      const fileExtension = path.extname(file);

      // if (fileExtension === '.log' && !(await this.isFileProcessed(filePath))) {
      if (fileExtension === '.log') {
        logFiles.push(filePath);

        // const fileProcessed = await this.isFileProcessed(filePath);

        // append the file name log in JSON database
        await this.db.create('/logsFiles[]', {
          name: file,
          path: filePath,
          processed: false
        }, true);
      }
    }

    return logFiles;
  }

  async isFileProcessed(filePath) {
    let result = await this.db.getOneByAttribute('/logsFiles', {path: filePath});
    console.log('IS file processed', result);
    if (result === null) {
      return false;
    }
    return result.processed;
  }

  async markFileAsProcessed(filePath) {
    let fileObject = await this.db.getOneByAttribute('/logsFiles', {path: filePath});
  
    console.log('fileObject', fileObject);
    if (fileObject) {
      this.db.update(`logsFiles/`, fileObject.id, {processed: true});
    }
  }

  registerError(error) {
    this.db.create('errors', {
      message: error.message,
      stack: error.stack,
      timestamp: new Date()
    });
  }
}

export default LogAnalyzerController;
