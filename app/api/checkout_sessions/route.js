import { NextResponse } from "next/server";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_API_KEY);

const formatAmountForStripe = (amount) => {
  return Math.round(amount * 100);
}

export async function GET(req, { params }) {
  const searchParams = req.nextUrl.searchParams;
  const sessionId = searchParams.get('sessionId');

  try {
    if (sessionId) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);
      return NextResponse.json(checkoutSession, { status: 200 });
    }
    return NextResponse.json({message: 'No session ID'}, { status: 200 });

  } catch (e) {
    console.error('Error retrieving checkout session:', e);
    return NextResponse.json(e, { status: 500 });
  }
}

export async function POST(req) {
  const data = await req.json();
  console.log('body', data.plan)
  const plan = data.plan;
  const params = {
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: plan === 'PRO' ? 'Pro Subscription' : 'Basic Subscription',
          },
          unit_amount: plan === 'PRO' ? formatAmountForStripe(10) : formatAmountForStripe(5),
          recurring: {
            interval: 'month',
            interval_count: 1
          }
        },
        quantity: 1,
      },
    ],
    success_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${req.headers.get('origin')}/result?session_id={CHECKOUT_SESSION_ID}`,
  };
  const checkoutSession = await stripe.checkout.sessions.create(params);

  return NextResponse.json(checkoutSession, { status: 200 })
}