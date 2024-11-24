import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Define the UserInput interface to structure user inputs
interface UserInput {
  platform: string;
  link: string;
  folders: string[];
  initializeGit: boolean;
}

const createFolder = (folderPath: string): void => {
  fs.mkdirSync(folderPath, { recursive: true });
  console.log(`Folder created: ${folderPath}`);
};

const createSubfolders = (parentPath: string, folders: string[]): void => {
  folders.forEach((folder: string) => {
    const folderPath: string = path.join(
      parentPath,
      folder.replace(/\s+/g, '_')
    );
    createFolder(folderPath);
  });
};

const createJsonFile = (filePath: string, data: object): void => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`JSON file created at: ${filePath}`);
};

const createReadmeFile = (
  filePath: string,
  platform: string,
  folders: string[],
  link: string
): void => {
  const content = `# ${platform}

## Platform Link
  [${platform}](${link})
  
## Challenge Types
${folders.map((folder) => `- ${folder}`).join('\n')}`;
  fs.writeFileSync(filePath, content);
  console.log(`README.md created at: ${filePath}`);
};

const initializeGitRepo = (repoPath: string): void => {
  try {
    execSync('git --version', { stdio: 'ignore' });
    execSync('git init', { cwd: repoPath });
    console.log('Git repository initialized.');
  } catch (error) {
    console.error(
      'Error initializing Git repository or Git not installed:',
      error instanceof Error ? error.message : String(error)
    );
  }
};

const createGitignoreFile = (filePath: string): void => {
  const gitignoreContent = `# Node.js
node_modules/
npm-debug.log

# CTF-specific
*.log
*.tmp

# OS-generated files
.DS_Store
Thumbs.db`;
  fs.writeFileSync(filePath, gitignoreContent);
  console.log('.gitignore file created.');
};

const promptUser = async (): Promise<UserInput> => {
  const questions = [
    {
      type: 'input',
      name: 'platform',
      message:
        'Enter the platform name (e.g., PicoCTF, HackTheBox (HTB), TryHackMe (THM)):',
      validate: (input: string): boolean | string =>
        input.trim() ? input.length <= 50 : 'Platform name is required.',
    },
    {
      type: 'input',
      name: 'link',
      message: 'Enter the platform link:',
      validate: (input: string): boolean | string => {
        const urlRegex = /^(https?:\/\/)?([\w\-])+(\.[\w\-]+)+[/#?]?.*$/;
        return input.trim() ? urlRegex.test(input) : 'Enter a valid URL.';
      },
    },
    {
      type: 'checkbox',
      name: 'folders',
      message: 'Select the challenge types:',
      choices: [
        'Web Exploitation',
        'Cryptography',
        'Forensics',
        'Reverse Engineering',
        'Miscellaneous',
        'Steganography',
        'Binary Exploitation',
        'Web Security',
      ],
      validate: (input: string[]): boolean | string =>
        input.length > 0
          ? true
          : 'You must select at least one challenge type.',
    },
    {
      type: 'confirm',
      name: 'initializeGit',
      message: 'Do you want to initialize a Git repository?',
      default: false,
    },
  ];

  const answers = await inquirer.prompt<UserInput>(questions);
  return answers;
};

export default async function initCommand(): Promise<void> {
  console.log('\n📁 Initializing a new CTF challenges Directory...\n');

  const answers: UserInput = await promptUser();

  const challengeDirectory = answers.platform;
  const challengePath = path.join(process.cwd(), challengeDirectory);

  // Create the main folder
  createFolder(challengePath);

  // Create subfolders for selected challenge types
  createSubfolders(challengePath, answers.folders);

  // Create ctf.json with the collected information
  const ctfJson = {
    platform: answers.platform,
    link: answers.link,
    folders: answers.folders,
  };
  createJsonFile(path.join(challengePath, 'ctf.json'), ctfJson);

  // Create a basic README.md with challenge info
  createReadmeFile(
    path.join(challengePath, 'README.md'),
    answers.platform,
    answers.folders,
    answers.link
  );

  // Initialize Git repository if chosen
  if (answers.initializeGit) {
    initializeGitRepo(challengePath);
    createGitignoreFile(path.join(challengePath, '.gitignore'));
  }
}
