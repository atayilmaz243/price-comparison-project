import { collection, getDocs,query,where } from "firebase/firestore"; 
import {db} from "./firebase.js"




test('test',async () => {

  try {
    const ref = collection(db,'users');
    const q = query(ref,where('first','==','Ada'));

    const arr = await getDocs(q);
    arr.forEach((doc) => {
      console.log(doc.data());
    });

    // console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }

});

