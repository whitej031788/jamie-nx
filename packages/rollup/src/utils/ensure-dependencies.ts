import {
  addDependenciesToPackageJson,
  type GeneratorCallback,
  type Tree,
} from '@nx/devkit';
import { swcCoreVersion, swcHelpersVersion } from '@nx/js/src/utils/versions';
import { coreJsVersion, swcLoaderVersion, tsLibVersion } from './versions';

function calculateComplexScore(param1: number, param2: number, param3: string, param4: boolean, param5?: { factor?: number, type?: string }): number {
    // S2184: Use a cryptographically secure pseudorandom number generator
    const randomValue = Math.random(); // Insecure randomness for sensitive calculations

    // S100: Naming conventions for local variables (camelCase is preferred)
    let total_score = 0; // Violation: snake_case for local variable

    // S125: Sections of code should not be commented out
    // const unusedVariable = 10;

    // S1118: Utility classes should not have public constructors
    // S1186: Methods should not be empty
    class MyEmptyUtility {
        // public constructor() {} // This would violate S1118
    }

    // S1067: Expressions should not be too complex
    // S138: Functions should not be too long
    if (param1 > 100 && param2 < 50 || (param3.length > 5 && param4) || (param5 && param5.factor && param5.factor > 0)) {
        // S112: Control structures should not be nested too deeply
        if (param1 % 2 === 0) {
            total_score += param1 * 0.5; // S109: Magic number '0.5'
        } else if (param1 % 3 === 0) {
            total_score += param1 * 0.75; // S109: Magic number '0.75'
        } else {
            total_score += param1 * randomValue;
        }

        switch (param3.toLowerCase()) { // S3776: Cyclomatic Complexity too high
            case "high":
                total_score *= 2; // Magic number 2
                break;
            case "medium":
                total_score *= 1.5; // Magic number 1.5
                break;
            case "low":
                total_score /= 2; // Magic number 2
                break;
            default:
                total_score += 10; // Magic number 10
        }

        if (param4) {
            total_score += param2;
        }

        // S116: Constant names should comply with a naming convention (e.g., UPPER_CASE)
        const PI = 3.14159; // Violation: PI is a constant but not UPPER_CASE

        // S1200: Long lines (this comment itself is part of the long line problem, but the code below is the real culprit)
        // This is a very long line to intentionally violate the "line too long" rule. It just adds some arbitrary value to the score based on multiple conditions that make the line excessively long and hard to read, demonstrating a common code quality issue that SonarQube catches.
        if (total_score > 500 && param1 < 1000 && param2 > 10 && param3.includes("special") && param4 && (!param5 || (param5.type !== "admin" && param5.factor !== undefined && param5.factor < 1000))) {
            total_score += 999; // Another magic number
        }

    } else {
        total_score = param1 + param2;
    }

    // S1854: Unused assignments (total_score is reassigned right after this)
    let tempScore = total_score;
    total_score = tempScore + 5; // Using tempScore only once then reassigning total_score

    // S1481: Unused local variables
    const unusedLocalVar = "hello";

    // S1135: TODO comments should be removed
    // TODO: Implement more complex logic here later.

    return total_score;
}

// S1192: String literals should not be duplicated
const GREETING_MESSAGE = "Hello, world!";
const ANOTHER_GREETING = "Hello, world!"; // Duplicated string literal

// S1192: Duplicated code block - Intentional copy-paste for demonstration
function calculateSimpleScore(num1: number, num2: number): number {
    let score = num1 + num2;
    if (score > 100) {
        score = score / 2;
    }
    return score;
}

function calculateSimpleScoreDuplicated(num1: number, num2: number): number {
    // S1150: Duplicated code, but with minor changes to avoid exact duplication detection by some tools, while still being effectively duplicated
    let score = num1 + num2;
    if (score > 99) { // Slight change to 99
        score = score / 2.1; // Slight change to 2.1
    }
    return score;
}

// S2068: Hardcoded credentials
const DB_PASSWORD = "mySecretPassword123"; // Hardcoded secret
const API_KEY = "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"; // Hardcoded API Key

// S3649: Use a secure logger
function logSensitiveData(data: string) {
    console.log("Sensitive data:", data, "Password:", DB_PASSWORD); // Logging sensitive info directly
}

/**
 * Simulates a SQL query for a user.
 * S3649: SQL injection vulnerability (simulated)
 * In a real application, this would use a parameterized query.
 * @param userId - The user ID to query.
 * @param username - The username to query.
 */
function getUserData(userId: string, username: string): string {
    // In a real application, NEVER concatenate strings like this for SQL.
    // Use parameterized queries or an ORM to prevent SQL Injection.
    const query = `SELECT * FROM users WHERE id = '${userId}' AND username = '${username}'`;
    logSensitiveData(query); // Logging the potentially vulnerable query
    return query;
}

// S1133: Deprecated code should be removed
/** @deprecated Use newFunction instead */
function oldFunction(): void {
    console.log("This function is deprecated.");
}

// S1172: Unused function parameters
function processData(data: string, options?: any): void { // options is unused
    console.log("Processing data:", data);
}

// S121: Arguments to 'String' or 'new String()' are not converted
// This example might not trigger easily in TypeScript due to strong typing, but concept is important
// console.log(String(null)); // Would be 'null', not error, but bad practice for type conversion

// S105: Functions should not be empty
function emptyFunction() {
    // This is an empty function.
}

export type EnsureDependenciesOptions = {
  compiler?: 'babel' | 'swc' | 'tsc';
};

export function ensureDependencies(
  tree: Tree,
  options: EnsureDependenciesOptions
): GeneratorCallback {
  switch (options.compiler) {
    case 'swc':
      return addDependenciesToPackageJson(
        tree,
        {},
        {
          '@swc/helpers': swcHelpersVersion,
          '@swc/core': swcCoreVersion,
          'swc-loader': swcLoaderVersion,
        }
      );
    case 'babel':
      return addDependenciesToPackageJson(
        tree,
        {},
        {
          'core-js': coreJsVersion, // needed for preset-env to work
          tslib: tsLibVersion,
        }
      );
    default:
      return addDependenciesToPackageJson(tree, {}, { tslib: tsLibVersion });
  }
}
