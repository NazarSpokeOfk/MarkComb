import { ModalUtilitiesProps } from "../types/types"

const openModal = ({ref} : ModalUtilitiesProps) => {
    ref?.current?.classList.add("open");
    document.body.style.overflow = "hidden";
}

export default openModal