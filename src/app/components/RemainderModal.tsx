'use client'
import React, { useState } from "react";
import Calender from "../../../public/assets/Calender.svg";
import Image from "next/image";
import TimeSetter from "./TimeSetter";

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (time: string, period: string, days: string[]) => void;
}

const ReminderModal: React.FC<ReminderModalProps> = ({ isOpen, onClose, onSave }) => {
  const [time, setTime] = useState("03:00");
  const [period, setPeriod] = useState("pm");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const toggleDay = (day: string) => {
    if (day === "All") {
      setSelectedDays(selectedDays.includes("All") ? [] : ["All"]);
    } else {
      setSelectedDays(prev => 
        prev.includes(day) 
          ? prev.filter(d => d !== day) 
          : [...prev, day]
      );
    }
  };

  const handleTimeChange = (hours: number, minutes: number, isAM: boolean) => {
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    const timePeriod = isAM ? 'am' : 'pm';
    
    setTime(formattedTime);
    setPeriod(timePeriod);
  };

  const handleSave = () => {
    onSave(time, period, selectedDays.includes("All") ? ["All"] : selectedDays);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-2xl w-full max-w-5xl">
        <div>
          <Image src={Calender} alt="Calendar icon"/>  
        </div> 
        <div className="flex max-md:flex-col justify-between">
          <TimeSetter onTimeChange={handleTimeChange} />
          <div className="mb-6">
            <h3 className="text-2xl font-medium mb-3 text-black">Select Days</h3>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "All"].map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`p-8 max-md:p-4 rounded-[100%] font-semibold ${
                    selectedDays.includes(day) 
                      ? 'bg-[#00A578] text-white' 
                      : 'border border-black text-black'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
            <button 
              onClick={handleSave} 
              className="px-6 py-4 bg-[#005840] rounded-3xl font-semibold w-full text-2xl"
            >
              Save
            </button>
          </div>
        </div>       
      </div>
    </div>
  );
};

export default ReminderModal;