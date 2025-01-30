import type { RepoInfo } from './github';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_API_KEY) {
  throw new Error('OpenAI API key is required');
}

interface AnalysisResult {
  isLarp: boolean;
  confidence: number;
  explanation: string;
}

export async function analyzeRepository(repoInfo: RepoInfo): Promise<AnalysisResult> {
  try {
    const prompt = `As an expert in detecting fake GitHub repositories (LARPs), analyze this repository by comparing its README claims with the actual implementation:

1. Project Overview:
Name: ${repoInfo.name}
Description: ${repoInfo.description}
Language: ${repoInfo.language}
Topics: ${repoInfo.topics.join(', ')}

2. README Analysis:
${repoInfo.readme}

3. Implementation Check:
${repoInfo.codeFiles.map(file => `
File: ${file.path}
${file.content}
`).join('\n')}

Analyze for inconsistencies:
1. Do the code files match the project's stated purpose?
2. Are there signs of real development (error handling, comments, proper structure) vs superficial code?
3. Do function/class names in the code align with README terminology?
4. Is the implementation complexity appropriate for the claimed features?
5. Are there any red flags (e.g., claims "AI trading bot" but only has basic HTML)?

Format your response as:
VERDICT: [LARP or GENUINE]
CONFIDENCE: [High/Moderate/Low]
ANALYSIS: [Detailed explanation focusing on README vs implementation comparison]

Analyze the following aspects and provide a detailed response:
1. Consistency: Does the repository content match its stated purpose?
2. Implementation: Are there signs of real development work vs superficial code?
3. Structure: Is the project organized like a genuine development project?
4. Technical Depth: Does the code show understanding of the problem domain?
5. Code Quality: Analyze the actual code files for signs of real development practices vs superficial implementation.

Format your response as:
VERDICT: [LARP or GENUINE]
CONFIDENCE: [High/Moderate/Low]
ANALYSIS: [Your detailed explanation]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an expert at analyzing GitHub repositories to determine if they are genuine projects or LARPs."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Failed to analyze repository');
    }

    const data = await response.json();
    const analysis = data.choices[0].message.content;
    
    // Parse the analysis
    const verdict = /VERDICT:\s*(LARP|GENUINE)/i.exec(analysis);
    const confidenceMatch = /CONFIDENCE:\s*(High|Moderate|Low)/i.exec(analysis);
    /ANALYSIS:\s*(.+)/s.exec(analysis);
    
    const isLarp = verdict ? verdict[1].toLowerCase() === 'larp' : false;
    const confidence = confidenceMatch 
      ? confidenceMatch[1].toLowerCase() === 'high' 
        ? 0.9 
        : confidenceMatch[1].toLowerCase() === 'moderate'
          ? 0.7 
          : 0.5
      : 0.5;

    return {
      isLarp,
      confidence,
      explanation: analysis
    };
  } catch (error) {
    console.error('Error analyzing repository:', error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('Failed to analyze repository. Please try again later.');
  }
}
