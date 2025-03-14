import fs from 'node:fs';
import path from 'node:path';

// Get the new project name from command line arguments
const newProjectName = process.argv[2];

if (!newProjectName) {
  console.error('Please provide a new project name as an argument');
  console.error('Usage: node scripts/rename-project.js <new-project-name>');
  process.exit(1);
}

const oldProjectName = 'rr7-supabase-starter';

const packgesJsonPath = [
  'package.json',
  'apps/web/package.json',
  'packages/supabase/package.json',
  'packages/ui/package.json',
  'packages/tsconfig/package.json',
];

// Function to recursively find all files in a directory
function findFiles(dir: string, excludeDirs: string[] = []) {
  let results: string[] = [];
  const list = fs.readdirSync(dir);

  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    // Skip excluded directories
    if (stat.isDirectory() && excludeDirs.includes(file)) {
      continue;
    }

    if (stat.isDirectory()) {
      results = results.concat(findFiles(filePath, excludeDirs));
    } else {
      results.push(filePath);
    }
  }

  return results;
}

// Function to update file content
function updateFileContent(filePath: string, oldName: string, newName: string) {
  try {
    // Skip binary files and large files
    const stat = fs.statSync(filePath);
    if (stat.size > 1024 * 1024) {
      // Skip files larger than 1MB
      return false;
    }

    // Skip files with these extensions
    const skipExtensions = [
      '.png',
      '.jpg',
      '.jpeg',
      '.gif',
      '.svg',
      '.ico',
      '.woff',
      '.woff2',
      '.ttf',
      '.eot',
      '.lock',
    ];
    if (skipExtensions.some((ext) => filePath.endsWith(ext))) {
      return false;
    }

    const content = fs.readFileSync(filePath, 'utf8');

    // Check if the file contains the old project name
    if (!content.includes(oldName)) {
      return false;
    }

    // Replace all occurrences of the old project name with the new one
    let newContent = content.replace(new RegExp(oldName, 'g'), newName);

    // Reset the version to 0.0.0
    if (packgesJsonPath.includes(filePath)) {
      const json = JSON.parse(newContent);
      json.version = '0.0.0';
      newContent = JSON.stringify(json, null, 2);
    }
    // Empty the CHANGELOG.md file
    if (filePath === 'CHANGELOG.md') {
      newContent = '';
    }

    // Write the updated content back to the file
    fs.writeFileSync(filePath, newContent, 'utf8');

    return true;
  } catch (error) {
    // If there's an error (e.g., binary file), skip the file
    return false;
  }
}

// Main function
function resetProject(newProjectName: string) {
  console.log(
    `Resetting project from "${oldProjectName}" to "${newProjectName}"...`,
  );

  // Find all files in the project, excluding node_modules, .git, and other build directories
  const excludeDirs = ['node_modules', '.git', 'dist', 'build', '.turbo'];
  const files = findFiles('.', excludeDirs);

  let updatedFiles = 0;

  // Update each file
  for (const file of files) {
    const updated = updateFileContent(file, oldProjectName, newProjectName);
    if (updated) {
      console.log(`Updated: ${file}`);
      updatedFiles++;
    }
  }

  console.log(`\nProject reset successfully! Updated ${updatedFiles} files.`);
  console.log('\nNext steps:');
  console.log(
    '1. Review the changes to ensure everything was updated correctly',
  );
  console.log('2. Run "pnpm install" to update the node_modules symlinks');
  console.log('3. Commit the changes');
}

resetProject(newProjectName);
