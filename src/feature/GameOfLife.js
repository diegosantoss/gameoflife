import React, { useState, useEffect, useRef } from 'react'
import produce from 'immer'
import './GameOfLife.css'

const numRows = 50
const numCols = 50

const gridRandom = () => {
  const grid = []
  for (let i = 0; i < numRows; i++) {
    const row = []
    for (let j = 0; j < numCols; j++) {
      row.push(Math.floor(Math.random() * 2))
    }
    grid.push(row)
  }
  return grid
}

const GameOfLife = () => {
  const gridEmpty = Array(numRows).fill(Array(numCols).fill(0))
  const [grid, setGrid] = useState(gridEmpty)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState([])
  const [stepLog, setStepLog] = useState(0)
  const [time, setTime] = useState(500)

  const runningRef = useRef(running)
  runningRef.current = running

  useEffect(() => {
    setTimeout(() => {
      if (!runningRef.current) {
        return
      }

      if (stepLog < 0) {
        setStepLog(0)
      }

      createLog()
      runGame()
    }, time)
  }, [runningRef.current, grid])

  useEffect(() => {
    setGrid(gridRandom())
  }, [])

  const runGame = () => {
    if (!runningRef.current) {
      return
    }

    let newGrid = produce(grid, gridDraft => {
      for (let row in grid) {
        for (let col in grid[row]) {
          let neighbors = getNeighborCount(row, col);

          if (grid[row][col] === 1) {
            if (neighbors < 2) {
              gridDraft[row][col] = 0;
            } else if (neighbors === 2 || neighbors === 3) {
              gridDraft[row][col] = 1;
            } else if (neighbors > 3) {
              gridDraft[row][col] = 0;
            }
          } else if (grid[row][col] === 0) {
            if (neighbors === 3) {
              gridDraft[row][col] = 1;
            }
          }
        }
      }
    });

    setGrid(newGrid)
  }

  const createLog = () => {
    let newLog = log
    newLog.push(grid)

    setLog(newLog)
  }

  const runLog = (step) => {
    const newGrid = log[step]
    setGrid(newGrid)
  }

  const steps = () => {
    setRunning(false)

    let newStep = stepLog - 1
    const getStep = log.length + newStep

    if (getStep >= 0) {
      setStepLog(newStep)
      runLog(getStep)
    }
  }

  const resetGame = () => {
    setRunning(false)
    setGrid(gridEmpty)
  }

  const newRandomGame = () => {
    setRunning(false)
    setGrid(gridRandom())
  }

  const getNeighborCount = (getRow, getCol) => {
    let count = 0;
    let row = Number(getRow);
    let col = Number(getCol);

    if (row - 1 >= 0) {
      if (grid[row - 1][col] === 1)
        count++;
    }

    if (row - 1 >= 0 && col - 1 >= 0) {
      if (grid[row - 1][col - 1] === 1)
        count++;
    }

    if (row - 1 >= 0 && col + 1 < numCols) {
      if (grid[row - 1][col + 1] === 1)
        count++;
    }

    if (col - 1 >= 0) {
      if (grid[row][col - 1] === 1)
        count++;
    }

    if (col + 1 < numCols) {
      if (grid[row][col + 1] === 1)
        count++;
    }

    if (row + 1 < numRows && col - 1 >= 0) {
      if (grid[row + 1][col - 1] === 1)
        count++;
    }

    if (row + 1 < numRows && col + 1 < numCols) {
      if (grid[row + 1][col + 1] === 1)
        count++;
    }

    if (row + 1 < numRows) {
      if (grid[row + 1][col] === 1)
        count++;
    }

    return count;
  }

  const updateTime = (type) => {
    if (type === '-') {
      setTime(time + 100)
    }

    if (type === '+') {
      setTime(time - 100)
    }
  }

  return (
    <>
      <table id="gameoflife">
        <tbody>
          {grid.map((rows, r) => (
            <tr key={r} data-row-id={r}>
              {rows.map((col, c) => (
                <td
                  key={c}
                  onClick={() => {
                    const newGrid = produce(grid, gridDraft => {
                      gridDraft[r][c] = gridDraft[r][c] ? 0 : 1
                    })

                    setGrid(newGrid)
                  }}
                  data-col-id={c}
                  data-row-id={r}
                  className={col ? 'alive' : 'dead'}
                ></td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="btns">
        <button
          onClick={() => {
            setRunning(!running)
            if (!running) {
              runningRef.current = true
            }
          }}> {running ? 'Stop' : 'Start'}</button>
        <button onClick={() => resetGame()}>Reset</button>
        <button onClick={() => newRandomGame()}>New Random</button>
        <button onClick={() => steps('prev')}>Prev</button>
        <button onClick={() => updateTime('-')}>Slow</button>
        <button onClick={() => updateTime('+')}>Fast</button>
      </div>

    </>
  )

}

export default GameOfLife