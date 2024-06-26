import axios from "axios";

export default function createNote(title, isOnline = true) {
  return new Promise((resolve, reject) => {
    if (isOnline) {
      void axios
        .put("http://localhost:3030/notes", {
          title,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            resolve(res.data);
          }
        })
        .catch(reject);
    } else {
      console.log(`${isOnline} Create`);
    }
  });
}
