import React from 'react'
import { ResponsiveContainer, Tooltip, Legend, PieChart, Pie } from 'recharts';

const PieGraph = ({ data, height }) => {
  return (
    <ResponsiveContainer height={height}>
        <PieChart margin={{ top: 10, right: 10, left: 10, bottom: 30 }}>
            <Pie data={data} dataKey="value" nameKey="name" label/>
            <Tooltip />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
  )
}

export default PieGraph