const fs = require('fs');

class DataFolder {
  constructor(filePath) {
    this.filePath = filePath;
    this.data = [];
  }
  load() {
    if (fs.existsSync(this.filePath)) {
      const content = fs.readFileSync(this.filePath, 'utf8') || '[]';
      this.data = JSON.parse(content);
    }
  }
  saveData(list) {
    this.data = list;
    const content = JSON.stringify(this.data);
    fs.writeFile(this.filePath, content, () => {});
  }
  get list() {
    return [...this.data];
  }
}

module.exports = { DataFolder };
