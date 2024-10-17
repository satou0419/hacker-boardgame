"use client"

import { useEffect, useState } from "react"
import "./board.scss"
import {
    FaDoorOpen,
    FaHackerrank,
    FaRedhat,
    FaSignOutAlt,
    FaUserSecret,
} from "react-icons/fa"
import { FaArrowRightFromBracket, FaRotate } from "react-icons/fa6"

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
    const [animatedBoxes, setAnimatedBoxes] = useState<{
        indices: number[]
        direction: string | null
    }>({
        indices: [],
        direction: null,
    })

    const [grid, setGrid] = useState<(BoxValue | string)[]>(
        Array(16).fill(null)
    )
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

    const handleBoxClick = (index: number) => {
        setActiveBox(index)
    }

    const rotateGridClockwise = (startIndex: number) => {
        const newGrid = [...grid]
        const temp = newGrid[startIndex]
        newGrid[startIndex] = newGrid[startIndex + 4]
        newGrid[startIndex + 4] = newGrid[startIndex + 5]
        newGrid[startIndex + 5] = newGrid[startIndex + 1]
        newGrid[startIndex + 1] = temp

        setAnimatedBoxes({
            indices: [
                startIndex,
                startIndex + 1,
                startIndex + 4,
                startIndex + 5,
            ],
            direction: "clockwise",
        })

        setGrid(newGrid)
        setTimeout(() => {
            setAnimatedBoxes({ indices: [], direction: null })
        }, 500)
    }

    const rotateGridCounterclockwise = (startIndex: number) => {
        const newGrid = [...grid]
        const temp = newGrid[startIndex]
        newGrid[startIndex] = newGrid[startIndex + 1]
        newGrid[startIndex + 1] = newGrid[startIndex + 5]
        newGrid[startIndex + 5] = newGrid[startIndex + 4]
        newGrid[startIndex + 4] = temp

        setAnimatedBoxes({
            indices: [
                startIndex,
                startIndex + 1,
                startIndex + 4,
                startIndex + 5,
            ],
            direction: "counterclockwise",
        })

        setGrid(newGrid)
        setTimeout(() => {
            setAnimatedBoxes({ indices: [], direction: null })
        }, 500)
    }

    const handleLegendClick = (legend: BoxValue) => {
        if (activeBox !== null) {
            const newGrid = [...grid]
            if (legend === "document") {
                const docLabel = `${docCount + 1} 📃`
                newGrid[activeBox] = docLabel
                setDocCount(docCount + 1)
            } else {
                newGrid[activeBox] = legend
            }
            setGrid(newGrid)
            setActiveBox(null)
        }
        setSelectedLegend(legend) // Set selected legend
    }

    // Function to calculate Manhattan distance
    const calculateManhattanDistance = (start: number, end: number) => {
        const gridSize = 4 // Assuming a 4x4 grid
        const startX = start % gridSize
        const startY = Math.floor(start / gridSize)
        const endX = end % gridSize
        const endY = Math.floor(end / gridSize)

        return Math.abs(startX - endX) + Math.abs(startY - endY)
    }

    const handleDragStart = (index: number, box: BoxValue) => {
        // Allow dragging only if the box contains an agent
        if (box && (box.includes("red-agent") || box.includes("blue-agent"))) {
            setActiveBox(index) // Store the index of the dragged agent
        }
    }

    const [redAgentMoves, setRedAgentMoves] = useState<string[]>([]) // Track red agent moves
    const [blueAgentMoves, setBlueAgentMoves] = useState<string[]>([]) // Track blue agent moves

    // Function to determine direction of movement
    const getMoveDirection = (start: number, end: number) => {
        const gridSize = 4 // Assuming a 4x4 grid
        const startX = start % gridSize
        const startY = Math.floor(start / gridSize)
        const endX = end % gridSize
        const endY = Math.floor(end / gridSize)

        if (startX === endX && startY > endY) return "⬆️"
        if (startX === endX && startY < endY) return "⬇️"
        if (startY === endY && startX > endX) return "⬅️"
        if (startY === endY && startX < endX) return "➡️"

        return "" // No valid move
    }

    // Function to handle drop with movement tracking
    const handleDrop = (index: number) => {
        if (activeBox !== null && activeBox !== index) {
            // Calculate the Manhattan distance between the dragged tile and the target tile
            const distance = calculateManhattanDistance(activeBox, index)

            // Only allow drop if the distance is 1 (adjacent tiles)
            if (distance === 1) {
                const newGrid = [...grid]
                const itemToMove = newGrid[activeBox] // Get the current agent or items in the box
                const moveDirection = getMoveDirection(activeBox, index) // Get move direction

                // Log movements for red or blue agents
                if (itemToMove && itemToMove.includes("red-agent")) {
                    setRedAgentMoves((prevMoves) => [
                        ...prevMoves,
                        moveDirection,
                    ])
                } else if (itemToMove && itemToMove.includes("blue-agent")) {
                    setBlueAgentMoves((prevMoves) => [
                        ...prevMoves,
                        moveDirection,
                    ])
                }

                // If the target box is not empty, we append the agent/items to it
                if (newGrid[index]) {
                    newGrid[index] = `${newGrid[index]}, ${itemToMove}` // Append agent/items to existing value
                } else {
                    newGrid[index] = itemToMove // Move agent/items if target box is empty
                }

                newGrid[activeBox] = null // Clear the original box
                setGrid(newGrid)
            } else {
                // If the tile is too far, display an alert
                alert("You can only move to an adjacent box!")
            }
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
                        <FaUserSecret style={{ color: "#e7135d" }} />
                    )}
                    {trimmedItem === "blue-agent" && (
                        <FaUserSecret style={{ color: "#74C0FC" }} />
                    )}
                    {trimmedItem.includes("📃") && (
                        <span>📃{trimmedItem.split(" ")[0]}</span> // Display document label
                    )}
                    {trimmedItem === "alarm" && "⏰"}
                    {trimmedItem === "virus" && "🦠"}
                    {trimmedItem === "red-exit" && (
                        <FaArrowRightFromBracket style={{ color: "#e7135d" }} />
                    )}
                    {trimmedItem === "blue-exit" && (
                        <FaArrowRightFromBracket style={{ color: "#74C0FC" }} />
                    )}
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
                <section className="value-legend">
                    {" "}
                    <span
                        className="red-agent"
                        onClick={() => handleLegendClick("red-agent")}
                    >
                        <FaUserSecret style={{ color: "#e7135d" }} /> Red Agent
                    </span>
                    <span
                        className="blue-agent"
                        onClick={() => handleLegendClick("blue-agent")}
                    >
                        <FaUserSecret style={{ color: "#74c0fc" }} /> Blue Agent
                    </span>
                    <span onClick={() => handleLegendClick("document")}>
                        📃 Document
                    </span>
                    <span onClick={() => handleLegendClick("alarm")}>
                        ⏰ Alarm
                    </span>
                    <span onClick={() => handleLegendClick("virus")}>
                        🦠 Virus
                    </span>
                    <span onClick={() => handleLegendClick("red-exit")}>
                        <FaArrowRightFromBracket style={{ color: "#e7135d" }} />
                        Red Exit
                    </span>
                    <span onClick={() => handleLegendClick("blue-exit")}>
                        <FaArrowRightFromBracket style={{ color: "#74C0FC" }} />
                        Blue Exit
                    </span>
                </section>

                <section className="circle-legend">
                    <FaRotate
                        style={{
                            color: "#ededed",
                            fontSize: "1.5em",
                            transform: "scaleY(-1)",
                            backgroundColor: "red",
                            borderRadius: "50%",
                        }}
                        id="legend-circle-1"
                    />
                    <FaRotate
                        style={{
                            color: "#ededed",
                            fontSize: "1.5em",
                            backgroundColor: "blue",
                            borderRadius: "50%",
                        }}
                        id="legend-circle-2"
                    />
                    <FaRotate
                        style={{
                            color: "#ededed",
                            fontSize: "1.5em",
                            transform: "scaleY(-1)",
                            backgroundColor: "orange",
                            borderRadius: "50%",
                        }}
                        id="legend-circle-3"
                    />
                    <FaRotate
                        style={{
                            color: "#ededed",
                            fontSize: "1.5em",
                            backgroundColor: "purple",
                            borderRadius: "50%",
                        }}
                        id="legend-circle-4"
                    />
                    <FaRotate
                        style={{
                            color: "#ededed",
                            fontSize: "1.5em",
                            transform: "scaleY(-1)",
                            backgroundColor: "green",
                            borderRadius: "50%",
                        }}
                        id="legend-circle-5"
                    />
                </section>
            </section>

            <section className="upper-platform">
                {/* Grid Section */}
                <section className="board-grid">
                    {grid.map((box, index) => (
                        <div
                            key={index}
                            className={`grid-box ${
                                activeBox === index ? "active" : ""
                            } ${
                                animatedBoxes.indices.includes(index)
                                    ? animatedBoxes.direction === "clockwise"
                                        ? "animate-clockwise"
                                        : "animate-counterclockwise"
                                    : ""
                            }`} // Use appropriate animation class based on the direction
                            onClick={() => handleBoxClick(index)}
                            draggable={
                                !!(
                                    box &&
                                    (box.includes("red-agent") ||
                                        box.includes("blue-agent"))
                                )
                            }
                            onDragStart={() => handleDragStart(index, box)}
                            onDragOver={handleDragOver}
                            onDrop={() => handleDrop(index)}
                        >
                            {renderBoxContent(box)}
                        </div>
                    ))}

                    {/* Intersection Circles */}
                    <div
                        className="intersection circle-1"
                        onClick={() => rotateGridCounterclockwise(0)}
                    >
                        <FaRotate
                            style={{
                                color: "#ededed",
                                fontSize: "1.5em",
                                transform: "scaleY(-1)",
                            }}
                        />
                    </div>
                    <div
                        className="intersection circle-2"
                        onClick={() => rotateGridClockwise(2)}
                    >
                        <FaRotate
                            style={{ color: "#ededed", fontSize: "1.5em" }}
                        />
                    </div>
                    <div
                        className="intersection circle-3"
                        onClick={() => rotateGridCounterclockwise(5)}
                    >
                        <FaRotate
                            style={{
                                color: "#ededed",
                                fontSize: "1.5em",
                                transform: "scaleY(-1)",
                            }}
                        />
                    </div>
                    <div
                        className="intersection circle-4"
                        onClick={() => rotateGridClockwise(8)}
                    >
                        <FaRotate
                            style={{ color: "#ededed", fontSize: "1.5em" }}
                        />
                    </div>
                    <div
                        className="intersection circle-5"
                        onClick={() => rotateGridCounterclockwise(10)}
                    >
                        <FaRotate
                            style={{
                                color: "#ededed",
                                fontSize: "1.5em",
                                transform: "scaleY(-1)",
                            }}
                        />
                    </div>
                </section>

                <section className="grid-controls">
                    <section className="movement-log">
                        <h3>Agent Movements Log</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Time</th>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <th key={i}> {i + 1}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>Platform</th>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <td key={i}></td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Red Agent</th>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <td key={i}>
                                            {redAgentMoves[i] || ""}
                                        </td>
                                    ))}
                                </tr>
                                <tr>
                                    <th>Blue Agent</th>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <td key={i}>
                                            {blueAgentMoves[i] || ""}
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
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
                </section>
            </section>

            <p>
                <i>
                    Note: Movement log is not yet functional but the gameboard
                    is now interactive don't forget to clcik "Save initial"
                    before playing so that you can revert it back anytime. XD
                </i>
            </p>
        </main>
    )
}
