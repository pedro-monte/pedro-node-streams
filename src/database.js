import fs from 'node:fs/promises'; // Persists on files with promises

//Deal with paths, modern 
console.log(import.meta.url);

const databasePath = new URL('db.json', import.meta.url);

export default class Database {
  #database = {};

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then(data => {
        this.#database = JSON.parse(data);
      })
      .catch(() => {
        this.#persist();
      });
  }

  #persist () {
    fs.writeFile('db.json', JSON.stringify(this.#database));
  }

  select(table, search) {
    let data = this.#database[table] ?? [];

    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => {
          return row[key]?.includes(value);
        });
      });
    }

    return data;
  }

  insert(table, data) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data);
    } else {
      this.#database[table] = [data];
    }

    return data;
  }
  delete(table, id) {


    const rowIndex = this.#database[table].findIndex(row => row.id === id);

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1);
      this.#persist();
      return true;
    }

    return false;
  }
  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id);
    

    
    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, ...data };
      this.#persist();
      return true;
    } 
    return false;
  }
}
