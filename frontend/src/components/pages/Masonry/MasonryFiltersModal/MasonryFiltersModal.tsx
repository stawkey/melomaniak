import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./MasonryFiltersModal.module.css";
import { faX } from "@fortawesome/free-solid-svg-icons";

type Props = {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
};

const Modal = ({ open, onClose, children }: Props) => {
    if (!open) return null;

    return (
        <div
            className={styles.overlay}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className={styles.content} role="dialog">
                <button className={styles.close} onClick={onClose}>
                    <FontAwesomeIcon icon={faX} />
                </button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
