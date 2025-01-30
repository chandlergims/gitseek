import type { RepoInfo } from './github';

const DEEPSEEK_API_KEY = 'sk-cfcd4fa88fcf482e9ff71425d9a15c8a';

interface AnalysisResult {
  isLarp: boolean;
  confidence: number;
  explanation: string;
}

export async function analyzeRepository(repoInfo: RepoInfo): Promise<AnalysisResult> {
  try {
    const prompt = `You are an expert at analyzing GitHub repositories to determine if they are genuine projects or LARPs (Live Action Role Play/fake projects). Analyze the following repository:

Repository Name: ${repoInfo.name}
Description: ${repoInfo.description || 'No description provided'}
Primary Language: ${repoInfo.language || 'Not specified'}
Topics: ${repoInfo.topics.length > 0 ? repoInfo.topics.join(', ') : 'No topics'}
Files: ${repoInfo.files.length > 0 ? repoInfo.files.join(', ') : 'No files found'}

Code Files Analysis:
${repoInfo.codeFiles.map(file => `
File: ${file.path}
Content:
${file.content}
`).join('\n')}


README Content:
${repoInfo.readme || 'No README found'}

Additional Context:
- Repository has ${repoInfo.files.length} files
- ${repoInfo.readme ? 'Has README documentation' : 'No README documentation'}
- ${repoInfo.description ? 'Has description' : 'No description provided'}
- ${repoInfo.language ? `Primary language is ${repoInfo.language}` : 'No primary language detected'}

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

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      })
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(
        error.error?.message || 
        'Deepseek API is currently unavailable. Please try using GPT-4 model instead.'
      );
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
      throw new Error(
        error.message.includes('Failed to fetch') 
          ? 'Deepseek API is currently unavailable. Please try using GPT-4 model instead.'
          : error.message
      );
    }
    throw new Error('Failed to analyze repository. Please try using GPT-4 model instead.');
  }
}
