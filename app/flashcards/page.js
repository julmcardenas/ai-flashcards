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
        <Container>
            <Grid container spacing={3} sx={{ mt: 4 }}>
                {flashcards.map((flashcard, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card>
                            <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                                <CardContent>
                                    <Typography variant="h6">{flashcard.name}</Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}