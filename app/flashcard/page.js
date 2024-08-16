'use client'

import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { db, usersRef } from "@/firebase"
import { doc, getDoc, collection, setDoc, getDocs } from "firebase/firestore"
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Grid, Paper, TextField, Typography } from "@mui/material";
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"

export default function Flashcard() {
    const router = useRouter()
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);

    const searchParams = useSearchParams();
    const search = searchParams.get('id');

    useEffect(() => {
        async function getFlashcard() {
            if (!search || !user) return
            const colRef = collection(doc(usersRef, user.id), search)
            const docs = await getDocs(colRef)
            const flashcards = []

            docs.forEach(doc => {
                flashcards.push({ id: doc.id, ...doc.data() })
            })
            setFlashcards(flashcards)
        }
        getFlashcard()
    }, [user, search])

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    if (!isLoaded || !isSignedIn) { return <>Loading...</> }

    return (
        <div className="my-4 mx-8">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded" onClick={() => router.back()}>Back</button>
                    <h2 className="text-4xl font-semibold mb-10 text-center">{search}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {flashcards.map((flashcard, index) => (
                            <div
                                key={index}
                                className="relative group cursor-pointer "
                                onClick={() => handleCardClick(index)}
                            >
                                <div className="relative h-52 w-full">
                                    <div className="absolute inset-0 flex items-center justify-center bg-white text-lg font-medium p-4 rounded-lg shadow-lg hover:border-2 hover:border-blue-500">
                                        {flashcard.front}
                                    </div>
                                    {flipped[index] ? <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-lg font-medium p-4 rounded-lg shadow-lg">
                                        {flashcard.back}
                                    </div> : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
    )

}