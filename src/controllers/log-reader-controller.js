import fs from 'fs/promises';

class LogReaderController {
    constructor(filePath) {
        this.filePath = filePath;
    }

    async read() {
        const logData = await fs.readFile(this.filePath, 'utf8');
        const regex = /\(INFO\) replay media event: ([\s\S]*?)\n\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2}/gm;
        const objects = [];
        let match;
        while ((match = regex.exec(logData)) !== null) {
            const jsonString = match[1];
            const obj = JSON.parse(jsonString);
            objects.push(obj);
        }

        return objects;
    }
}

export default LogReaderController;
