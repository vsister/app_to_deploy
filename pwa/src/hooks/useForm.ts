// WIP:
// The following code was supposed to be a prototype of a form validation utility hook,
// but could not be completed due to time constraints

import React from 'react';

interface InputSchemaElement {
  validator?: () => void;
  onChange?: () => void;
  onError?: () => void;
}

// type InputSchema = Record<string, InputSchemaElement>;

interface InputSchema {
  [key: string]: InputSchemaElement;
}

interface UseFormParameters {
  onSubmit: any;
  inputSchema: {
    [key: string]: InputSchemaElement;
  };
  submitValidator: () => void;
}

interface UseFormReturnValues {
  handleSubmit: (event: any) => any;
  error: string;
  inputs: {
    [key: string]: {
      handleChange: (event: any) => void;
      error: string;
    };
  };
}

export const useForm = (params: UseFormParameters): any => {
  const { inputSchema } = params;

  const generateInputControls = () => {
    const inputControls = {} as {
      [key: string]: {
        handleChange: (event: any) => void;
        error: string;
      };
    };

    for (const schemaElement in inputSchema) {
      const inputControl = {
        [schemaElement]: {},
      };

      Object.assign(inputControls);
    }
  };
};
