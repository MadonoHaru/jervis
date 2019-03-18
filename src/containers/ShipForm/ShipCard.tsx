import { observer } from 'mobx-react-lite'
import React, { useContext } from 'react'
import classNames from 'classnames'

import Paper, { PaperProps } from '@material-ui/core/Paper'
import Input from '@material-ui/core/Input'
import InputAdornment from '@material-ui/core/InputAdornment'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/styles'

import { RemoveButton, UpdateButton } from '../../components/IconButtons'
import { ShipImage } from '../../components'
import EquipmentField from '../EquipmentField'

import ShipStatsExpansionPanel from './ShipStatsExpansionPanel'

import { ObservableFleet, ObservableShip, OperationStoreContext, SettingStoreContext } from '../../stores'
import ShipCalculator from '../ShipCalculator'

const useStyles = makeStyles({
  top: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  shipImage: {
    display: 'flex',
    justifyContent: 'space-around'
  },
  equipments: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  equipment: {
    marginTop: 4
  }
})

interface ShipCardProps extends PaperProps {
  ship: ObservableShip
  fleet: ObservableFleet
}

const ShipCard: React.FC<ShipCardProps> = ({ ship, fleet, ...paperProps }) => {
  const settingStore = useContext(SettingStoreContext)
  const operationStore = useContext(OperationStoreContext)
  const classes = useStyles()

  const index = fleet.ships.indexOf(ship)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    ship.level = Number(event.target.value)
    ship.nowHp = ship.asKcObject.health.maxHp
  }

  return (
    <Paper {...paperProps}>
      <div className={classes.top}>
        <Typography variant="caption">
          {index + 1} ID:{ship.masterId} {ship.asKcObject.name}
        </Typography>
        <div style={{ alignItems: 'right' }}>
          <UpdateButton title="艦娘を変更" size="small" href={`#/ships/${fleet.id}/${index}`} />
          <RemoveButton title="艦娘を削除" size="small" onClick={ship.remove} />
        </div>
      </div>

      <div className={classes.shipImage}>
        <ShipImage masterId={ship.masterId} imageType="banner" />
        <Input
          style={{ width: 70 }}
          startAdornment={<InputAdornment position="start">Lv</InputAdornment>}
          value={ship.level}
          type="number"
          disableUnderline={true}
          onChange={handleChange}
          inputProps={{ min: 1 }}
        />
      </div>

      <ShipStatsExpansionPanel ship={ship} open={settingStore.operationPage.visibleShipStats} />

      {ship.equipments.map((equip, index) => (
        <EquipmentField
          key={index}
          className={classes.equipment}
          onEndDrag={operationStore.switchEquipment}
          parent={ship}
          index={index}
          equipment={equip}
          // style={{ width: '100%', height: 8 * 5 }}
        />
      ))}
      {/* <ShipCalculator ship={ship.asKcObject} /> */}
    </Paper>
  )
}

export default observer(ShipCard)
