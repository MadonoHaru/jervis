import React, { useCallback, useState } from 'react'

import Button, { ButtonProps } from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'

import { makeStyles } from '@material-ui/styles'

import { CloseButton } from './IconButtons'

const useStyles = makeStyles({
  close: { position: 'fixed', top: '10%', right: '10%' }
})

interface IDialogComponent {
  buttonLabel: React.ReactNode
  buttonProps?: ButtonProps
}

const DialogComponent: React.FC<IDialogComponent> = ({ buttonLabel, buttonProps = {}, children }) => {
  const [open, setOpen] = useState(false)
  const handleClose = useCallback(() => setOpen(false), [])
  const handleClickOpen = useCallback(() => setOpen(true), [])

  const classes = useStyles()
  return (
    <>
      <Button {...buttonProps} onClick={handleClickOpen}>
        {buttonLabel}
      </Button>

      <Dialog open={open} onClose={handleClose} PaperProps={{ style: { background: 'rgba(0, 0, 0, 0.8)' } }}>
        {children}
        <CloseButton className={classes.close} size="large" onClick={handleClose} />
      </Dialog>
    </>
  )
}
export default DialogComponent
