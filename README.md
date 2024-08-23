# AI Flashcards

AI Flashcards is a Next.js application designed to enhance learning through the use of AI-generated flashcards and summaries. Users can register, log in, and create flashcards from their own materials, rate their difficulty, and save them for future review. The project also includes subscription management with Stripe and is deployed on Vercel.

## Features

- **User Authentication & Registration**: Implemented using Clerk for secure user authentication and registration.
- **Material Upload & Flashcard Generation**: Users can upload materials, and the app generates flashcards and summaries using the OpenAI API.
- **Flashcard Management**: Users can save flashcards, rate their difficulty, and revisit them at any time.
- **Subscription Plans**: Integrated with Stripe to offer two subscription options.
- **Deployed on Vercel**: Easily accessible and scalable with Vercel.
- **Styling with Tailwind CSS**: Utilized Tailwind CSS for custom and responsive styling.

## Technologies Used

- **Next.js**: React framework used for building the application.
- **Clerk**: Used for user authentication and registration.
- **Firebase**: Used for storing user information and materials.
- **OpenAI API**: Powers the flashcard and summary generation.
- **Stripe**: Manages subscription plans.
- **Tailwind CSS**: Used for styling the application.
- **Vercel**: Platform for deployment.

## Installation and Setup

### Prerequisites

- Node.js and npm installed
- Firebase project and credentials
- Stripe account for subscription management
- Clerk account for user authentication

### Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/julmcardenas/ai-flashcards.git
   cd ai-flashcards
2. **Install Dependencies:**

   ```bash
   npm install

3. **Firebase Set Up:**

- Create a new Firebase project in the Firebase Console.
- Create collections for users and materials to store user information and their uploaded materials.
- Update the Firebase configuration in the .env.local file:

   ```bash
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

4. **Clerk Setup:**

- Create a Clerk account and set up your application.
- Add the Clerk credentials to the .env.local file:

  ```bash
  NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
  CLERK_API_KEY=your_clerk_api_key

5. **Stripe Set Up:**

- Set up a Stripe account and create two subscription plans.
- Add your Stripe credentials to the .env.local file:

   ```bash
   NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
   STRIPE_SECRET_KEY=your_stripe_secret_key

6. **Run the development server:**
   
   ```bash
   npm run dev
   
Now you can Open http://localhost:3000 with your browser to see the result.

### Firebase Data Structure

- Users Collection: Stores user documents with authentication details.
- Materials Collection: Stores materials uploaded by users, including the flashcards generated.

### Deployment

The project is deployed on Vercel. If you want to deploy your own version:

- Create a Vercel account at vercel.com.
- Import the project from your GitHub repository.
- Set up the environment variables for Firebase in Vercel.
- Deploy the project.

## Contributing

Feel free to open issues or submit pull requests for new features or bug fixes.

