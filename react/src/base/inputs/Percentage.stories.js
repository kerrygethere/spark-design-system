import React from 'react';
import SprkTextInput from './SprkTextInput/SprkTextInput';

export default {
  title: 'Components/Input/Percentage',
  decorators: [
    story => <div className="sprk-o-Box">{story()}</div>
  ],
  component: SprkTextInput,
  parameters: {
    jest: [
      'SprkErrorContainer',
      'SprkInputIconCheck',
    ],
    info: `
##### For design and usage information check out the [documentation.](https://spark-docs.netlify.com/using-spark/components/input)
    `,
  },
};

export const percentageInput = () => (
  <SprkTextInput
    label="Percentage"
    iconRight
    leadingIcon="percent"
    narrowWidth
    name="percentage"
    type="tel"
  />
);

percentageInput.story = {
  name: 'Default',
  parameters: {
    jest: [
      'SprkTextInput',
    ]
  },
};

export const invalidPercentageInput = () => (
  <SprkTextInput
    label="Percentage"
    iconRight
    leadingIcon="percent"
    narrowWidth
    name="percentage"
    type="tel"
    valid={false}
    errorMessage="There is an error on this field."
  />
);

invalidPercentageInput.story = {
  name: 'Invalid',
  parameters: {
    jest: [
      'SprkTextInput',
    ]
  },
};

export const disabledPercentageInput = () => (
  <SprkTextInput
    label="Percentage"
    iconRight
    leadingIcon="percent"
    narrowWidth
    name="percentage"
    type="tel"
    disabled
  />
);

disabledPercentageInput.story = {
  name: 'Disabled',
  parameters: {
    jest: [
      'SprkTextInput',
    ]
  },
};
