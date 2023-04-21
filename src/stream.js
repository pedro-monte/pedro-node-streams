import { Readable, Writable, Transform } from "node:stream";

//leitura
class OneToHundredStream extends Readable {
  index = 1;

  // _read é obrigatório de todo Readable
  _read() {
    const i = this.index++;

    setTimeout(() => {
      if (i >= 100) {
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

//stream de escrita

class MultiplyByTenStream extends Writable {
  _write(chunk, encoding, callback) {
    console.log(Number(chunk.toString()) * 10);
    callback();
  }
}

class InverseNumberStream extends Transform {
  _transform(chunk, encoding, callback) {
    const transformed = Number(chunk.toString()) * -1;
    callback(null, Buffer.from(String(transformed)));
  }
}

//new OneToHundredStream().pipe(process.stdout)

new OneToHundredStream()
  .pipe(new InverseNumberStream())
  .pipe(new MultiplyByTenStream());
