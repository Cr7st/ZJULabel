import * as React from 'react';

import {ResponsiveContainer, PieChart, Pie} from 'recharts';
const data = [
  {name: 'Group A', value: 400},
  {name: 'Group B', value: 300},
  {name: 'Group C', value: 300},
  {name: 'Group D', value: 200},
];

class TwolevelPiechart extends React.Component {
  static jsfiddleUrl = '//jsfiddle.net/alidingling/6okmehja/';

  render () {
    return (
      <div style={{width: '100%', height: 200}}>
        <ResponsiveContainer>
          <PieChart>
            <Pie dataKey="value" data={data} fill="#8884d8" label />
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}
export default TwolevelPiechart;
