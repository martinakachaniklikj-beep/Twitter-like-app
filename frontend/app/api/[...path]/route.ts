import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const url = new URL(request.url);
  const authHeader = request.headers.get('authorization');

  const headers: HeadersInit = {};
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const backendUrl = `${process.env.BACKEND_URL}/${path}${url.search}`;
  const response = await fetch(backendUrl, { headers });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return NextResponse.json(data, { status: response.status });
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  
  let body = null;
  try {
    const text = await request.text();
    if (text) {
      body = JSON.parse(text);
    }
  } catch (e) {
  }
  
  const authHeader = request.headers.get('authorization');

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const backendUrl = `${process.env.BACKEND_URL}/${path}`;
  const response = await fetch(backendUrl, {
    method: 'POST',
    headers,
    ...(body && { body: JSON.stringify(body) }),
  });

  const responseText = await response.text();
  const data = responseText ? JSON.parse(responseText) : {};
  return NextResponse.json(data, { status: response.status });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const authHeader = request.headers.get('authorization');

  const headers: HeadersInit = {};
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const backendUrl = `${process.env.BACKEND_URL}/${path}`;
  const response = await fetch(backendUrl, {
    method: 'DELETE',
    headers,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return NextResponse.json(data, { status: response.status });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathArray } = await params;
  const path = pathArray.join('/');
  const body = await request.json();
  const authHeader = request.headers.get('authorization');

  const headers: HeadersInit = { 'Content-Type': 'application/json' };
  if (authHeader) {
    headers['Authorization'] = authHeader;
  }

  const backendUrl = `${process.env.BACKEND_URL}/${path}`;
  const response = await fetch(backendUrl, {
    method: 'PATCH',
    headers,
    body: JSON.stringify(body),
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};
  return NextResponse.json(data, { status: response.status });
}
