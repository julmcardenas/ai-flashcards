'use client'
import Image from "next/image";
import getStripe from "@/utils/get-stripe";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { AppBar, Button, Toolbar, Typography, Container, Box, Grid } from "@mui/material";
import Head from "next/head";

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch("/api/checkout_sessions", {
      method: "POST",
      headers: {
        origin: 'http://localhost:3000',
      },
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
    <Container maxWidth="lg">
      <Head>
        <title>AI Flashcards</title>
        <meta name="description" content="AI Flashcards" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box textAlign={'center'} sx={{ my: 4 }}>
        <Typography variant="h2"> Welcome to AI Flashcards </Typography>
        <Typography variant="h5"> Easiest way to make flashcards from your text</Typography>
        <Button variant="contained" color="primary" sx={{ mt: 2 }} href="/generate">
          Get Started
        </Button>
      </Box>

      <Box sx={{ my: 6 }}>
        <Typography variant="h4" textAlign={'center'}> Features </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6"> Easy Text Input </Typography>
            <Typography> Simply input your text and let our software fo the rest. Creating flashcards has never been easier. </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6"> Smart Flashcards </Typography>
            <Typography> Our Ai intelligently breaks down your texts into concise flashcards, perfect for studying </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6"> Accessible Anywhere </Typography>
            <Typography> Access your flashcards from any device, at any time. Study on the go with ease.</Typography>
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ my: 6 }} textAlign={'center'}>
        <Typography variant="h4"> Prices </Typography>
        <Grid container spacing={4} sx={{ mt: 4 }}>
          <Grid item xs={12} md={6} lg={6}>
            <Box sx={{ border: 1, p: 3, borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5"> Basic</Typography>
              <Typography variant="h6"> $5 / month</Typography>
              <Typography> Access to basic flashcards features and limited storage </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }}>Choose Basic</Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <Box sx={{ border: 1, p: 3, borderColor: 'grey.300', borderRadius: 2 }}>
              <Typography variant="h5"> Pro</Typography>
              <Typography variant="h6"> $10 / month</Typography>
              <Typography> Unlimited flashcards and storage, with priority support. </Typography>
              <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleSubmit}>Choose Pro</Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
