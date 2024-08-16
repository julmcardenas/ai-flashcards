'use client'

import { usersRef, db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { doc, writeBatch, getDoc, collection } from "firebase/firestore";
import { useState } from "react";

export default function GeneratePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const router = useRouter();
    const [cardsLoading, setCardsLoading] = useState(false);

    const handleSubmit = async (e) => {
        setCardsLoading(true);
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
            }).finally(() => {
                setCardsLoading(false);
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
        if (!name) {
            alert('Please enter a name for the flashcards');
            return;
        }

        const batch = writeBatch(db)
        const userDocsRef = doc(usersRef, user.id);
        const docSnap = await getDoc(userDocsRef);

        if (docSnap.exists()) {
            const collections = docSnap.data().flashcards || []
            if (collections.find((f) => f.name === name)) {
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

    return (
        <div className="container mx-auto px-4 py-3">
            <button onClick={() => router.push('/flashcards')} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline">View All</button>
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl font-bold mb-6">Generate Flashcards</h1>
                <div className="bg-white p-6 rounded-lg shadow-md w-full">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Enter Text"
                        className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />
                    {cardsLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
                        </div>
                    ) : (
                        <button
                            onClick={() => {handleSubmit()}}
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Generate
                        </button>
                    )}
                    
                </div>
            </div>

            {flashcards.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-2xl font-semibold mb-4">Flashcards</h2>
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

                    <div className="mt-6 flex justify-center">
                        <button
                            onClick={handleOpen}
                            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                        >
                            Save Flashcards
                        </button>
                    </div>
                </div>
            )}

            {open && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
                        <h2 className="text-xl font-semibold mb-4">Save Flashcards</h2>
                        <p className="mb-4">Please enter a name for the flashcards</p>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Collection Name"
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={handleClose}
                                className="py-2 px-4 rounded-lg bg-gray-300 hover:bg-gray-400 transition duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveFlashcards}
                                className="py-2 px-4 rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition duration-300"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}






