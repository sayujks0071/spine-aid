import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const subscribeSchema = z.object({
  email: z.string().email(),
})

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const email = formData.get('email') as string

    const data = subscribeSchema.parse({ email })

    // TODO: Integrate with email service (e.g., Mailchimp, SendGrid)
    // For now, just return success
    console.log('Newsletter subscription:', data.email)

    return NextResponse.json(
      { message: 'Successfully subscribed to newsletter' },
      { status: 200 }
    )
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}

