import { IGear } from "kc-calculator"
import { observer } from "mobx-react-lite"
import React, { useCallback, useContext } from "react"

import IconButton from "@material-ui/core/IconButton"
import Visibility from "@material-ui/icons/Visibility"
import VisibilityOff from "@material-ui/icons/VisibilityOff"

import { DataTableCell } from "../../components/DataTable"

import { GearsDataStoreContext } from "../../stores"

const GearVisibilityCell: React.FC<{ gear: IGear }> = ({ gear }) => {
  const gearsDataStore = useContext(GearsDataStoreContext)
  const { masterId } = gear
  const { blackList } = gearsDataStore
  const Visible = !blackList.includes(masterId)
  const toggleVisible = useCallback(() => {
    if (Visible) {
      blackList.push(masterId)
    } else {
      gearsDataStore.blackList.splice(blackList.indexOf(masterId), 1)
    }
  }, [gear, Visible])
  return (
    <DataTableCell>
      <IconButton onClick={toggleVisible}>{Visible ? <Visibility /> : <VisibilityOff color="primary" />}</IconButton>
    </DataTableCell>
  )
}

export default observer(GearVisibilityCell)
