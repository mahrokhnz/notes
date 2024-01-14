import axios from "axios";

export default function updateNote(id, title, body, isOnline = true) {
  return new Promise((resolve, reject) => {
    if (isOnline) {
      void axios
        .post("http://localhost:3030/notes", {
          id,
          title,
          body,
        })
        .then((res) => {
          if (res.data.status === "ok") {
            resolve(res.data);
          }
        })
        .catch(reject);
    } else {
      console.log(`${isOnline} Update`);
    }
  });
}
