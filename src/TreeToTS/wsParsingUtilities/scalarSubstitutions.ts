enum ModelType {
  VALUE_TYPES = 'ValueTypes',
  GRAPHQL_TYPES = 'GraphQLTypes',
  MODEL_TYPES = 'ModelTypes',
}

const replaceScalarsWithType =
  (typeToReplaceWith: string) => (modelType: ModelType, scalarName: string) => (zeusClientSourceCode: string) =>
    zeusClientSourceCode.split(`${modelType}["${scalarName}"]`).join(typeToReplaceWith);

// AppSync scalars https://docs.aws.amazon.com/appsync/latest/devguide/scalars.html
const STRING_EQUIVALENT_SCALARS = [
  'AWSDateTime',
  'AWSDate',
  'AWSTime',
  'AWSEmail',
  'AWSJSON',
  'AWSPhone',
  'AWSURL',
  'AWSIpAddress',
];

const NUMBER_EQUIVALENT_SCALARS = ['AWSTimestamp'];

const awsScalarReplacements = (modelType: ModelType) => {
  if (modelType === ModelType.VALUE_TYPES) {
    return [
      ...STRING_EQUIVALENT_SCALARS.map((s) => replaceScalarsWithType('boolean')(modelType, s)),
      ...NUMBER_EQUIVALENT_SCALARS.map((s) => replaceScalarsWithType('boolean')(modelType, s)),
    ];
  }
  return [
    ...STRING_EQUIVALENT_SCALARS.map((s) => replaceScalarsWithType('string')(modelType, s)),
    ...NUMBER_EQUIVALENT_SCALARS.map((s) => replaceScalarsWithType('number')(modelType, s)),
  ];
};

export const replaceCustomScalarsWithTypescriptEquivalent = (zeusClientSourceCode: string): string => {
  const allReplacements = [
    ...awsScalarReplacements(ModelType.GRAPHQL_TYPES),
    ...awsScalarReplacements(ModelType.VALUE_TYPES),
    ...awsScalarReplacements(ModelType.MODEL_TYPES),
  ];
  return allReplacements.reduce((sourceCode: string, replacementFn) => replacementFn(sourceCode), zeusClientSourceCode);
};
