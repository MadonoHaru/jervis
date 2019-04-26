import { IFleet, Side, FleetRole, nonNullable, BattleType, IOperation } from 'kc-calculator'
import { getCombinedFleetModifier } from 'kc-calculator/dist/Battle/AerialCombat/antiAir'
import AntiAirCutin from 'kc-calculator/dist/Battle/AerialCombat/AntiAirCutin'
import { fleetAntiAir as calcFleetAntiAir } from 'kc-calculator/dist/Battle/AerialCombat/antiAir'
import React, { useState } from 'react'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import FormationSelect from '../../../components/FormationSelect'

import MenuItem from '@material-ui/core/MenuItem'
import Select, { SelectProps } from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import { union } from 'lodash-es'
import { useFormation } from '../../../hooks'
import AerialCombatShipRow from './AerialCombatShipRow'
import calcAntiAirCutinRates from './calcAntiAirCutinRate'
import { toPercent } from '../ContactTable'
import AntiAirCutinRatePieChart from './AntiAirCutinRatePieChart'

const AntiAirCutInSelect: React.FC<{
  antiAirCutins: AntiAirCutin[]
  antiAirCutin?: AntiAirCutin
  onChange: (aaci: AntiAirCutin | undefined) => void
}> = ({ antiAirCutins, antiAirCutin, onChange }) => {
  const handleChange = (event: React.ChangeEvent<SelectProps>) => {
    onChange(AntiAirCutin.fromId(Number(event.target.value)))
  }
  const currentId = antiAirCutin ? antiAirCutin.id : 0
  return (
    <FormControl style={{ width: 120 }}>
      <InputLabel>対空CI</InputLabel>
      <Select variant="outlined" value={currentId} onChange={handleChange}>
        <MenuItem value={0}>なし</MenuItem>
        {antiAirCutins.map(aaci => (
          <MenuItem key={aaci.id} value={aaci.id}>
            {aaci.id}種(*{aaci.fixedAirDefenseModifier}+{aaci.minimumBonus})
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

type AerialCombatTableProps = {
  operation: IOperation

  fleet: IFleet
  isCombinedFleet?: boolean
  fleetRole: FleetRole
}

const AerialCombatTable: React.FC<AerialCombatTableProps> = ({ operation, fleet, isCombinedFleet, fleetRole }) => {
  const { formation, setFormation } = useFormation()
  const [antiAirCutin, setAntiAirCutin] = useState<AntiAirCutin | undefined>()
  const { side, mainFleet, escortFleet } = operation

  const formationModifier = formation.fleetAntiAirModifier
  let allShips = fleet.ships.filter(nonNullable)
  let fleetAntiAir = calcFleetAntiAir(fleet, side, formationModifier)
  let combinedFleetModifier: number | undefined
  if (isCombinedFleet && escortFleet) {
    allShips = mainFleet.ships.concat(escortFleet.ships).filter(nonNullable)
    fleetAntiAir =
      calcFleetAntiAir(mainFleet, side, formationModifier) + calcFleetAntiAir(escortFleet, side, formationModifier)
    combinedFleetModifier = getCombinedFleetModifier(BattleType.NormalBattle, fleetRole)
  }

  const antiAirCutins = union(...allShips.map(ship => AntiAirCutin.getPossibleAntiAirCutins(ship)))
  const aaciRateData = calcAntiAirCutinRates(allShips)

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <FormationSelect formation={formation} onChange={setFormation} />
        <AntiAirCutInSelect antiAirCutin={antiAirCutin} antiAirCutins={antiAirCutins} onChange={setAntiAirCutin} />
        <Typography color="primary">
          艦隊防空: {fleetAntiAir.toFixed(2)}
          {isCombinedFleet ? ` 連合艦隊補正: ${combinedFleetModifier}(通常戦固定)` : null}
        </Typography>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>艦娘</TableCell>
            <TableCell align="right">加重対空</TableCell>
            <TableCell align="right">割合撃墜</TableCell>
            <TableCell align="right">固定撃墜</TableCell>
            <TableCell align="right">最低保証</TableCell>
            <TableCell align="right">対空CI個艦発動率</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allShips.map((ship, index) => (
            <AerialCombatShipRow
              key={index}
              ship={ship}
              side={side}
              fleetAntiAir={fleetAntiAir}
              combinedFleetModifier={combinedFleetModifier}
              antiAirCutin={antiAirCutin}
            />
          ))}
        </TableBody>
      </Table>

      <Typography>対空CI艦隊発動率</Typography>
      <AntiAirCutinRatePieChart data={aaciRateData} />
    </>
  )
}

export default AerialCombatTable
