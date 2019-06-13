import React, { useState } from 'react'
import clsx from 'clsx'

import Box, { BoxProps } from '@material-ui/core/Box'
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import BuildIcon from '@material-ui/icons/Build'

import {
  EquipmentIcon,
  Flexbox,
  SlotSizePopover,
  EquipmentLabel,
  ProficiencySelect,
  ImprovementSelect,
  UpdateButton,
  ClearButton,
  EquipmentItemTooltip
} from '../../components'
import { ObservableEquipment } from '../../stores'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    slotSize: {
      color: theme.palette.grey[500],
      width: 16,
      paddingRight: 2,
      textAlign: 'right',
      flexShrink: 0
    },
    proficiency: {
      marginRight: 4
    },
    icon: {
      height: 24,
      marginRight: 4
    },
    name: {
      fontSize: '0.75rem',
      overflow: 'hidden',
      whiteSpace: 'nowrap'
    }
  })
)

type EquipmentItemControlLabelProps = {
  item: ObservableEquipment
  slotSize?: number
  maxSlotSize?: number
  onSlotSizeChange?: (value: number) => void
  onUpdateClick?: () => void
  equipable?: boolean
} & BoxProps

const EquipmentItemControlLabel: React.FC<EquipmentItemControlLabelProps> = ({
  item,
  onUpdateClick,
  slotSize,
  maxSlotSize,
  onSlotSizeChange,
  equipable = true,
  ...boxProps
}) => {
  const classes = useStyles()
  const [isMouseOver, setIsMouseOver] = useState(false)
  const visibleProficiency = item.asKcObject.category.isAerialCombatAircraft
  return (
    <Box
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      style={{ background: isMouseOver ? 'rgba(200, 200, 200, 0.1)' : undefined }}
    >
      <div className={classes.slotSize}>
        {slotSize === undefined || maxSlotSize === undefined ? (
          <BuildIcon style={{ fontSize: '0.875rem', verticalAlign: 'middle' }} />
        ) : (
          onSlotSizeChange && <SlotSizePopover value={slotSize} max={maxSlotSize} onChange={onSlotSizeChange} />
        )}
      </div>

      <Box
        display="flex"
        alignItems="center"
        width={`calc(100% - ${visibleProficiency ? 64 : 40}px)`}
        height="100%"
        onMouseEnter={() => setIsMouseOver(true)}
        onMouseLeave={() => setIsMouseOver(false)}
      >
        <EquipmentItemTooltip item={item.asKcObject}>
          <EquipmentIcon className={classes.icon} iconId={item.asKcObject.iconId} />
        </EquipmentItemTooltip>
        {isMouseOver ? (
          <>
            <UpdateButton title="変更" tooltipProps={{ placement: 'top' }} size="small" onClick={onUpdateClick} />
            <ClearButton title="削除" tooltipProps={{ placement: 'top' }} size="small" onClick={item.remove} />
          </>
        ) : (
          <Typography className={classes.name} color={equipable ? 'initial' : 'secondary'}>
            {item.asKcObject.name}
          </Typography>
        )}
      </Box>

      <Box display="flex" alignItems="center">
        {visibleProficiency && (
          <div className={classes.proficiency}>
            <ProficiencySelect internal={item.proficiency} onChange={item.changeProficiency} />
          </div>
        )}
        <ImprovementSelect value={item.improvement} onChange={item.changeImprovement} />
      </Box>
    </Box>
  )
}

export default EquipmentItemControlLabel
