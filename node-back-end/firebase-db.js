import { collection,doc, setDoc,addDoc,getDocs,getDoc,query,where, updateDoc ,orderBy,limit} from "firebase/firestore"; 
import {db} from "./firebase.js"
import { GetProductByList } from "./database.js";

export async function UpdateUser(id,list)
{
  try {
    const userRef = doc(db,'users',id);
    await setDoc(userRef,{
      list: list
    });
  } catch (e) {
    console.log('error createUser:');
    console.log(e);
  }
}


export async function GetUserList(id)
{
  const usersRef = doc(db,'users',id);
  const userDoc = await getDoc(usersRef);
  if (userDoc.exists())
  {
    const data = userDoc.data();
    return data.list;
  }
  else
  {
    throw new Error("user not exists");
  }
}

export async function IncView(id)
{
  const usersRef = doc(db,'products',id);
  try {
    const userDoc = await getDoc(usersRef);
    if (userDoc.exists())
    {
      const data = userDoc.data();
      const updated = {
        view : data.view+1
      }
      await updateDoc(usersRef,updated);
    }
    else
    {
      setDoc(usersRef,{
        view: 1,
        follow : 0,
      });
    }
  } catch (e) {
    console.log(e);
    throw new Error("product not exist");
  }
}

export async function ChangePFollow(id,change)
{
  const usersRef = doc(db,'products',id);
  try {
    const userDoc = await getDoc(usersRef);
    if (userDoc.exists())
    {
      const data = userDoc.data();
      const updated = {
        follow : data.follow + change
      }
      await updateDoc(usersRef,updated);
    }
    else
    {
      setDoc(usersRef,{
        view: 0,
        follow : 0,
      });
    }
  } catch (e) {
    console.log(e);
    throw new Error("product not exist");
  }
}

export async function getMostViewed()
{
  try {
    const q = query(collection(db, "products"), orderBy("view", "desc"), limit(12));
    const querySnapshot = await getDocs(q);
    const list = querySnapshot.docs.map((doc) => {
      return doc.id;
    });
    const data = await GetProductByList(list);

    return data;

  } catch (e) {
    console.log(e);
    throw new Error("error getting most viewed");
  }
}


export async function getMostFollowed()
{
  try {
    const q = query(collection(db, "products"), orderBy("follow", "desc"), limit(12));
    const querySnapshot = await getDocs(q);

    const list = querySnapshot.docs.map((doc) => {
      return doc.id;
    });


    const data = await GetProductByList(list);

    return data;
    
  } catch (e) {
    console.log(e);
    throw new Error("error getting most followed");
  }
}










