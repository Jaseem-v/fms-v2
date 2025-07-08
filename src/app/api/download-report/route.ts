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
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:4000';
    const response = await fetch(`${backendUrl}/api/download-report`, {
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

    // Get the PDF buffer from the backend
    const pdfBuffer = await response.arrayBuffer();

    // Create filename with website URL and "audit report"
    const domain = new URL(url).hostname;
    const cleanDomain = domain.replace(/[^a-zA-Z0-9.-]/g, '-');
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    const filename = `${cleanDomain}-audit-report-${timestamp}.pdf`;

    // Return the PDF as a downloadable file
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Error downloading report:', error);
    return NextResponse.json(
      { error: 'Failed to download report' },
      { status: 500 }
    );
  }
} 