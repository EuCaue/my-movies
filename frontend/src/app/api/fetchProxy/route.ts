import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  return handleRequest(req, "GET");
}

export async function POST(req: NextRequest) {
  return handleRequest(req, "POST");
}

export async function PUT(req: NextRequest) {
  return handleRequest(req, "PUT");
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req, "DELETE");
}

async function handleRequest(req: NextRequest, method: string) {
  const { searchParams } = new URL(req.url);
  const endpoint = searchParams.get("endpoint");
  const apiUrl = process.env.NEXTAUTH_BACKEND_URL;

  if (!endpoint) {
    return NextResponse.json(
      { error: "Endpoint does not exist." },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(`${apiUrl}${endpoint}/`, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: req.headers.get("Authorization") || "",
      },
      body: method !== "GET" ? JSON.stringify(await req.json()) : null,
    });
    if (response.status === 204) {
      return new Response(JSON.stringify({}), { status: 200 });
    }
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
