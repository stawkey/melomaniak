import type { Concert } from "../../models/Concert.type";
import type { Filter } from "../../models/Filter.type";
import type { Action } from "../../hooks/useFiltering";
import MasonryFilters from "../MasonryFilters/MasonryFilters";
import styles from "./MasonryView.module.css";
import Card from "../Card/Card";

type Props = {
    concerts: Concert[];
    filter: Filter;
    dispatch: React.ActionDispatch<[action: Action]>;
};

function MasonryView({ concerts, filter, dispatch }: Props) {
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
            <MasonryFilters filter={filter} dispatch={dispatch} />
            <div className={styles.concertMasonry}>
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
            </div>
        </>
    );
}

export default MasonryView;
