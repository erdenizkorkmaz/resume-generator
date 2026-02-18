import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/jobs - List all jobs with their custom CVs
export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        customCv: true,
      },
      orderBy: {
        postedAt: 'desc',
      },
    });
    
    return NextResponse.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
  }
}

// POST /api/jobs - Create or update a job
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { remoteOkId, company, position, description, location, url, tags, salary, postedAt } = body;
    
    // Validate required fields
    if (!remoteOkId || !company || !position) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Ensure tags is an array
    const normalizedTags = Array.isArray(tags) ? tags : [];
    
    // Ensure salary is string or null
    const normalizedSalary = salary === null || salary === undefined ? null : String(salary);
    
    console.log('Creating job with data:', { remoteOkId, company, position, tags: normalizedTags, salary: normalizedSalary });
    
    const job = await prisma.job.upsert({
      where: { remoteOkId: String(remoteOkId) },
      update: {
        company: String(company),
        position: String(position),
        description: String(description || ''),
        location: String(location || 'Remote'),
        url: String(url || ''),
        tags: normalizedTags,
        salary: normalizedSalary,
        postedAt: new Date(postedAt || Date.now()),
      },
      create: {
        remoteOkId: String(remoteOkId),
        company: String(company),
        position: String(position),
        description: String(description || ''),
        location: String(location || 'Remote'),
        url: String(url || ''),
        tags: normalizedTags,
        salary: normalizedSalary,
        postedAt: new Date(postedAt || Date.now()),
      },
    });
    
    return NextResponse.json(job);
  } catch (error: any) {
    console.error('Error creating job:', error);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    return NextResponse.json({ error: 'Failed to create job', details: error.message }, { status: 500 });
  }
}
