'use client';

import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

type TimelineProps = {
  min: number;
  max: number;
  value: number;
  onChange: (value: number) => void;
};

const Timeline = ({ min, max, value, onChange }: TimelineProps) => {
  return (
    <div className="timeline-container">
      <Slider
        min={min}
        max={max}
        value={value}
        onChange={(val) => onChange(val as number)}
      />
      <div className="timeline-labels">
        <span>{min}</span>
        <span className='font-bold text-lg'>{value}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};

export default Timeline;