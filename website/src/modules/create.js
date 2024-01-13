import {useCallback} from "react";
import lodash from "lodash";
import axios from "axios";

export function createNote(title, isOnline = true) {
    return new Promise((resolve, reject) => {
        if (isOnline) {
            void axios
                .put('http://localhost:3030/notes', {
                    title,
                })
                .then((res) => {
                    if (res.data.status === 'ok') {
                        resolve(res.data);
                    }
                }).catch(reject);
        } else {
            // ...
        }
    })
}