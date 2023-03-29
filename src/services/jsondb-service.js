import { JsonDB, Config } from 'node-json-db';
import fs from 'fs';


class JSONDBService {

    db = new JsonDB();

    constructor(dbPath) {
        this.db = new JsonDB(new Config(dbPath, true, true, '/', true));

        // Verifica se o atributo 'logsFiles' existe no banco de dados, caso contrário cria.
        this.checkIfDatabaseExists();
    }

    async checkIfDatabaseExists() {
        this.db.getData('/logsFiles').catch(async (err) => {
            if (err) {
                await this.db.push('/logsFiles', []);
                await this.checkIfDatabaseExists();
            }
        });
    }

    getAll(key) {

        return this.db.getData(key).then((data) => {
            return data;
        }).catch(async (err) => {
            if (err) {
                await this.db.push(key, []);
                this.getAll(key);
            }
        });
    }

    getOne(key, id) {
        try {
            return this.db.getData(`${key}[${id}]`);
        } catch (error) {
            return null;
        }
    }

    async getOneByAttribute(key, attribute) {

        let keyObj = Object.keys(attribute);
        if (keyObj.length > 0) {
            keyObj = keyObj[0];
        } else {
            throw new Error('Attribute not found. Please, attribute must be a object: {key: value}');
        }

        await this.checkIfDatabaseExists();
        const records = await this.db.getData(key);

        console.log('RECORDS', records);
        if (records.length > 0) {
            let find = records.find(record => record[keyObj] === attribute[keyObj]);
            return find;
        }

        return null;
    }


    async create(key, data, array = false) {
        await this.checkIfDatabaseExists();
        const records = await this.getAll(key.replace('[]', ''));
        const id = records && records.length > 0 ? records[records.length - 1].id + 1 : 0;
        const filter = records.find(record => record.name === data.name);
        if (filter) {
            return filter;
        }
        data.id = id;
        await this.db.push(key, data, array);
        return data;
    }

    update(key, id, data) {
        console.log('RECORD UPDATE', key, id, data);
        return null;
        const record = this.getOne(key, id);
        if (!record) return null;
        data.id = record.id;
        this.db.push(`${key}[${id}]`, data);
        return data;
    }

    async delete(key, id) {
        const record = await this.getOne(key, id);
        if (!record) return null;
        this.db.delete(`${key}[${id}]`);
        fs.renameSync(record.path, `${record.path}.deleted`);
        return record;
    }
}

export default JSONDBService;
