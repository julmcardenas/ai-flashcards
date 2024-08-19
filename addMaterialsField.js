import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase.js";  // Notice the ".js" extension

async function addMaterialsFieldToDocuments() {
    const usersCollection = collection(db, "users");  // Adjust this to match your collection name
    const usersSnapshot = await getDocs(usersCollection);

    usersSnapshot.forEach(async (userDoc) => {
        const data = userDoc.data();
        if (!data.materials) {
            // If materials array doesn't exist, add it
            await updateDoc(doc(usersCollection, userDoc.id), {
                materials: []
            });
            console.log(`Added materials array to document ID: ${userDoc.id}`);
        }
    });
}

// Run the script
addMaterialsFieldToDocuments()
    .then(() => console.log("Finished updating documents."))
    .catch((error) => console.error("Error updating documents:", error));
