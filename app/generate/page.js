'use client'

import { usersRef, db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { doc, writeBatch, getDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { Box, Button, Card, CardActionArea, CardContent, Container, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText, Grid, Paper, TextField, Typography } from "@mui/material";

export default function GeneratePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();

    console.log(user)

    const handleSubmit = async (e) => {
        fetch('api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: text
        })
            .then((res) => res.json())
            .then(data => {
                setFlashcards(data);
            })
    }

    const handleCardClick = (id) => {
        setFlipped((prev) => ({
            ...prev,
            [id]: !prev[id]
        }))
    }

    const handleOpen = () => {
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    }

    const saveFlashcards = async () => {
        if (!user) {
            redirect('/login')
        } else if (!name) {
            alert('Please enter a name for the flashcards');
            return;
        }

        const batch = writeBatch(db)
        const userDocsRef = doc(usersRef, user.id);
        const docSnap = await getDoc(userDocsRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections, find((f) => f.name === name)) {
                alert('Flashcards with that name already exist');
                return;
            } else {
                collections.push({ name })
                batch.set(userDocsRef, { flashcards: collections }, { merge: true });
            }
        } else {
            batch.set(userDocsRef, { flashcards: [{ name }] });
        }

        const collectionRef = collection(userDocsRef, name);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(collectionRef);
            batch.set(cardDocRef, flashcard);
        })

        await batch.commit()
        handleClose()
        router.push('/flashcards')
    }

    if (!user) {
        redirect('/login')
    }

    return (
        <Container >
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
            >
                <Typography variant="h4">Generate Flashcards</Typography>
                {/* <Generate/> */}
                <Paper sx={{ p: 4, width: '100%' }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        label="Enter Text"
                        variant="outlined"
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mb: 2 }}
                    />
                    <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ mb: 2 }}>Generate</Button>
                </Paper>
            </Box>

            {flashcards.length > 0 && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5">Flashcards</Typography>
                    <Grid container spacing={2}>
                        {flashcards.map((flashcard, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Card>
                                    <CardActionArea onClick={() => handleCardClick(index)}>
                                        <CardContent>
                                            <Box sx={{
                                                perspective: '100px',
                                                '&>div': {
                                                    transition: 'transform 0.6s',
                                                    transformStyle: 'preserve-3d',
                                                    position: 'relative',
                                                    width: '100%',
                                                    height: '200px',
                                                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)'
                                                },
                                                '&>div>div': {
                                                    position: 'absolute',
                                                    width: '100%',
                                                    height: '100%',
                                                    backfaceVisibility: 'hidden',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    padding: 2,
                                                    boxSizing: 'border-box',

                                                },
                                                '&>div>div:nth-of-type(2)': {
                                                    transform: 'rotateY(180deg)'
                                                }
                                            }}
                                            >
                                                <div>
                                                    <div>
                                                        <Typography variant="h5" component="div">{flashcard.front}</Typography>
                                                    </div>
                                                    <div>
                                                        <Typography variant="h5" component="div">{flashcard.back}</Typography>
                                                    </div>
                                                </div>
                                            </Box>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>

                    <Box sx={{ mt: 2 }} display={'flex'} color={'primary'}>
                        <Button onClick={handleOpen} variant="contained" color="primary">Save Flashcards</Button>
                    </Box>
                </Box>
            )}

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Save Flashcards</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter a name for the flashcards
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Collection Name"
                        type="text"
                        fullWidth
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={saveFlashcards}>Save</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}