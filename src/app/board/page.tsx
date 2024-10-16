"use client"

import { useEffect, useState } from "react"
import "./board.scss"
import { FaRedhat } from "react-icons/fa"

// Types of items to assign
type BoxValue =
    | "red-agent"
    | "blue-agent"
    | "document"
    | "alarm"
    | "virus"
    | "red-exit"
    | "blue-exit"
    | string
    | null

export default function Board() {
    // Create an array of 16 boxes with null values initially
    const [grid, setGrid] = useState<(BoxValue | string)[]>(
        Array(16).fill(null)
    )
    // Create separate arrays for Red Agent and Blue Agent with null values initially
    const [redAgentGrid, setRedAgentGrid] = useState<(BoxValue | string)[]>(
        Array(10).fill(null)
    )
    const [blueAgentGrid, setBlueAgentGrid] = useState<(BoxValue | string)[]>(
        Array(10).fill(null)
    )

    const [PlatformGrid, setPlatformGrid] = useState<(BoxValue | string)[]>(
        Array(10).fill(null)
    )
    const [activeBox, setActiveBox] = useState<number | null>(null) // Track active box
    const [selectedLegend, setSelectedLegend] = useState<BoxValue | null>(null) // Track selected legend
    const [docCount, setDocCount] = useState<number>(0) // Document counter

    const [activeCell, setActiveCell] = useState<{
        section: string
        index: number | null
    }>({
        section: "",
        index: null,
    })

    const [initialGrid, setInitialGrid] = useState<(BoxValue | string)[]>(
        Array(16).fill(null)
    )
    const [initialRedAgentGrid, setInitialRedAgentGrid] = useState<
        (BoxValue | string)[]
    >(Array(10).fill(null))
    const [initialBlueAgentGrid, setInitialBlueAgentGrid] = useState<
        (BoxValue | string)[]
    >(Array(10).fill(null))

    // Handle box click to activate it
    const handleBoxClick = (index: number) => {
        setActiveBox(index)
    }

    // Function to handle key presses
    const handleKeyPress = (event: KeyboardEvent) => {
        if (activeCell.index !== null) {
            const { section, index } = activeCell

            if (section === "red-agent") {
                const newGrid = [...redAgentGrid]
                // Use the key pressed to determine the value
                switch (event.key) {
                    case "ArrowUp":
                        newGrid[index] = "⬆️" // Up arrow
                        break
                    case "ArrowDown":
                        newGrid[index] = "⬇️" // Down arrow
                        break
                    case "ArrowLeft":
                        newGrid[index] = "⬅️" // Left arrow
                        break
                    case "ArrowRight":
                        newGrid[index] = "➡️" // Right arrow
                        break
                    default:
                        break
                }
                setRedAgentGrid(newGrid)
            } else if (section === "blue-agent") {
                const newGrid = [...blueAgentGrid]
                // Use the key pressed to determine the value
                switch (event.key) {
                    case "ArrowUp":
                        newGrid[index] = "⬆️" // Up arrow
                        break
                    case "ArrowDown":
                        newGrid[index] = "⬇️" // Down arrow
                        break
                    case "ArrowLeft":
                        newGrid[index] = "⬅️" // Left arrow
                        break
                    case "ArrowRight":
                        newGrid[index] = "➡️" // Right arrow
                        break
                    default:
                        break
                }
                setBlueAgentGrid(newGrid)
            }
        }
    }

    // Effect to listen for key presses
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => handleKeyPress(event)
        window.addEventListener("keydown", handleKeyDown)

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeCell])

    const handleCellClick = (section: string, index: number) => {
        setActiveCell({ section, index })
        // Activate platform cell
        if (section === "platform") {
            setActiveBox(index) // Set active platform box
        }
    }

    // Function to rotate the 2x2 grid clockwise
    const rotateGridClockwise = (startIndex: number) => {
        const newGrid = [...grid]
        const temp = newGrid[startIndex]
        newGrid[startIndex] = newGrid[startIndex + 4] // Move box from (start + 4) to (start)
        newGrid[startIndex + 4] = newGrid[startIndex + 5] // Move box from (start + 5) to (start + 4)
        newGrid[startIndex + 5] = newGrid[startIndex + 1] // Move box from (start + 1) to (start + 5)
        newGrid[startIndex + 1] = temp // Move original start box to (start + 1)

        setGrid(newGrid)
    }

    // Function to rotate the 2x2 grid counterclockwise
    const rotateGridCounterclockwise = (startIndex: number) => {
        const newGrid = [...grid]
        const temp = newGrid[startIndex]
        newGrid[startIndex] = newGrid[startIndex + 1] // Move box from (start + 1) to (start)
        newGrid[startIndex + 1] = newGrid[startIndex + 5] // Move box from (start + 5) to (start + 1)
        newGrid[startIndex + 5] = newGrid[startIndex + 4] // Move box from (start + 4) to (start + 5)
        newGrid[startIndex + 4] = temp // Move original start box to (start + 4)

        setGrid(newGrid)
    }
    const handleLegendClick = (legend: BoxValue) => {
        if (activeBox !== null) {
            const newGrid = [...grid]
            if (legend === "document") {
                const docLabel = `${docCount + 1} 📃` // Create a document label
                newGrid[activeBox] = docLabel // Assign the document label to the active box
                setDocCount(docCount + 1) // Increment document count
            } else {
                newGrid[activeBox] = legend // Assign other legends
            }
            setGrid(newGrid) // Update grid state
            setActiveBox(null) // Deselect box after assigning
        }
        setSelectedLegend(legend) // Set selected legend
    }

    // Effect to listen for key presses
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => handleKeyPress(event)
        window.addEventListener("keydown", handleKeyDown)

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [activeCell])

    // Function to handle drag start
    // Function to handle drag start
    const handleDragStart = (index: number, box: BoxValue) => {
        // Allow dragging only if the box contains an agent
        if (box && (box.includes("red-agent") || box.includes("blue-agent"))) {
            setActiveBox(index) // Store the index of the dragged agent
        }
    }

    // Function to handle drop
    const handleDrop = (index: number) => {
        if (activeBox !== null && activeBox !== index) {
            // Ensure not dropping on itself
            const newGrid = [...grid]
            const itemToMove = newGrid[activeBox] // Get the current agent or items in the box

            // If the target box is not empty, we append the agent/items to it
            if (newGrid[index]) {
                // Append existing items and the item being moved
                newGrid[index] = `${newGrid[index]}, ${itemToMove}` // Append agent/items to existing value
            } else {
                newGrid[index] = itemToMove // Move agent/items if target box is empty
            }

            newGrid[activeBox] = null // Clear the original box
            setGrid(newGrid)
        }
        setActiveBox(null) // Reset active box after drop
    }

    // Ensure the drag over event always prevents the default action
    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault() // Prevent default to allow drop
    }

    const renderBoxContent = (box: BoxValue | string) => {
        if (!box) return null // Return null if box is empty

        return box.split(",").map((item, i) => {
            const trimmedItem = item.trim() // Trim whitespace from item
            return (
                <span key={i} style={{ display: "block" }}>
                    {trimmedItem === "red-agent" && (
                        <FaRedhat style={{ color: "red" }} />
                    )}
                    {trimmedItem === "blue-agent" && (
                        <FaRedhat style={{ color: "blue" }} />
                    )}
                    {trimmedItem.includes("📃") && (
                        <span>📃{trimmedItem.split(" ")[0]}</span> // Display document label
                    )}
                    {trimmedItem === "alarm" && "⏰"}
                    {trimmedItem === "virus" && "🦠"}
                    {trimmedItem === "red-exit" && "🟥"}
                    {trimmedItem === "blue-exit" && "🟦"}
                </span>
            )
        })
    }

    // Clear the grid and reset the document counter
    const clearGrid = () => {
        setGrid(Array(16).fill(null)) // Reset the grid to null values
        setDocCount(0) // Reset the document count
        setActiveBox(null) // Deselect any active box
        setSelectedLegend(null) // Clear the selected legend
        setActiveCell({ section: "", index: null }) // Clear active cell
    }
    const saveInitial = () => {
        setInitialGrid([...grid])
        setInitialRedAgentGrid([...redAgentGrid])
        setInitialBlueAgentGrid([...blueAgentGrid])

        // Alert user that the initial state has been saved
        alert("Initial state saved successfully!")
    }

    // Function to revert to the initial state
    const revertToInitial = () => {
        setGrid(initialGrid)
        setRedAgentGrid(initialRedAgentGrid)
        setBlueAgentGrid(initialBlueAgentGrid)
    }
    return (
        <main id="board-wrap">
            {/* Legend Section */}
            <section className="legend">
                <span
                    className="red-agent"
                    onClick={() => handleLegendClick("red-agent")}
                >
                    🔴 Red Agent
                </span>
                <span
                    className="blue-agent"
                    onClick={() => handleLegendClick("blue-agent")}
                >
                    🔵 Blue Agent
                </span>
                <span onClick={() => handleLegendClick("document")}>
                    📃 Document
                </span>
                <span onClick={() => handleLegendClick("alarm")}>⏰ Alarm</span>
                <span onClick={() => handleLegendClick("virus")}>🦠 Virus</span>
                <span onClick={() => handleLegendClick("red-exit")}>
                    🟥 Red Exit
                </span>
                <span onClick={() => handleLegendClick("blue-exit")}>
                    🟦 Blue Exit
                </span>
            </section>

            {/* Grid Section */}
            <section className="board-grid">
                {grid.map((box, index) => (
                    <div
                        key={index}
                        className={`grid-box ${
                            activeBox === index ? "active" : ""
                        }`}
                        onClick={() => handleBoxClick(index)}
                        draggable={
                            !!(
                                box &&
                                (box.includes("red-agent") ||
                                    box.includes("blue-agent"))
                            )
                        }
                        onDragStart={() => handleDragStart(index, box)}
                        onDragOver={handleDragOver} // Prevent default behavior to allow dropping
                        onDrop={() => handleDrop(index)} // Handle drop
                    >
                        {renderBoxContent(box)} {/* Render the box content */}
                    </div>
                ))}

                {/* Intersection Circles */}
                <div
                    className="intersection circle-1"
                    onClick={() => rotateGridCounterclockwise(0)}
                >
                    🔄️
                </div>
                <div
                    className="intersection circle-2"
                    onClick={() => rotateGridClockwise(2)}
                >
                    🔁
                </div>
                <div
                    className="intersection circle-3"
                    onClick={() => rotateGridCounterclockwise(5)}
                >
                    🔄️
                </div>
                <div
                    className="intersection circle-4"
                    onClick={() => rotateGridClockwise(8)}
                >
                    🔁
                </div>
                <div
                    className="intersection circle-5"
                    onClick={() => rotateGridCounterclockwise(10)}
                >
                    🔄️
                </div>
            </section>
            <div className="control-buttons">
                <button
                    className="control-button reset-button"
                    onClick={clearGrid}
                >
                    Clear Grid{" "}
                </button>
                <button
                    className="control-button save-button"
                    onClick={saveInitial}
                >
                    Save Initial
                </button>
                <button
                    className="control-button revert-button"
                    onClick={revertToInitial}
                >
                    Revert
                </button>
            </div>
            <section className="grid-4x11">
                <div className="grid-4x11-row">
                    <div className="grid-4x11-box">Time</div>
                    {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} className="grid-4x11-box">
                            {i + 1}
                        </div>
                    ))}
                </div>

                <div className="grid-4x11-row">
                    <div className="grid-4x11-box">Platform</div>
                    {PlatformGrid.map((box, i) => (
                        <div
                            key={i}
                            className={`grid-4x11-box ${
                                activeCell.section === "platform" &&
                                activeCell.index === i
                                    ? "active"
                                    : ""
                            }`}
                        >
                            {box}
                        </div>
                    ))}
                </div>

                <div className="grid-4x11-row">
                    <div className="grid-4x11-box">Red Agent</div>
                    {redAgentGrid.map((box, i) => (
                        <div
                            key={i}
                            className={`grid-4x11-box ${
                                activeCell.section === "red-agent" &&
                                activeCell.index === i
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => handleCellClick("red-agent", i)}
                        >
                            {box}
                        </div>
                    ))}
                </div>

                <div className="grid-4x11-row">
                    <div className="grid-4x11-box">Blue Agent</div>
                    {blueAgentGrid.map((box, i) => (
                        <div
                            key={i}
                            className={`grid-4x11-box ${
                                activeCell.section === "blue-agent" &&
                                activeCell.index === i
                                    ? "active"
                                    : ""
                            }`}
                            onClick={() => handleCellClick("blue-agent", i)}
                        >
                            {box}
                        </div>
                    ))}
                </div>
            </section>
        </main>
    )
}
