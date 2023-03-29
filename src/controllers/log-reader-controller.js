import fs from 'fs';

class LogReaderController {
  constructor(path) {
    this.path = path;
  }

  read() {
    return new Promise((resolve, reject) => {
      fs.readFile(this.path, 'utf-8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  }
}

export default LogReaderController;
