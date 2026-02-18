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
    
    const job = await prisma.job.upsert({
      where: { remoteOkId },
      update: {
        company,
        position,
        description,
        location,
        url,
        tags,
        salary,
        postedAt: new Date(postedAt),
      },
      create: {
        remoteOkId,
        company,
        position,
        description,
        location,
        url,
        tags,
        salary,
        postedAt: new Date(postedAt),
      },
    });
    
    return NextResponse.json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
  }
}
