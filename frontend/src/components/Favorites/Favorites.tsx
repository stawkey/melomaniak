import type { Concert } from "../../models/Concert.type";
import Card from "../common/Card/Card";
import styles from "./Favorites.module.css";

function Favorites() {
    const concerts: Concert[] = JSON.parse(localStorage.getItem("likedConcerts") || "[]");
    const leftColumn: Concert[] = [];
    const rightColumn: Concert[] = [];

    let leftHeight = 0;

    let rightHeight = 0;
    concerts.forEach((concert) => {
        const header = 81.6833;
        const programmeWeight =
            concert.programmes.length > 0 ? 32 + (concert.programmes?.length || 0) * 20 : 0;
        const estimatedCardHeight = header + programmeWeight;

        if (leftHeight <= rightHeight) {
            leftColumn.push(concert);
            leftHeight += estimatedCardHeight;
        } else {
            rightColumn.push(concert);
            rightHeight += estimatedCardHeight;
        }
    });
    return (
        <>
            <div className={styles.header}>
                <a href="/">
                    <h1 className={styles.logo}>Melomaniak</h1>
                </a>
            </div>
            <div className={styles.concertMasonry}>
                {concerts.length === 0 ? (
                    <div className={styles.noConcerts}>Brak polubionych koncertów.</div>
                ) : (
                    <>
                        <div className={styles.concertColumn}>
                            {leftColumn.map((concert) => (
                                <Card key={concert.id} concert={concert} />
                            ))}
                        </div>
                        <div className={styles.concertColumn}>
                            {rightColumn.map((concert) => (
                                <Card key={concert.id} concert={concert} />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default Favorites;
