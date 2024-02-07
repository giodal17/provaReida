import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
export const environment = {
    urlToDb: "https://databasereida-240f.restdb.io/rest/db",
    xApiKey: "65bcbd653b43c210ffb720ca",
    firebaseConfig: {
        apiKey: "AIzaSyCuGi_UPw2TY11fdBB7AvEC8-ajGMISCu8",
        authDomain: "reidaprova.firebaseapp.com",
        databaseURL: "https://reidaprova-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "reidaprova",
        storageBucket: "reidaprova.appspot.com",
        messagingSenderId: "638479874058",
        appId: "1:638479874058:web:bd36c00c72a3ad092c47f3",
        measurementId: "G-NB9GDB7EXV"
      }
} 
const app = initializeApp(environment.firebaseConfig);
const analytics = getAnalytics(app);
  
  