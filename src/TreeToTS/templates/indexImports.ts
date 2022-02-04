export const commonImports = (esModule?: boolean): string =>
  `import { AllTypesProps, ReturnTypes } from './const${esModule ? '.js' : ''}';`;

export const envSpecificImports = (env: string) => `
${require(`./typescript/${env}/fetchImport`).default}
${require(`./typescript/${env}/websocketsImport`).default}
`;
