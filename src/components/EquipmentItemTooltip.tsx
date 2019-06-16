import { makeStyles } from '@material-ui/styles'
import { sortBy as lodashSortBy } from 'lodash-es'
import { observer } from 'mobx-react-lite'
import React, { useCallback, useMemo } from 'react'
import { IEquipment, equipmentStatKeys } from 'kc-calculator'
import clsx from 'clsx'

import Box from '@material-ui/core/Box'
import Select, { SelectProps } from '@material-ui/core/Select'

import Typography from '@material-ui/core/Typography'
import Tooltip from '@material-ui/core/Tooltip'

import StatIcon from './StatIcon'
import StatLabel from './StatLabel'
import Flexbox from './Flexbox'
import EquipmentLabel from './EquipmentLabel'

type EquipmentItemTooltipProps = {
  item: IEquipment
  children: React.ReactElement
}

const EquipmentItemTooltip: React.FC<EquipmentItemTooltipProps> = ({ item, ...rest }) => {
  const stats = equipmentStatKeys.map(key => [key, item[key]] as const).filter(([key, stat]) => stat !== 0)
  const statElements = stats.map(([key, stat]) => (
    <Flexbox key={key}>
      <StatLabel statKey={key} stat={stat} visibleStatName />
    </Flexbox>
  ))
  return (
    <Tooltip
      enterDelay={300}
      title={
        <Box>
          <EquipmentLabel equipment={item} />
          {statElements}
        </Box>
      }
      {...rest}
    />
  )
}

export default EquipmentItemTooltip