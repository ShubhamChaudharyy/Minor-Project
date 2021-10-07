import { initializeApp } from "firebase/app";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import {
  getStorage,
  ref as storeRef,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

import config from "./constant";
class FirebaseClass {
  constructor() {
    this.app = initializeApp(config);
    this.db = getDatabase(this.app);
  }

  setData = () => {
    set(dbRef(this.db, "users/"), {
      email: "hey",
      profile_picture: "hey",
    });
  };

  storeImage = (file, cb) => {
    const storage = getStorage();
    const storageRef = storeRef(storage, `${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done", file.name);
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused", file.name);
            break;
          case "running":
            console.log("Upload is running", file.name);
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        // Handle successful uploads on complete
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          cb(downloadURL, file.name);
        });
      }
    );
  };
}
export default FirebaseClass;
