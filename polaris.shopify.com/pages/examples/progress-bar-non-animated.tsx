import {ProgressBar} from '@shopify/polaris';
import React from 'react';
import {withPolarisExample} from '../../src/components/PolarisExampleWrapper';

function ProgressBarExample() {
  return (
    <div style={{width: 225}}>
      <ProgressBar progress={80} animated={false} />
    </div>
  );
}

export default withPolarisExample(ProgressBarExample);
