import React, { useState, useRef, useCallback, useEffect } from 'react';

interface TimeSetterProps {
  onTimeChange?: (hours: number, minutes: number, isAM: boolean) => void;
}

const TimeSetter: React.FC<TimeSetterProps> = ({ onTimeChange }) => {
  const [hours, setHours] = useState(3);
  const [minutes, setMinutes] = useState(0);
  const [isAM, setIsAM] = useState(true);
  const [isDraggingHour, setIsDraggingHour] = useState(false);
  const [isDraggingMinute, setIsDraggingMinute] = useState(false);
  
  const clockRef = useRef<SVGSVGElement>(null);
  const centerX = 200;
  const centerY = 200;
  const clockRadius = 140;
  const dotRadius = 18;

  // Convert time to angles (0° = 12 o'clock, clockwise)
  const hourAngle = ((hours % 12) * 30) - 90; // 30° per hour
  const minuteAngle = (minutes * 6) - 90; // 6° per minute

  // Convert angle to coordinates
  const getCoordinates = (angle: number, radius: number) => {
    const radian = (angle * Math.PI) / 180;
    return {
      x: centerX + radius * Math.cos(radian),
      y: centerY + radius * Math.sin(radian)
    };
  };

  const hourPos = getCoordinates(hourAngle, clockRadius * 0.6);
  const minutePos = getCoordinates(minuteAngle, clockRadius * 0.85);

  // Get mouse/touch position relative to clock center
  const getRelativePosition = useCallback((clientX: number, clientY: number) => {
    if (!clockRef.current) return { x: 0, y: 0 };
    
    const rect = clockRef.current.getBoundingClientRect();
    const scale = 400 / rect.width; // SVG viewBox is 400x400
    
    return {
      x: (clientX - rect.left) * scale,
      y: (clientY - rect.top) * scale
    };
  }, []);

  // Convert coordinates to angle and time
  const getAngleFromPosition = (x: number, y: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  };

  const handleMouseDown = (type: 'hour' | 'minute') => (e: React.MouseEvent) => {
    e.preventDefault();
    if (type === 'hour') {
      setIsDraggingHour(true);
    } else {
      setIsDraggingMinute(true);
    }
  };

  const handleTouchStart = (type: 'hour' | 'minute') => (e: React.TouchEvent) => {
    e.preventDefault();
    if (type === 'hour') {
      setIsDraggingHour(true);
    } else {
      setIsDraggingMinute(true);
    }
  };

  const updateTime = useCallback((clientX: number, clientY: number, type: 'hour' | 'minute') => {
    const pos = getRelativePosition(clientX, clientY);
    const angle = getAngleFromPosition(pos.x, pos.y);
    
    if (type === 'hour') {
      const newHour = Math.round(angle / 30) % 12;
      setHours(newHour === 0 ? 12 : newHour);
    } else {
      const newMinute = Math.round(angle / 6) % 60;
      setMinutes(newMinute);
    }
  }, [getRelativePosition]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHour) {
        updateTime(e.clientX, e.clientY, 'hour');
      } else if (isDraggingMinute) {
        updateTime(e.clientX, e.clientY, 'minute');
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      if (isDraggingHour) {
        updateTime(touch.clientX, touch.clientY, 'hour');
      } else if (isDraggingMinute) {
        updateTime(touch.clientX, touch.clientY, 'minute');
      }
    };

    const handleEnd = () => {
      setIsDraggingHour(false);
      setIsDraggingMinute(false);
    };

    if (isDraggingHour || isDraggingMinute) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleEnd);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleEnd);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingHour, isDraggingMinute, updateTime]);

  useEffect(() => {
    onTimeChange?.(hours, minutes, isAM);
  }, [hours, minutes, isAM, onTimeChange]);

  const formatTime = (time: number) => time.toString().padStart(2, '0');

  return (
    <div className="flex flex-col items-center p-8 ">
      {/* Digital Display */}
      <div className="mb-12 flex items-center gap-6">
        <div className="flex items-center text-2xl font-light tracking-wider">
          <span className="text-blue-600 font-medium">{formatTime(hours)}</span>
          <span className="text-gray-800 mx-2">:</span>
          <span className="text-teal-600 font-medium">{formatTime(minutes)}</span>
        </div>
        <div className="flex flex-col gap-1 ml-4">
          <button
            onClick={() => setIsAM(true)}
            className={`px-4 py-2 text-2xl font-medium transition-all duration-200 rounded-lg ${
              isAM 
                ? 'text-gray-900 bg-white shadow-md' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            am
          </button>
          <button
            onClick={() => setIsAM(false)}
            className={`px-4 py-2 text-2xl font-medium transition-all duration-200 rounded-lg ${
              !isAM 
                ? 'text-gray-900 bg-white shadow-md' 
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            pm
          </button>
        </div>
      </div>

      {/* Clock Face */}
      <div className="relative">
        <svg
          ref={clockRef}
          width="160"
          height="160"
          viewBox="0 0 400 400"
          className="drop-shadow-xl"
        >
          {/* Outer gradient ring */}
          <defs>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#86efac" />
              <stop offset="50%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="rgba(0,0,0,0.15)"/>
            </filter>
          </defs>
          
          {/* Outer ring */}
          <circle
            cx={centerX}
            cy={centerY}
            r="190"
            fill="url(#ringGradient)"
            filter="url(#shadow)"
          />
          
          {/* Inner white circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="160"
            fill="white"
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {/* Hour markers */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (i * 30) - 90;
            const outerPos = getCoordinates(angle, 150);
            const innerPos = getCoordinates(angle, 135);
            return (
              <line
                key={i}
                x1={outerPos.x}
                y1={outerPos.y}
                x2={innerPos.x}
                y2={innerPos.y}
                stroke="#9ca3af"
                strokeWidth="2"
              />
            );
          })}

          {/* Minute markers */}
          {Array.from({ length: 60 }, (_, i) => {
            if (i % 5 !== 0) {
              const angle = (i * 6) - 90;
              const outerPos = getCoordinates(angle, 150);
              const innerPos = getCoordinates(angle, 145);
              return (
                <line
                  key={i}
                  x1={outerPos.x}
                  y1={outerPos.y}
                  x2={innerPos.x}
                  y2={innerPos.y}
                  stroke="#d1d5db"
                  strokeWidth="1"
                />
              );
            }
            return null;
          })}

          {/* Clock numbers */}
          {Array.from({ length: 12 }, (_, i) => {
            const number = i === 0 ? 12 : i;
            const angle = (i * 30) - 90;
            const pos = getCoordinates(angle, 120);
            return (
              <text
                key={i}
                x={pos.x}
                y={pos.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-2xl font-semibold fill-gray-800 select-none"
              >
                {number}
              </text>
            );
          })}

          {/* Connection line */}
          <line
            x1={hourPos.x}
            y1={hourPos.y}
            x2={minutePos.x}
            y2={minutePos.y}
            stroke="#6b7280"
            strokeWidth="2"
            strokeDasharray="5,5"
            opacity="0.5"
          />

          {/* Hour dot */}
          <circle
            cx={hourPos.x}
            cy={hourPos.y}
            r={dotRadius}
            fill="#047857"
            stroke="white"
            strokeWidth="3"
            className={`cursor-grab transition-all duration-200 ${
              isDraggingHour ? 'cursor-grabbing scale-110' : 'hover:scale-105'
            }`}
            onMouseDown={handleMouseDown('hour')}
            onTouchStart={handleTouchStart('hour')}
          />

          {/* Hour dot number */}
          <text
            x={hourPos.x}
            y={hourPos.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-sm font-bold fill-white select-none pointer-events-none"
          >
            {hours}
          </text>

          {/* Minute dot */}
          <circle
            cx={minutePos.x}
            cy={minutePos.y}
            r={dotRadius}
            fill="#0369a1"
            stroke="white"
            strokeWidth="3"
            className={`cursor-grab transition-all duration-200 ${
              isDraggingMinute ? 'cursor-grabbing scale-110' : 'hover:scale-105'
            }`}
            onMouseDown={handleMouseDown('minute')}
            onTouchStart={handleTouchStart('minute')}
          />

          {/* Minute dot number */}
          <text
            x={minutePos.x}
            y={minutePos.y}
            textAnchor="middle"
            dominantBaseline="central"
            className="text-sm font-bold fill-white select-none pointer-events-none"
          >
            {minutes}
          </text>

          {/* Center dot */}
          <circle
            cx={centerX}
            cy={centerY}
            r="4"
            fill="#374151"
          />
        </svg>

    
      </div>
    </div>
  );
};

export default TimeSetter;