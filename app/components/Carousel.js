import { useState } from 'react';

export default function Carousel({ flashcards, flipped, handleCardClick, handleRate, ratings }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % flashcards.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + flashcards.length) % flashcards.length);
    };

    return (
        <div className="relative w-full overflow-hidden">
            <div className="flex transition-transform duration-300" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {flashcards.map((flashcard) => (
                    <div key={flashcard.id} className="w-full flex-shrink-0 cursor-pointer" onClick={() => handleCardClick(flashcard.id)}>
                        <div className="relative">
                            <div className={`flex min-h-64 px-16 bg-white border rounded-lg shadow-lg items-center justify-center text-lg font-medium ${flipped[flashcard.id] ? 'bg-gray-100' : 'bg-gray-200'} `}>
                                {flipped[flashcard.id] ? flashcard.back : flashcard.front}
                            </div>
                            {flipped[flashcard.id] && ( // Only show the rating buttons when the card is flipped
                                <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-4">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the flip action
                                            handleRate(1, flashcard.id);
                                        }}
                                        className={`px-4 py-2 border rounded ${ratings[flashcard.id] === 1 ? 'bg-blue-500 text-white hover:bg-blue-400' : 'bg-white text-blue-500 hover:bg-gray-100'}`}
                                    >
                                        Easy
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the flip action
                                            handleRate(2, flashcard.id);
                                        }}
                                        className={`px-4 py-2 border rounded ${ratings[flashcard.id] === 2 ? 'bg-yellow-500 text-white hover:bg-yellow-400' : 'bg-white text-yellow-500 hover:bg-gray-100'}`}
                                    >
                                        Medium
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent the flip action
                                            handleRate(3, flashcard.id);
                                        }}
                                        className={`px-4 py-2 border rounded ${ratings[flashcard.id] === 3 ? 'bg-red-500 text-white hover:bg-red-400' : 'bg-white text-red-500 hover:bg-gray-100'}`}
                                    >
                                        Hard
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={handlePrev}
                className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow-md hover:bg-gray-200"
            >
                &lt;
            </button>
            <button
                onClick={handleNext}
                className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white border rounded-full p-2 shadow-md hover:bg-gray-200"
            >
                &gt;
            </button>

            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {flashcards.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'}`}
                    />
                ))}
            </div>
        </div>
    );
}
