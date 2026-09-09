import { create } from "zustand";
import {persist} from "zustand/middleware"

interface SettingsStructure{
     isBgSound : boolean,
     handelBgSound  : (val:boolean)=>void
}

const useSettings = create<SettingsStructure>()(
    persist((set)=>({
      isBgSound : false,
      handelBgSound : (val)=>{set({
        isBgSound  : val
      })}
    }),{name : "_settings"})
)


export default useSettings