import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import solc from 'solc';
import dotenv from 'dotenv';

// Initialize dotenv
dotenv.config();

// Get current filename and directory name for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure paths
const contractsDir = path.resolve(__dirname, '..', 'contracts');
const artifactsDir = path.resolve(__dirname, '..', 'contracts', 'artifacts');
const clientArtifactsDir = path.resolve(__dirname, '..', 'client', 'src', 'lib', 'contracts', 'artifacts');

// Ensure artifacts directories exist
fs.ensureDirSync(artifactsDir);
fs.ensureDirSync(clientArtifactsDir);

// Read contract source files
function getContractSources() {
  const sources = {};
  const contractFiles = fs.readdirSync(contractsDir).filter(file => file.endsWith('.sol'));
  
  contractFiles.forEach(file => {
    const filePath = path.resolve(contractsDir, file);
    const source = fs.readFileSync(filePath, 'utf8');
    sources[file] = { content: source };
  });
  
  return sources;
}

// Prepare compiler input
function getCompilerInput() {
  return {
    language: 'Solidity',
    sources: getContractSources(),
    settings: {
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode.object']
        }
      },
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  };
}

// Compile contracts
function compileContracts() {
  try {
    console.log('Compiling smart contracts...');
    
    const input = getCompilerInput();
    const jsonInput = JSON.stringify(input);
    const output = JSON.parse(solc.compile(jsonInput));
    
    // Check for errors
    if (output.errors) {
      const hasError = output.errors.some(error => error.severity === 'error');
      if (hasError) {
        console.error('Compilation errors:');
        output.errors.forEach(error => {
          console.error(error.formattedMessage);
        });
        process.exit(1);
      } else {
        // Just warnings
        console.warn('Compilation warnings:');
        output.errors.forEach(error => {
          console.warn(error.formattedMessage);
        });
      }
    }
    
    console.log('Compilation successful!');
    return output.contracts;
  } catch (error) {
    console.error('Compilation failed:', error);
    process.exit(1);
  }
}

// Extract ABIs and bytecode
function extractContractData(compiledContracts) {
  const artifacts = {};
  
  for (const file in compiledContracts) {
    for (const contractName in compiledContracts[file]) {
      const contract = compiledContracts[file][contractName];
      artifacts[contractName] = {
        abi: contract.abi,
        bytecode: contract.evm.bytecode.object
      };
    }
  }
  
  return artifacts;
}

// Save artifacts to JSON files
function saveArtifacts(artifacts) {
  for (const contractName in artifacts) {
    const artifact = artifacts[contractName];
    
    // Save full artifact (ABI + bytecode) in artifacts directory
    const fullArtifactPath = path.join(artifactsDir, `${contractName}.json`);
    fs.writeFileSync(
      fullArtifactPath,
      JSON.stringify(artifact, null, 2)
    );
    
    // Save ABI only in client artifacts directory
    const abiPath = path.join(clientArtifactsDir, `${contractName}ABI.json`);
    fs.writeFileSync(
      abiPath,
      JSON.stringify(artifact.abi, null, 2)
    );
    
    console.log(`Saved artifacts for ${contractName}`);
  }
}

// Mock deployment function (in a real scenario, we would deploy to a testnet/mainnet)
function mockDeployment() {
  // Generate mock addresses for the contracts
  const mockAddresses = {
    CodeCrewToken: '0x1234567890123456789012345678901234567890',
    RewardPoolManager: '0x2345678901234567890123456789012345678901',
    BountyContract: '0x3456789012345678901234567890123456789012'
  };
  
  // Save addresses to contract-addresses.json
  const addressesPath = path.join(artifactsDir, 'contract-addresses.json');
  fs.writeFileSync(
    addressesPath,
    JSON.stringify(mockAddresses, null, 2)
  );
  
  // Also save to client directory
  const clientAddressesPath = path.join(clientArtifactsDir, 'contract-addresses.json');
  fs.writeFileSync(
    clientAddressesPath,
    JSON.stringify(mockAddresses, null, 2)
  );
  
  // Create a TypeScript file to export the addresses
  const clientAddressesTsPath = path.join(clientArtifactsDir, 'contract-addresses.ts');
  fs.writeFileSync(
    clientAddressesTsPath,
    `// Auto-generated contract addresses
export const CODECREW_TOKEN_ADDRESS = '${mockAddresses.CodeCrewToken}';
export const REWARD_POOL_MANAGER_ADDRESS = '${mockAddresses.RewardPoolManager}';
export const BOUNTY_CONTRACT_ADDRESS = '${mockAddresses.BountyContract}';
`
  );
  
  console.log('Saved contract addresses');
}

// Main function
function main() {
  try {
    const compiledContracts = compileContracts();
    const artifacts = extractContractData(compiledContracts);
    saveArtifacts(artifacts);
    mockDeployment();
    console.log('Smart contract compilation and artifact generation complete');
  } catch (error) {
    console.error('Error in main process:', error);
    process.exit(1);
  }
}

// Run the script
main();