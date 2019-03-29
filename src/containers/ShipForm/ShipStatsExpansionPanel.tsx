import React, { useState, useCallback, useEffect } from 'react'
import { shipStatKeys, Side } from 'kc-calculator'
import { observer } from 'mobx-react-lite'

import { Theme } from '@material-ui/core'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { makeStyles, withStyles } from '@material-ui/styles'
import Grid from '@material-ui/core/Grid'

import ShipStatDialog from './ShipStatDialog'
import HealthBarDialog from './HealthBarDialog'
import ShipStatLabel from './ShipStatLabel'
import { EquipmentIcon, StatLabel } from '../../components'

import { ObservableShip } from '../../stores'

const useStyles = makeStyles({
  stat: {
    marginLeft: 8
  }
})

interface ShipStatsExpansionPanelProps {
  ship: ObservableShip
  open?: boolean
}

const ShipStatsExpansionPanel: React.FC<ShipStatsExpansionPanelProps> = ({ ship, open = false }) => {
  const [expanded, setExpanded] = useState(open)
  const toggle = useCallback(() => setExpanded(value => !value), [])
  useEffect(() => {
    setExpanded(open)
  }, [open])
  const classes = useStyles()
  return (
    <ExpansionPanel expanded={expanded} elevation={0}>
      <ExpansionPanelSummary onClick={toggle} expandIcon={<ExpandMoreIcon />}>
        {/* <div style={{ display: 'flex', justifyContent: 'space-around', flexGrow: 1 }}>
          <ShipStatLabel className={classes.stat} ship={ship} statKey="hp" />
          <ShipStatLabel className={classes.stat} ship={ship} statKey="asw" />
          <ShipStatLabel className={classes.stat} ship={ship} statKey="luck" />
        </div> */}
      </ExpansionPanelSummary>

      <HealthBarDialog ship={ship} />

      <Grid container={true}>
        {shipStatKeys.map(statKey => (
          <Grid item={true} xs={6} key={statKey}>
            <ShipStatDialog statKey={statKey} ship={ship} />
          </Grid>
        ))}
      </Grid>
    </ExpansionPanel>
  )
}

export default ShipStatsExpansionPanel