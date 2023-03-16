import {TextField} from '@shopify/polaris';
import {useState, useCallback} from 'react';
import {withPolarisExample} from '../../src/components/PolarisExampleWrapper';

function TextFieldWithSelectTextOnFocusExample() {
  const [textFieldValue, setTextFieldValue] = useState('Jaded Pixel');

  const handleTextFieldChange = useCallback(
    (value: string) => setTextFieldValue(value),
    [],
  );

  return (
    <TextField
      label="Store name"
      value={textFieldValue}
      onChange={handleTextFieldChange}
      selectTextOnFocus
      autoComplete="off"
    />
  );
}

export default withPolarisExample(TextFieldWithSelectTextOnFocusExample);
