import { JsonDB, Config } from 'node-json-db';

class JSONDBService {
  constructor(databaseName, saveOnPush = true, humanReadable = true) {
    this.db = new JsonDB(new Config(databaseName, saveOnPush, humanReadable, '/', true));
  }

  getData() {
    return this.db.getData('/');
  }

  push(path, data) {
    this.db.push(path, data);
  }

  save() {
    this.db.save();
  }
}

export default JSONDBService;
