import type { Concert } from "../../models/Concert.type";
import styles from "./Card.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { toggleLike, isLiked } from "../../utils/likes";
import { useState } from "react";

function convertDate(dateString: string) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const time = `${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    return `${day}.${month}.${year} ${time}`;
}

const Card = ({ concert }: { concert: Concert }) => {
    const [state, setState] = useState(true);

    return (
        <div
            className={styles.concertCard}
            style={{ cursor: concert.detailsLink ? "pointer" : "default" }}
            onClick={() => {
                if (concert.detailsLink) {
                    window.open(concert.detailsLink, "_blank", "noopener,noreferrer");
                }
            }}
        >
            <div className={styles.cardHeader}>
                <div className={styles.headerRow}>
                    <div className={styles.cardTitle}>{concert.title}</div>
                    <div className={styles.cardDate}>{convertDate(String(concert.date))}</div>
                </div>

                <div className={styles.headerRow}>
                    <div className={styles.cardConcertType}>{concert.concertType}</div>
                    <div className={styles.cardSource}>{concert.source}</div>
                </div>
            </div>
            <div className={styles.cardBody}>
                <ul>
                    {concert.programmes?.map((piece, idx) => {
                        const pieceVal = piece as any;

                        const pieceTitle =
                            typeof pieceVal === "string"
                                ? pieceVal
                                : pieceVal.piece ?? JSON.stringify(pieceVal);

                        return <li key={idx}>{pieceTitle}</li>;
                    })}
                </ul>
            </div>
            <button
                className={styles.likeButton}
                onClick={(e) => {
                    e.stopPropagation();
                    toggleLike(concert);
                    setState(!state);
                }}
            >
                <FontAwesomeIcon
                    icon={faHeart}
                    style={{
                        color: isLiked(concert) ? "red" : "inherit",
                        transition: "color 0.2s ease",
                    }}
                />
            </button>
        </div>
    );
};

export default Card;
