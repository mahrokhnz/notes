import axios from "axios";

export default function deleteNote(id, isOnline = true) {
  return new Promise((resolve, reject) => {
    if (isOnline) {
      void axios
        .delete(`http://localhost:3030/notes/${id}`)
        .then((res) => {
          if (res.data.status === "ok") {
            resolve(res.data);
          }
        })
        .catch(reject);
    } else {
      console.log(`${isOnline} Delete`);
    }
  });
}
