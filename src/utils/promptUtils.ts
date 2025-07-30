export interface PromptVariables {
  [key: string]: string | number | boolean;
}

/**
 * Replaces variables in a prompt template with actual values
 * @param promptContent - The prompt template with {{variable}} placeholders
 * @param variables - Object containing variable names and their values
 * @returns The prompt with variables replaced
 */
export function replacePromptVariables(promptContent: string, variables: PromptVariables): string {
  let result = promptContent;
  
  // Replace all {{variable}} patterns with actual values
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'gi');
    result = result.replace(regex, String(value));
  });
  
  return result;
}

/**
 * Extracts variable names from a prompt template
 * @param promptContent - The prompt template with {{variable}} placeholders
 * @returns Array of variable names found in the prompt
 */
export function extractPromptVariables(promptContent: string): string[] {
  const regex = /{{([^}]+)}}/g;
  const variables: string[] = [];
  let match;
  
  while ((match = regex.exec(promptContent)) !== null) {
    const variableName = match[1].trim();
    if (!variables.includes(variableName)) {
      variables.push(variableName);
    }
  }
  
  return variables;
}

/**
 * Validates if all required variables are provided
 * @param promptContent - The prompt template
 * @param providedVariables - Object containing provided variables
 * @returns Object with isValid boolean and missing variables array
 */
export function validatePromptVariables(
  promptContent: string, 
  providedVariables: PromptVariables
): { isValid: boolean; missing: string[] } {
  const requiredVariables = extractPromptVariables(promptContent);
  const missing: string[] = [];
  
  requiredVariables.forEach(variable => {
    if (!(variable in providedVariables) || providedVariables[variable] === undefined || providedVariables[variable] === '') {
      missing.push(variable);
    }
  });
  
  return {
    isValid: missing.length === 0,
    missing
  };
}

/**
 * Creates a default variables object based on common CRO analysis variables
 * @param url - The website URL
 * @param industry - The industry name
 * @param country - The country code
 * @param pageType - The page type
 * @returns Object with default variables
 */
export function createDefaultVariables(
  url?: string,
  industry?: string,
  country?: string,
  pageType?: string
): PromptVariables {
  return {
    url: url || '',
    industry: industry || '',
    country: country || '',
    pageType: pageType || '',
    timestamp: new Date().toISOString(),
    // Add more default variables as needed
  };
}

/**
 * Formats a prompt for display by escaping HTML and highlighting variables
 * @param promptContent - The prompt content
 * @returns Formatted HTML string
 */
export function formatPromptForDisplay(promptContent: string): string {
  return promptContent
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/{{([^}]+)}}/g, '<span class="bg-yellow-200 px-1 rounded">{{$1}}</span>');
} 