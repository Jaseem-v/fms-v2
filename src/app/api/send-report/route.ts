import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { report, url, userInfo } = body;

    if (!report || !url || !userInfo) {
      return NextResponse.json(
        { error: 'Missing required information' },
        { status: 400 }
      );
    }

    // Proxy the request to the backend server
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:3001';
    const response = await fetch(`${backendUrl}/api/send-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ report, url, userInfo }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Backend responded with status: ${response.status}`);
    }

    const result = await response.json();
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error sending report:', error);
    return NextResponse.json(
      { error: 'Failed to send report' },
      { status: 500 }
    );
  }
} 