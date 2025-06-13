import { ModalUtilitiesProps } from "../types/types"

const closeModal = ({ ref }: ModalUtilitiesProps) => {
    ref.current?.classList.remove("open");
    document.body.style.overflow = "";
};

export default closeModal