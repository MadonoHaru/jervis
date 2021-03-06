import React from "react"

type Status = "loading" | "failed" | "loaded"
type State = [string | undefined, Status]

const defaultState: State = [undefined, "loading"]

export const useImageSrc = (path: string) => {
  const [state, setState] = React.useState<State>(defaultState)

  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const src = require(`../images/${path}`)
  } catch {
    console.warn(`Cannot find: ${path}`)
  }

  React.useEffect(() => {
    import(`../images/${path}`)
      .then(res => {
        setState([res.default, "loaded"])
      })
      .catch(() => {
        console.warn(`Cannot find: ${path}`)
        setState([undefined, "failed"])
      })

    return () => setState(defaultState)
  }, [path])

  return state
}
