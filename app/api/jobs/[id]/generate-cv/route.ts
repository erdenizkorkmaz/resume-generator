import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import userData from '@/public/data.json';

// POST /api/jobs/[id]/generate-cv - Generate custom CV using OpenRouter
export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Get job details
    const job = await prisma.job.findUnique({
      where: { id },
    });
    
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // Check if custom CV already exists
    const existingCv = await prisma.customCv.findUnique({
      where: { jobId: id },
    });
    
    if (existingCv) {
      return NextResponse.json({ 
        message: 'Custom CV already exists',
        customCv: existingCv 
      });
    }
    
    // Generate custom CV using OpenRouter
    const prompt = buildPrompt(job, userData);
    const aiResponse = await generateCvWithAI(prompt);
    
    // Parse AI response to structured CV
    const customCvContent = parseAiResponse(aiResponse);
    
    // Save to database
    const customCv = await prisma.customCv.create({
      data: {
        jobId: id,
        content: customCvContent,
        aiResponse,
        modelUsed: 'minimax/minimax-m2.5',
      },
    });
    
    return NextResponse.json({ 
      message: 'Custom CV generated successfully',
      customCv 
    });
  } catch (error) {
    console.error('Error generating CV:', error);
    return NextResponse.json({ error: 'Failed to generate CV' }, { status: 500 });
  }
}

function buildPrompt(job: any, userData: any): string {
  return `You are a professional CV writer specializing in tailoring resumes for specific job applications.

TASK: Customize the following CV to better match the job requirements. Keep the work experience companies the same, but optimize the descriptions, skills, and project highlights to align with the job posting.

JOB DETAILS:
- Position: ${job.position}
- Company: ${job.company}
- Description: ${job.description}
- Tags/Skills: ${job.tags.join(', ')}

CURRENT CV:
${JSON.stringify(userData, null, 2)}

INSTRUCTIONS:
1. Keep the same company names and dates in work experience
2. Rewrite job descriptions to emphasize relevant skills for this position
3. Reorder/rephrase project descriptions to highlight most relevant work
4. Adjust the "aboutme" section to target this specific role
5. Reorder technical skills to prioritize those mentioned in the job
6. Maintain truthfulness - don't invent new companies or roles

Return ONLY a valid JSON object matching the original CV structure, with these improvements applied.`;
}

async function generateCvWithAI(prompt: string): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY not configured');
  }
  
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://resume-generator-blush.vercel.app',
      'X-Title': 'Resume Generator',
    },
    body: JSON.stringify({
      model: 'minimax/minimax-m2.5',
      messages: [
        { role: 'system', content: 'You are a professional CV writer. Return only valid JSON.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }
  
  const data = await response.json();
  return data.choices[0]?.message?.content || '';
}

function parseAiResponse(response: string): any {
  // Try to extract JSON from the response
  const jsonMatch = response.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      return JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error('Failed to parse AI response as JSON:', e);
    }
  }
  
  // Fallback: return as-is
  return { raw: response };
}
