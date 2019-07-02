import { TEnemyFleet } from '*maps'
import {
  Side,
  FleetTypeName,
  Formation,
  BattleFleet,
  IShip,
  IShipDataObject,
  IEquipment,
  IEquipmentDataObject
} from 'kc-calculator'
import kcObjectFactory, { masterData } from '../../stores/kcObjectFactory'
import { ObservableOperation } from '../../stores'

const masterIdToDataObject = (masterId: number) => {
  const master = masterData.findMasterShip(masterId)
  if (!master) {
    return undefined
  }
  return {
    masterId: master.id,
    level: 1,
    slots: master.slotCapacities.concat(),
    equipments: master.equipments.map(equip => {
      if (equip === undefined) {
        return undefined
      }
      if (typeof equip === 'number') {
        return { masterId: equip }
      }
      return { masterId: equip.id, improvement: equip.improvement }
    })
  }
}

const masterIdsToFleet = (ids: number[]) => {
  if (ids.length === 0) {
    return undefined
  }
  return kcObjectFactory.createFleet({ ships: ids.map(masterIdToDataObject) })
}

const stringToFormation = (value: string, isCombinedFleet?: boolean) => {
  const formation = Formation.values.find(({ name }) => name === value)
  const defaultFormation = isCombinedFleet ? Formation.CruisingFormation4 : Formation.LineAhead
  return formation || defaultFormation
}

export const createEnemyBattleFleet = (enemy: TEnemyFleet) => {
  const { ships, formation: formationName } = enemy
  const mainFleet = masterIdsToFleet(ships.slice(0, 6))
  if (!mainFleet) {
    return undefined
  }
  const escortFleet = masterIdsToFleet(ships.slice(6, 12))
  const isCombinedFleet = ships.length > 6
  const fleetType = isCombinedFleet ? FleetTypeName.Combined : FleetTypeName.Single

  const battleFleet = new BattleFleet(Side.Enemy, fleetType, [], mainFleet, escortFleet)
  battleFleet.formation = stringToFormation(formationName, isCombinedFleet)

  return battleFleet
}

const equipmentToDataObject = (equip?: IEquipment | undefined): IEquipmentDataObject | undefined =>
  equip && { masterId: equip.masterId }

const shipToDataObject = (ship?: IShip): IShipDataObject | undefined => {
  if (!ship) {
    return undefined
  }
  const { masterId, level, equipments, slots } = ship
  return {
    masterId,
    level,
    slots,
    equipments: equipments.map(equipmentToDataObject)
  }
}

export const battleFleetToOperation = (fleet: BattleFleet) => {
  const { mainFleet, escortFleet, formation, isCombinedFleet } = fleet
  const name = '敵編成'
  const side = Side.Enemy
  const fleetType = isCombinedFleet ? FleetTypeName.Combined : FleetTypeName.Single

  const fleets = [{ ships: mainFleet.ships.map(shipToDataObject) }]
  if (escortFleet) {
    fleets.push({ ships: escortFleet.ships.map(shipToDataObject) })
  } else {
    fleets.push({ ships: [] })
  }

  const operation = ObservableOperation.create({
    name,
    side,
    fleetType,
    fleets,
    landBase: []
  })

  operation.setFormation(formation)

  return operation
}
