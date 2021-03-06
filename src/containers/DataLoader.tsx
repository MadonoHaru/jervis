import React, { useContext, useEffect, useState } from "react"

import Box from "@material-ui/core/Box"
import CircularProgress from "@material-ui/core/CircularProgress"

import { loadStores, ObservableOperation, TemporaryOperationStoreContext } from "../stores"
import { getOperation } from "../stores/firebase"
import { useWorkspace } from "../hooks"
import { JSONUncrush } from "../utils"

const loadOperation = async () => {
  const url = new URL(window.location.href)
  const filePath = url.searchParams.get("operation-path")
  const dataObject = url.searchParams.get("operation-json")
  const crushed = url.searchParams.get("crushed")

  url.search = ""
  window.history.replaceState("", "", url.href)

  if (filePath) {
    return await getOperation(filePath)
  }
  if (dataObject) {
    return ObservableOperation.create(JSON.parse(dataObject))
  }
  if (crushed) {
    return ObservableOperation.create(JSON.parse(JSONUncrush(decodeURIComponent(crushed))))
  }

  return undefined
}

const DataLoader: React.FC = ({ children }) => {
  const [isReady, setIsReady] = useState(false)
  const { openOperation } = useWorkspace()
  const temporaryOperationStore = useContext(TemporaryOperationStoreContext)

  useEffect(() => {
    const load = async () => {
      await loadStores()
      const operation = await loadOperation()
      if (operation instanceof ObservableOperation) {
        temporaryOperationStore.push(operation)
        openOperation(operation)
      }
      setIsReady(true)
    }
    load()
  }, [setIsReady])

  if (!isReady) {
    return (
      <Box width="100vw" height="100vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress size={120} />
      </Box>
    )
  }

  return <>{children}</>
}

export default DataLoader
