import useSound from "use-sound";

type soundName = "click"

const useAppSound = ({ sound }:{sound:soundName}) => {
    const [clickplay] = useSound('/sounds/oneClick.wav')

    switch (sound) {
        case "click":
            return (clickplay)

        default:
           return (clickplay)
    }
}


export {
    useAppSound
}