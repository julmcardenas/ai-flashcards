'use client'
import { useUser } from "@clerk/nextjs"
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Grid, Paper, TextField, Typography } from "@mui/material";
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { db, usersRef } from "@/firebase"
import { doc, getDoc, collection, setDoc } from "firebase/firestore"

export default function Flashcards() {
    const { isLoaded, isSignedIn, user } = useUser()
    const [flashcards, setFlashcards] = useState([])
    const router = useRouter()

    useEffect(() => {
        async function getFlashcards() {
            if (!user) return
            const docRef = doc(usersRef, user.id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                const collections = docSnap.data().flashcards || []
                setFlashcards(collections)
            } else {
                await setDoc(docRef, { flashcards: [] })
            }
        }
        getFlashcards()
    }, [user])

    if (!isLoaded || !isSignedIn) { return <>Loading...</> }

    const handleCardClick = (id) => {
        router.push(`/flashcard?id=${id}`) // 
    }

    console.log('flashcards', flashcards)
    return (
        <div className="">
            <button className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded mx-8" onClick={() => router.back()}>Back</button>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4 mx-8">
                {flashcards.map((flashcard, index) => (
                    <div
                        key={index}
                        className="relative group cursor-pointer "
                        onClick={() => handleCardClick(flashcard.name)}
                    >
                        <div className="relative h-52 w-full">
                            <div className="absolute inset-0 flex items-center justify-center bg-white text-lg font-medium p-4 rounded-lg shadow-lg hover:border-2 hover:border-blue-500">
                                <h2 className="text-4xl">{flashcard.name}</h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}