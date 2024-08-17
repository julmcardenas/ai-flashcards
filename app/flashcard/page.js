'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { db, usersRef } from "@/firebase"
import { doc, getDoc, collection, getDocs, updateDoc } from "firebase/firestore"
import { Button } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation"
import Carousel from "../components/Carousel"

export default function Flashcard() {
    const router = useRouter();
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState({});
    const [ratings, setRatings] = useState({});

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return;
            const colRef = collection(doc(usersRef, user.id), search);
            const docs = await getDocs(colRef);
            const flashcards = [];

            docs.forEach(doc => {
                flashcards.push({ id: doc.id, ...doc.data() });
            });
            setFlashcards(flashcards);

            // Initialize flipped and ratings states
            const flippedState = {};
            const ratingsState = {};
            flashcards.forEach(card => {
                flippedState[card.id] = false;
                ratingsState[card.id] = card.rating || null;
            });
            setFlipped(flippedState);
            setRatings(ratingsState);
        }
        getFlashcard();
    }, [user, search]);

    const handleCardClick = (id) => {
        setFlipped(prev => ({
            ...prev,
            [id]: !prev[id],  // Toggle the flipped state for the specific card
        }));
    };

    const handleRate = async (difficulty, flashcardId) => {
        console.log(difficulty, flashcardId, user.id);
        const flashcardDoc = doc(usersRef, user.id, search, flashcardId);
        await updateDoc(flashcardDoc, { rating: difficulty });

        // Update local state
        setRatings(prevRatings => ({
            ...prevRatings,
            [flashcardId]: difficulty,
        }));
    };

    if (!isLoaded || !isSignedIn) {
        return <>Loading...</>;
    }

    return (
        <div className="my-4 mx-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={() => router.back()}>Back</button>
            <h2 className="text-4xl font-semibold mb-10 text-center">{search}</h2>
            <Carousel
                flashcards={flashcards}
                flipped={flipped}
                handleCardClick={handleCardClick}
                handleRate={handleRate}
                ratings={ratings}
            />
        </div>
    );
}
