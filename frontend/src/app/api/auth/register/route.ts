import { NextResponse } from "next/server";

type Credentials = {
  email: string;
  username: string;
  password: string;
  passwordConfirm: string;
};

export async function POST(req: Request) {
  const backendUrl = process.env.NEXTAUTH_BACKEND_URL;

  if (!backendUrl) {
    return NextResponse.json(
      { error: "Backend URL is not defined" },
      { status: 500 },
    );
  }

  const apiUrl = `${backendUrl}auth/register/`;

  try {
    const credentials: Credentials = await req.json();

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    const data = response.json();

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("ERROR:", error.response?.data || error.message);
    return NextResponse.json(
      {
        error: "Registration failed",
        details: error.response?.data || error.message,
      },
      { status: 500 },
    );
  }
}
