'use client'

import { usersRef, db } from "@/firebase";
import { useUser } from "@clerk/nextjs";
import { redirect, useRouter } from "next/navigation";
import { doc, writeBatch, getDoc, collection, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

export default function GeneratePage() {
    const { isLoaded, isSignedIn, user } = useUser();
    const [flashcards, setFlashcards] = useState([]);
    const [flipped, setFlipped] = useState([]);
    const [text, setText] = useState('');
    const [name, setName] = useState('');
    const [open, setOpen] = useState(false);
    const [materials, setMaterials] = useState([]);
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [cardsLoading, setCardsLoading] = useState(false);
    const [summary, setSummary] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (user) {
            fetchMaterials();
        }
    }, [user]);

    const fetchMaterials = async () => {
        const docRef = doc(usersRef, user.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            setMaterials(data.materials || []);
        }
    };

    const handleMaterialClick = async (material) => {
        setSelectedMaterial(material);
        setText(material.text);
        setSummary('');  // Clear summary
        setFlashcards([]);  // Clear flashcards
        setFlipped({});  // Clear flipped state
    
        // Check if the material has existing flashcards or summary
        const docRef = doc(usersRef, user.id);
        const docSnap = await getDoc(docRef);
    
        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // Here is where you should apply the change
            const materialsArray = data.materials || [];
            const storedMaterial = materialsArray.find(m => m.name === material.name);
    
            if (storedMaterial) {
                if (storedMaterial.flashcards) {
                    setFlashcards(storedMaterial.flashcards);
                }
                if (storedMaterial.summary) {
                    setSummary(storedMaterial.summary);
                }
            }
        }
    };
    

    const handleAddMaterial = () => {
        if (name) {
            const newMaterial = { name, text: '' };
            setMaterials([...materials, newMaterial]);
            setName('');
        }
    };

    const handleSubmit = async () => {
        setCardsLoading(true);
        try {
            const res = await fetch('/api/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!res.ok) {
                throw new Error('Failed to generate flashcards. Please try again.');
            }

            const data = await res.json();
            setFlashcards(data);
        } catch (error) {
            console.error('Error generating flashcards:', error.message);
            alert('An error occurred while generating flashcards. Please try again.');
        } finally {
            setCardsLoading(false);
        }
    };

    const handleSummarize = async () => {
        try {
            const res = await fetch('/api/summarize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text })
            });

            if (!res.ok) {
                throw new Error('Failed to summarize text. Please try again.');
            }

            const data = await res.json();
            setSummary(data.summary);
        } catch (error) {
            console.error('Error summarizing text:', error.message);
            alert('An error occurred while summarizing text. Please try again.');
        }
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const saveFlashcards = async () => {
        if (!user) {
            alert('Please login to save flashcards');
            return;
        } else if (!name && !selectedMaterial) {
            alert('Please enter a name for the flashcards');
            return;
        }

        const materialName = name || selectedMaterial.name;

        const batch = writeBatch(db);
        const userDocsRef = doc(usersRef, user.id);
        const docSnap = await getDoc(userDocsRef);

        let materialsData = [];
        if (docSnap.exists()) {
            materialsData = docSnap.data().materials || [];
        }

        const existingMaterialIndex = materialsData.findIndex(m => m.name === materialName);
        if (existingMaterialIndex !== -1) {
            materialsData[existingMaterialIndex] = {
                name: materialName,
                text,
                flashcards,
                summary
            };
        } else {
            materialsData.push({ name: materialName, text, flashcards, summary });
        }

        batch.set(userDocsRef, { materials: materialsData }, { merge: true });

        const collectionRef = collection(userDocsRef, materialName);
        flashcards.forEach((flashcard) => {
            const cardDocRef = doc(collectionRef, flashcard.id); // Use flashcard.id as document ID
            batch.set(cardDocRef, flashcard);
        });

        await batch.commit();
        handleClose();
        router.push('/flashcards');
    };

    if (isLoaded && !user) {
        redirect('/login');
    }

    return (
        <div className="container mx-auto px-4 py-3 flex">
            {/* Sidebar */}
            <div className="w-1/4 border-r-2 border-gray-200 pr-4">
                <h2 className="text-xl font-semibold mb-4">Add New Material</h2>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Material Title"
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                />
                <button
                    onClick={handleAddMaterial}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 mb-4"
                >
                    Add
                </button>
                <h3 className="text-lg font-semibold mb-2">Materials</h3>
                <ul className="list-disc pl-5">
                    {materials.map((material, index) => (
                        <li key={index} className="cursor-pointer hover:underline" onClick={() => handleMaterialClick(material)}>
                            {material.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content Area */}
            <div className="w-3/4 pl-4">
                {selectedMaterial && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">{selectedMaterial.name}</h2>
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
                            <div className="flex gap-2 mb-4">
                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                                >
                                    Generate Flashcards
                                </button>
                                <button
                                    onClick={handleSummarize}
                                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
                                >
                                    Summarize
                                </button>
                            </div>
                        )}
                        {summary && (
                            <div className="bg-gray-100 p-4 rounded-lg mb-4">
                                <h2 className="text-2xl font-semibold mb-2">Summary</h2>
                                <ul className="list-disc pl-5">
                                    {summary.split('\n').map((line, index) => (
                                        <li key={index}>{line}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {flashcards.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-semibold mb-4">Flashcards</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {flashcards.map((flashcard, index) => (
                                        <div
                                            key={index}
                                            className="relative group cursor-pointer h-52 w-full"
                                            onClick={() => handleCardClick(index)}
                                        >
                                            <div className="absolute inset-0 flex items-center justify-center bg-white text-lg font-medium p-4 rounded-lg shadow-lg hover:border-2 hover:border-blue-500">
                                                {flashcard.front}
                                            </div>
                                            {flipped[index] ? (
                                                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 text-lg font-medium p-4 rounded-lg shadow-lg">
                                                    {flashcard.back}
                                                </div>
                                            ) : null}
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
                    </>
                )}
            </div>

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
