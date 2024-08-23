This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.




# AI Flashcards

AI Flashcards is a Next.js application designed to enhance learning through the use of AI-generated flashcards and summaries. Users can register, log in, and create flashcards from their own materials, rate their difficulty, and save them for future review. The project also includes subscription management with Stripe and is deployed on Vercel.

## Features

- **User Authentication & Registration**: Implemented using Clerk for secure user authentication and registration.
- **Material Upload & Flashcard Generation**: Users can upload materials, and the app generates flashcards and summaries using the OpenAI API.
- **Flashcard Management**: Users can save flashcards, rate their difficulty, and revisit them at any time.
- **Subscription Plans**: Integrated with Stripe to offer two subscription options.
- **Deployed on Vercel**: Easily accessible and scalable with Vercel.

## Technologies Used

- **Next.js**: React framework used for building the application.
- **Clerk**: Used for user authentication and registration.
- **Firebase**: Used for storing user information and materials.
- **OpenAI API**: Powers the flashcard and summary generation.
- **Stripe**: Manages subscription plans.
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
