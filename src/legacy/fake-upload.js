import { Readable } from "node:stream";

class OneToHundredStream extends Readable {
  index = 1;

  // _read é obrigatório de todo Readable
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i >= 5) {
        // já não tem mais info para enviar
        // push envia de dentro da stream
        this.push(null);
      } else {
        const buf = Buffer.from(String(i));
        this.push(buf);
      }
    }, 1000);
  }
}

fetch("http://localhost:3334", {
  method: "POST",
  body: new OneToHundredStream(),
  duplex: "half",
})
  .then((response) => {
    return response.text();
  })
  .then((data) => {
    console.log(data);
  });
