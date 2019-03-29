import React, { useCallback, useState } from 'react'
import ReactDOMServer from 'react-dom/server'
import { observer } from 'mobx-react-lite'
import ReactMde from 'react-mde'
import classNames from 'classnames'
import ReactMarkdown from 'react-markdown'
import 'react-mde/lib/styles/css/react-mde-all.css'

import Paper from '@material-ui/core/Paper'
import EditIcon from '@material-ui/icons/Edit'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import { ObservableOperation } from '../../stores'
import { makeStyles } from '@material-ui/styles'
import { useOpen } from '../../hooks'
import withIconButton from '../../hocs/withIconButton'
import { Theme } from '@material-ui/core'

const EditButton = withIconButton(EditIcon)

const useStyles = makeStyles({
  root: {
    display: 'flex',
    margin: 8,
    marginTop: 8 * 3,
    width: 800,
    minHeight: 8 * 41
  },
  markdown: {
    color: 'white',
    margin: 8,
    padding: '8px 24px',
    width: '100%'
  }
})

interface OperationDescriptionFieldProps extends React.HTMLAttributes<HTMLDivElement> {
  operation: ObservableOperation
}

const OperationDescriptionField: React.FC<OperationDescriptionFieldProps> = ({ operation, className, ...divProps }) => {
  const { description } = operation
  const classes = useStyles()
  const [tab, setTab] = useState<'write' | 'preview'>('write')
  const handleChange = useCallback(
    (value: string | undefined = '') => {
      operation.description = value
    },
    [operation]
  )
  const { open, onOpen, onClose } = useOpen()

  const generateMarkdownPreview = async (markdown: string) =>
    ReactDOMServer.renderToString(
      <ReactMarkdown className={classes.markdown} source={markdown.replace(/[ ]*(\r\n|\n|\r)/g, '  \n')} />
    )
  return (
    <>
      <div className={classNames(classes.root, className)} {...divProps}>
        <div>
          <EditButton title="編集" tooltipProps={{ placement: 'top' }} onClick={onOpen} />
        </div>

        <Paper className={classes.markdown}>
          {open ? (
            <ClickAwayListener onClickAway={onClose}>
              <ReactMde
                onTabChange={setTab}
                selectedTab={tab}
                value={description}
                onChange={handleChange}
                generateMarkdownPreview={generateMarkdownPreview}
              />
            </ClickAwayListener>
          ) : (
            <ReactMarkdown source={description.replace(/[ ]*(\r\n|\n|\r)/g, '  \n')} />
          )}
        </Paper>
      </div>
    </>
  )
}

export default observer(OperationDescriptionField)