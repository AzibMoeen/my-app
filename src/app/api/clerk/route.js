import { Webhook } from 'svix';
import { headers } from 'next/headers';
import userModel from '@/Models/user.model.js';
export async function POST(req) {
  console.log("hello");

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', { status: 400 });
  }

  const { type, data } = evt;
  console.log(`Webhook with type of ${type}`);
  console.log('Webhook body:', body);

  if (type === 'user.created') {
    const firstName = data.first_name;
    const clerkId = data.id;
    const lastName = data.last_name;
    const email = data.email_addresses?.[0]?.email_address;
    const username = `${firstName}${lastName ? `_${lastName}` : ''}`; // Construct username if needed

    try {
      const newUser = await userModel.create({
        username,   
        email,
        clerkId,
        password: null, // Leave null or handle based on actual authentication setup
      });
      console.log('User created:', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return new Response('Error creating user', { status: 500 });
    }
  }

  return new Response('', { status: 200 });
}
