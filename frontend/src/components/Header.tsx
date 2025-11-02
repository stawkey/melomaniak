import { faEye, faEyeSlash, faGear, faGripVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";
import columns from "./Columns";

const columnTuples = columns.map((col) => [(col as any).accessorKey, (col as any).header]);

interface HeaderProps {
    columnOrder: string[];
    setColumnOrder: (order: string[]) => void;
    columnVisibility;
    setColumnVisibility;
}

const Header: React.FC<HeaderProps> = ({
    columnOrder,
    setColumnOrder,
    columnVisibility,
    setColumnVisibility,
}) => {
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
        <div className="header">
            <div>
                <h1 className="logo">Filharmonia</h1>
            </div>
            <div className="settings-container" ref={ref}>
                <div
                    className="settings-gear"
                    onClick={() => setOpen((o) => !o)}
                    aria-haspopup="true"
                    aria-expanded={open}
                >
                    <FontAwesomeIcon icon={faGear} size="xl" />
                </div>

                {open && (
                    <div className="settings-menu" role="menu">
                        {orderedColumnTuples.map((tuple, index) => {
                            if (!tuple) return null;
                            const [accessorKey, header] = tuple;
                            return (
                                <div
                                    key={accessorKey}
                                    className="menu-item"
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
                                        className="menu-item-drag"
                                        icon={faGripVertical}
                                        size="2xs"
                                    />
                                    <div className="menu-item-text">{header}</div>
                                    {columnVisibility[accessorKey] ? (
                                        <FontAwesomeIcon
                                            className="menu-item-eye"
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
                                            className="menu-item-eye"
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
            </div>
        </div>
    );
};

export default Header;
