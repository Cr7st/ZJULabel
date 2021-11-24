import * as React from 'react';
import {Steps, Icon} from 'antd';

const {Step} = Steps;

class Icons extends React.Component {
  render () {
    return (
      <Steps>
        <Step status="finish" title="Login" icon={<Icon type="user" />} />
        <Step
          status="finish"
          title="Verification"
          icon={<Icon type="solution" />}
        />
        <Step status="process" title="Pay" icon={<Icon type="loading" />} />
        <Step status="wait" title="Done" icon={<Icon type="smile-o" />} />
      </Steps>
    );
  }
}

export default Icons;
