import useSound from "use-sound";


const useAppSound = ({ sound }:{sound:string}) => {
    const [clickplay] = useSound('/sounds/oneClick.wav')

    switch (sound) {
        case "click":
            return (clickplay)

        default:
            break
    }
}


export {
    useAppSound
}