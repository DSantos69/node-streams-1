import axios from "axios";
import { Transform, Writable } from "stream";
const url = "http://localhost:3000";

function isJsonString(string) {
  try {
    JSON.parse(string);
  } catch (error) {
    return false;
  }

  return true;
}

async function consume() {
  const response = await axios({
    url,
    method: "get",
    responseType: "stream",
  });

  return response.data;
}

const stream = await consume();

stream
  .pipe(
    new Transform({
      transform(chunk, encoding, callback) {
        let item;

        if (isJsonString(chunk)) item = JSON.parse(chunk);
        else item = "error";

        if (item != "error") item = /\d+/.exec(item.name)[0];

        callback(null, JSON.stringify(item));
      },
    })
  )
  .pipe(
    new Writable({
      write(chunk, encoding, callback) {
        console.log("receiving: ", chunk.toString());

        callback();
      },
    })
  );
