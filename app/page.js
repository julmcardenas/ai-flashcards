'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {

  const handleSubmit = async (plan) => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ plan })
    })

    const checkoutSessionJson = await checkoutSession.json()

    if (checkoutSessionJson.statusCode === 500) {
      console.error(checkoutSessionJson.message)
      return
    }

    const stripe = await getStripe()
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id
    })

    if (error) {
      console.warn(error.message)
    }
  }
  return (
  //   <Container maxWidth="lg">
  //     <Head>
  //       <title>AI Flashcards</title>
  //       <meta name="description" content="AI Flashcards" />
  //       <link rel="icon" href="/favicon.ico" />
  //     </Head>

  //     <Box textAlign={'center'} sx={{ my: 4 }}>
  //       <Typography variant="h2"> Welcome to AI Flashcards </Typography>
  //       <Typography variant="h5"> Easiest way to make flashcards from your text</Typography>
  //       <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/generate">
  //         Get Started
  //       </Button>
  //     </Box>

  //     <Box sx={{ my: 6 }}>
  //       <Typography variant="h4" textAlign={'center'}> Features </Typography>
  //       <Grid container spacing={4} sx={{ mt: 4 }}>
  //         <Grid item xs={12} md={4}>
  //           <Typography variant="h6"> Easy Text Input </Typography>
  //           <Typography> Simply input your text and let our software fo the rest. Creating flashcards has never been easier. </Typography>
  //         </Grid>
  //         <Grid item xs={12} md={4}>
  //           <Typography variant="h6"> Smart Flashcards </Typography>
  //           <Typography> Our Ai intelligently breaks down your texts into concise flashcards, perfect for studying </Typography>
  //         </Grid>
  //         <Grid item xs={12} md={4}>
  //           <Typography variant="h6"> Accessible Anywhere </Typography>
  //           <Typography> Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
  //         </Grid>
  //       </Grid>
  //     </Box>

  //     <Box sx={{ my: 6 }} textAlign={'center'}>
  //       <Typography variant="h4"> Prices </Typography>
  //       <Grid container spacing={4} sx={{ mt: 4 }}>
  //         <Grid item xs={12} md={6} lg={6}>
  //           <Box sx={{ border: 1, p: 3, borderColor: 'grey.300', borderRadius: 2 }}>
  //             <Typography variant="h5"> Basic</Typography>
  //             <Typography variant="h6"> $5 / month</Typography>
  //             <Typography> Access to basic flashcards features and limited storage </Typography>
  //             <Button variant="contained" color="primary" sx={{ mt: 2 }}>Choose Basic</Button>
  //           </Box>
  //         </Grid>
  //         <Grid item xs={12} md={6} lg={6}>
  //           <Box sx={{ border: 1, p: 3, borderColor: 'grey.300', borderRadius: 2 }}>
  //             <Typography variant="h5"> Pro</Typography>
  //             <Typography variant="h6"> $10 / month</Typography>
  //             <Typography> Unlimited flashcards and storage, with priority support. </Typography>
  //             <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Choose Pro</Button>
  //           </Box>
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   </Container>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <Head>
      <title>AI Flashcards</title>
      <meta name="description" content="AI Flashcards" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <div className="text-center my-8">
      <h1 className="text-5xl font-bold text-gray-900">
        Welcome to AI Flashcards
      </h1>
      <p className="text-lg text-gray-600 mt-4">
        The easiest way to make flashcards from your text
      </p>
      <a
        href="/generate"
        className="inline-block mt-6 px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        Get Started
      </a>
    </div>

    <div className="my-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Features
      </h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {[
          { title: 'Easy Text Input', description: 'Simply input your text and let our software do the rest. Creating flashcards has never been easier.' },
          { title: 'Smart Flashcards', description: 'Our AI intelligently breaks down your texts into concise flashcards, perfect for studying.' },
          { title: 'Accessible Anywhere', description: 'Access your flashcards from any device, at any time. Study on the go with ease.' },
        ].map((feature, index) => (
          <div key={index} className="text-center p-6 bg-white shadow-xl rounded-lg border border-gray-200">
            <h3 className="text-xl font-medium text-gray-900 mb-4">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="my-12 text-center">
      <h2 className="text-3xl font-semibold text-gray-800">Pricing</h2>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-8">
        {[
          { title: 'Basic', price: '$5 / month', description: 'Access to basic flashcards features and limited storage', onClick: () => {handleSubmit('BASIC')} },
          { title: 'Pro', price: '$10 / month', description: 'Unlimited flashcards and storage, with priority support.', onClick: () => {handleSubmit('PRO')} },
        ].map((plan, index) => (
          <div key={index} className="border border-gray-200 p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl font-medium text-gray-900 mb-2">
              {plan.title}
            </h3>
            <p className="text-lg text-gray-600 mb-4">{plan.price}</p>
            <p className="text-gray-600 mb-6">{plan.description}</p>
            <button
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              onClick={plan.onClick}
            >
              Choose {plan.title}
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
