import React from "react"
import { observer } from "mobx-react-lite"
import clsx from "clsx"
import { makeStyles } from "@material-ui/core/styles"

import Button from "@material-ui/core/Button"

import { ObservableOperation } from "../../stores"
import { useDragAndDrop } from "../../hooks"
import { swap } from "../../utils"

const useStyles = makeStyles(theme => ({
  button: {
    borderRadius: 0,
    boxSizing: "border-box",
    borderBlockEnd: `solid 2px rgba(0, 0, 0, 0)`,
    color: theme.palette.text.disabled
  },
  selected: {
    borderBlockEnd: `solid 2px ${theme.palette.primary.main}`,
    color: theme.palette.text.primary
  }
}))

type FleetTabProps = {
  className: string
  onClick: (value: number) => void
  index: number
  isCombinedFleet: boolean
  onSwap: (dragIndex: number, dropIndex: number) => void
}

const FleetTab: React.FC<FleetTabProps> = ({ className, onClick, index, isCombinedFleet, onSwap }) => {
  const handleClick = React.useCallback(() => onClick(index), [onClick, index])
  const [, ref] = useDragAndDrop({
    item: { type: "FleetTab", index },
    drop: dragItem => onSwap(dragItem.index, index)
  })
  const label = isCombinedFleet && index < 2 ? `連合第${index + 1}` : `${index + 1}`
  return (
    <Button innerRef={ref} variant="text" size="large" className={className} onClick={handleClick}>
      {label}
    </Button>
  )
}

type Props = {
  operation: ObservableOperation
}

const Component: React.FC<Props> = ({ operation }) => {
  const classes = useStyles()

  const value = operation.activeFleetIndex
  const lbIndex = operation.fleets.length
  const isCombinedFleet = operation.asKcObject.isCombinedFleetOperation

  const handleChange = React.useCallback(
    (value: number) => {
      operation.activeFleetIndex = value
    },
    [operation]
  )

  const handleSwap = React.useCallback(
    (dragIndex: number, dropIndex: number) => {
      const { fleets } = operation
      swap(fleets, dragIndex, fleets, dropIndex)
    },
    [operation]
  )

  const handleLbClick = React.useCallback(() => handleChange(lbIndex), [handleChange, lbIndex])

  return (
    <>
      {operation.fleets.map((fleet, index) => (
        <FleetTab
          key={index}
          className={clsx(classes.button, { [classes.selected]: index === value })}
          onClick={handleChange}
          index={index}
          isCombinedFleet={isCombinedFleet}
          onSwap={handleSwap}
        />
      ))}
      {operation.landBase.length > 0 && (
        <Button
          className={clsx(classes.button, { [classes.selected]: lbIndex === value })}
          variant="text"
          size="large"
          onClick={handleLbClick}
        >
          基地航空隊
        </Button>
      )}
    </>
  )
}

export default observer(Component)