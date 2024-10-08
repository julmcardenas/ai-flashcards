'use client'

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { usersRef } from "@/firebase";

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const router = useRouter();

    useEffect(() => {
        async function getFlashcards() {
            if (!user || !user.id) return;
    
            try {
                const docRef = doc(usersRef, user.id);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    const collections = docSnap.data().materials || [];
                    setFlashcards(collections);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching flashcards:", error);
            }
        }
        getFlashcards();
    }, [user]);
    

    if (!isLoaded || !isSignedIn) {
        return <>Loading...</>;
    }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`);
    };

    return (
        <div className="">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mx-8" onClick={() => router.back()}>Back</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mx-8">
                {flashcards.map((material, index) => (
                    <div
                        key={index}
                        className="relative group cursor-pointer"
                        onClick={() => handleCardClick(material.name)}
                    >
                        <div className="relative h-52 w-full">
                            <div className="absolute inset-0 flex items-center justify-center bg-white text-lg font-medium p-4 rounded-lg shadow-lg hover:border-2 hover:border-blue-500">
                                <h2 className="text-4xl">{material.name}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

