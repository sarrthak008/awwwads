"use client";

import React, { useEffect, useRef } from "react";
import ToggleButton from "./ui/Toggle";
import { useAppSound } from "@/utils/soundHandler";
import useSettings from "@/store/settings";

const SettingPannel = () => {
  const { isBgSound, handelBgSound } = useSettings();
  const click = useAppSound({ sound: "click" });

  const audioRef = useRef<HTMLAudioElement>(null);

  // Play / Pause when state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isBgSound) {
      audio.play().catch(() => {
        console.log("Autoplay blocked until user interaction");
      });
    } else {
      audio.pause();
      audio.currentTime = 0; // Optional: restart from beginning when turned on again
    }
  }, [isBgSound]);

  const handelToggleButton = () => {
    click();
    handelBgSound(!isBgSound);
  };

  return (
    <div className="fixed bottom-3 right-3 z-[1000] rounded-md bg-white/30 px-2 py-1 backdrop-blur-md">
      <div className="flex items-center gap-2 text-white">
        <span>Audio</span>

        <ToggleButton
          isOn={isBgSound}
          onToggle={handelToggleButton}
        />

        <audio
          ref={audioRef}
          src="/sounds/bgAudio.mp3"
          loop
          preload="auto"
        />
      </div>
    </div>
  );
};

export default SettingPannel;