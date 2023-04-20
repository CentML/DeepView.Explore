import {render, screen } from '@testing-library/react';
import MemThroughputContainer from './MemThroughputContainer';

import { profiling_data } from "../data/mock_data";

test("Display sliders", () => {
    // ARRANGE
    render(<MemThroughputContainer analysisState={profiling_data} SENDMOCK={true}/>);
  
    // ASSERT
    const batchSize = screen.queryByText(/using predicted batch size/i);
    expect(batchSize).toBeNull();
    expect(screen.getByText(/peak memory usage/i)).toBeTruthy();
    expect(screen.getAllByText(/throughput/i)).toBeTruthy();
  });