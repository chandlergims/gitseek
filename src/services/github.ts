import { Octokit } from 'octokit';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
if (!GITHUB_TOKEN) {
  throw new Error('GitHub token is required');
}

const octokit = new Octokit({
  auth: GITHUB_TOKEN
});

interface FileContent {
  path: string;
  content: string;
}

export interface RepoInfo {
  name: string;
  description: string;
  language: string;
  topics: string[];
  readme: string;
  files: string[];
  codeFiles: FileContent[];
}

export async function getRepoInfo(repoUrl: string): Promise<RepoInfo> {
  try {
    let owner: string, repo: string;
    try {
      // Extract owner and repo from URL
      const url = new URL(repoUrl.trim());
      if (!url.hostname.includes('github.com')) {
        throw new Error('Invalid GitHub URL. URL must be from github.com');
      }
      
      // Clean up pathname and split into parts
      const parts = url.pathname
        .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
        .split('/')
        .filter(Boolean); // Remove empty parts
      
      if (parts.length < 2) {
        throw new Error('Invalid repository URL format. Expected: https://github.com/owner/repo');
      }

      [owner, repo] = parts;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Invalid URL')) {
        throw new Error('Invalid URL format. Please enter a valid GitHub repository URL');
      }
      throw error;
    }

    // Get repository information
    let repoData;
    try {
      const response = await octokit.rest.repos.get({ owner, repo });
      repoData = response.data;
    } catch (error) {
      console.error('Failed to fetch repository data:', error);
      throw new Error(`Failed to fetch repository data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Get readme content
    let readmeData;
    try {
      const response = await octokit.rest.repos.getReadme({ owner, repo });
      readmeData = response.data;
    } catch (error) {
      console.error('Failed to fetch README:', error);
      throw new Error('README not found or inaccessible');
    }

    // Get repository contents
    let contentsData;
    try {
      const response = await octokit.rest.repos.getContent({ owner, repo, path: '' });
      contentsData = response.data;
    } catch (error) {
      console.error('Failed to fetch repository contents:', error);
      throw new Error('Repository contents not accessible');
    }

    // Get code files content
    const codeFiles: FileContent[] = [];
    if (Array.isArray(contentsData)) {
      const codeExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.go', '.rs', '.cpp', '.c', '.h', '.cs'];
      const configFiles = ['package.json', 'tsconfig.json', 'cargo.toml', 'requirements.txt', 'go.mod', 'pom.xml'];
      const excludeFiles = ['.gitignore', '.env', '.dockerignore', '.editorconfig', '.prettierrc', '.eslintrc'];
      
      const relevantFiles = contentsData.filter(file => {
        file.path.toLowerCase().split('.').pop();
        const isExcluded = excludeFiles.includes(file.path.toLowerCase());
        return !isExcluded && (
          codeExtensions.some(e => file.path.toLowerCase().endsWith(e)) ||
          configFiles.includes(file.path.toLowerCase())
        );
      });

      // Get up to 5 most relevant files
      const filesToFetch = relevantFiles.slice(0, 5);
      
      for (const file of filesToFetch) {
        try {
          const { data: fileData } = await octokit.rest.repos.getContent({
            owner,
            repo,
            path: file.path,
          });
          
          if ('content' in fileData && typeof fileData.content === 'string') {
            codeFiles.push({
              path: file.path,
              content: atob(fileData.content)
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch content for ${file.path}:`, error);
        }
      }
    }

    const files = Array.isArray(contentsData) 
      ? contentsData.map(file => file.path)
      : [];

    const readmeContent = atob(readmeData.content);

    return {
      name: repoData.name,
      description: repoData.description || '',
      language: repoData.language || '',
      topics: repoData.topics || [],
      readme: readmeContent,
      files,
      codeFiles,
    };
  } catch (error) {
    console.error('Error fetching repository info:', error);
    if (error instanceof Error) {
      if (error.message.includes('Not Found')) {
        throw new Error('Repository not found. Please check the URL and ensure the repository exists.');
      }
      throw new Error(error.message);
    }
    throw new Error('Failed to fetch repository information. Please check your connection and try again.');
  }
}
