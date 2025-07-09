// Vercel serverless function for email subscription
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({ error: 'Email is required' })
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format' })
    }

    // In a real application, you would:
    // 1. Store the email in a database (e.g., Supabase, MongoDB, etc.)
    // 2. Send a confirmation email
    // 3. Add to email marketing service (e.g., Mailchimp, SendGrid)

    // For demo purposes, we'll simulate a successful subscription
    console.log(`New subscription: ${email}`)

    // Simulate some processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    return res.status(200).json({
      message: 'Subscribed successfully!',
      email: email,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Subscription error:', error)
    return res.status(500).json({ error: 'Internal server error' })
  }
}

function isValidEmail(email) {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return pattern.test(email)
}

// Example integration with external services:
/*
async function addToDatabase(email) {
  // Example with Supabase
  const { createClient } = require('@supabase/supabase-js')
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  
  const { data, error } = await supabase
    .from('subscribers')
    .insert([{ email, subscribed_at: new Date().toISOString() }])
  
  if (error) throw error
  return data
}

async function sendConfirmationEmail(email) {
  // Example with SendGrid
  const sgMail = require('@sendgrid/mail')
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  
  const msg = {
    to: email,
    from: 'noreply@happeningnow.com',
    subject: 'Welcome to Happening Now!',
    text: 'Thank you for subscribing to our daily trending news updates!',
    html: '<strong>Thank you for subscribing to our daily trending news updates!</strong>',
  }
  
  await sgMail.send(msg)
}
*/

