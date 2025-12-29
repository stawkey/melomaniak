import {
    faBrush,
    faEye,
    faEyeSlash,
    faGear,
    faGripVertical,
    faHeart,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate } from "react-router-dom";
import columns from "../../views/Table/Columns";
import type { VisibilityState } from "@tanstack/react-table";
import styles from "./Header.module.css";

const columnTuples = columns.map((col) => [(col as any).accessorKey, (col as any).header]);

type HeaderProps = {
    columnOrder: string[];
    setColumnOrder: (order: string[]) => void;
    columnVisibility: VisibilityState;
    setColumnVisibility: React.Dispatch<React.SetStateAction<VisibilityState>>;
    viewMode: string;
    setViewMode: Dispatch<SetStateAction<"table" | "grid">>;
};

const Header = ({
    columnOrder,
    setColumnOrder,
    columnVisibility,
    setColumnVisibility,
    viewMode,
    setViewMode,
}: HeaderProps) => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const orderedColumnTuples = columnOrder.map((key) =>
        columnTuples.find(([accessorKey]) => accessorKey === key)
    );

    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => {
            document.removeEventListener("mousedown", handleClick);
        };
    }, []);

    const handleDragOver = (e: React.DragEvent, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newOrder = [...columnOrder];
        const draggedItem = newOrder[draggedIndex];
        newOrder.splice(draggedIndex, 1);
        newOrder.splice(index, 0, draggedItem);

        setColumnOrder(newOrder);
        setDraggedIndex(index);
    };

    return (
        <div className={styles.header}>
            <div>
                <h1 className={styles.logo}>Melomaniak</h1>
            </div>
            <div className={styles.settingsContainer} ref={ref}>
                {viewMode === "table" && (
                    <div
                        className={styles.headerItem}
                        onClick={() => setOpen((o) => !o)}
                        aria-haspopup="true"
                        aria-expanded={open}
                    >
                        <FontAwesomeIcon icon={faGear} size="xl" />
                    </div>
                )}

                {open && (
                    <div className={styles.settingsMenu} role="menu">
                        {orderedColumnTuples.map((tuple, index) => {
                            if (!tuple) return null;
                            const [accessorKey, header] = tuple;
                            return (
                                <div
                                    key={accessorKey}
                                    className={styles.menuItem}
                                    style={{
                                        cursor: draggedIndex === index ? "grabbing" : "grab",
                                        opacity: draggedIndex === index ? 0.8 : 1,
                                    }}
                                    role="menuitem"
                                    draggable
                                    onDragStart={() => setDraggedIndex(index)}
                                    onDragOver={(e) => handleDragOver(e, index)}
                                    onDragEnd={() => setDraggedIndex(null)}
                                >
                                    <FontAwesomeIcon
                                        className={styles.menuItemDrag}
                                        icon={faGripVertical}
                                        size="2xs"
                                    />
                                    <div className={styles.menuItemText}>{header}</div>
                                    {columnVisibility[accessorKey] ? (
                                        <FontAwesomeIcon
                                            className={styles.menuItemEye}
                                            icon={faEye}
                                            onClick={() =>
                                                setColumnVisibility((prev: any) => ({
                                                    ...prev,
                                                    [accessorKey]: false,
                                                }))
                                            }
                                        />
                                    ) : (
                                        <FontAwesomeIcon
                                            className={styles.menuItemEye}
                                            style={{ opacity: 0.6 }}
                                            icon={faEyeSlash}
                                            onClick={() =>
                                                setColumnVisibility((prev: any) => ({
                                                    ...prev,
                                                    [accessorKey]: true,
                                                }))
                                            }
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                <div
                    className={styles.headerItem}
                    onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
                >
                    <FontAwesomeIcon icon={faBrush} size="xl" />
                </div>
                <div className={styles.headerItem} onClick={() => navigate("/favorites")}>
                    <FontAwesomeIcon icon={faHeart} size="xl" />
                </div>
            </div>
        </div>
    );
};

export default Header;
