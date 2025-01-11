import { NextResponse } from 'next/server';
import axios from 'axios';

type Credentials = {
  email: string;
  username: string;
  password1: string;
  password2: string;
};

export async function POST(req: Request) {
  const backendUrl = process.env.NEXTAUTH_BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: 'Backend URL is not defined' },
      { status: 500 }
    );
  }

  const apiUrl = `${backendUrl}auth/register/`;

  try {
    const credentials: Credentials = await req.json();

    const response = await axios.post(apiUrl, credentials, {
      timeout: 5000,
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('ERROR:', error.response?.data || error.message);
    return NextResponse.json(
      { error: 'Registration failed', details: error.response?.data || error.message },
      { status: 500 }
    );
  }
}
