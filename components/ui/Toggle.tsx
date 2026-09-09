"use client";

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: (value: boolean) => void;
}


const ToggleButton=({isOn,onToggle,}: ToggleButtonProps) =>{
  return (
    <button
      onClick={() => onToggle(!isOn)}
      className={`relative h-[15px] w-[35px] cursor-pointer rounded-full transition-all duration-300 ${
        isOn ? "bg-orange-600" : "bg-zinc-700"
      }`}
    >
      <div
        className={`absolute top-[0.8] h-[12px] w-[12px] rounded-full bg-white transition-all duration-300 ${
          isOn ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </button>
  );
}


export default ToggleButton