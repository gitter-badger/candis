import React         from 'react'
import { connect }   from 'react-redux'
import classNames    from 'classnames'
import DataEditor    from '../widget/DataEditor'

import { writeFile } from '../../action/AsynchronousAction'

class CreatePanel extends React.Component {
  constructor (props) {
    super (props)

    this.onChange     = this.onChange.bind(this)

    this.onCreate     = this.onCreate.bind(this)
    this.onCancel     = this.onCancel.bind(this)
    this.onChangeData = this.onChangeData.bind(this)

    this.state        = CreatePanel.defaultStates
  }

  onChange (event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  onCreate ( ) {
    const data        = this.state.data
    const filename    = this.state.filename

    const attributes  = data.columns.map((column) => {
      return { name: column.name, type: column.type }
    })
    const rows        = data.rows.map((row) => {
      delete row.ID

      return row
    })

    const buffer      = { attributes: attributes, data: rows }
    const dispatch    = this.props.dispatch

    const params      = { name: filename, buffer: buffer }

    dispatch((dispatcher) => {
      writeFile(dispatcher, params)
    })

    dispatch(this.props.onCreate)
  }

  onCancel ( ) {
    this.props.dispatch(this.props.onCancel)
  }

  onChangeData (data) {
    this.setState({
      data: data
    })
  }

  render ( ) {
    return (
      <div className={classNames("panel panel-default", this.props.classNames.root)}>
        <div className="panel-body">
          <div className="form-group">
            <input className="form-control no-background no-border no-shadow"
              placeholder="Filename" name="filename" value={this.state.filename}
              onChange={this.onChange}/>
          </div>
          <DataEditor
            onChangeData={this.onChangeData}/>
        </div>
        <div className={classNames("panel-footer", this.props.classNames.footer)}>
          <div className="text-right">
            <div className="btn-group">
              <button className="btn btn-primary" onClick={this.onCreate}>
                <div className="text-uppercase font-bold">
                  Create
                </div>
              </button>
              <button className="btn btn-default" onClick={this.onCancel}>
                <div className="text-uppercase font-bold">
                  Cancel
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

CreatePanel.defaultStates =
{
  filename: "",
      data: { columns: [ ], rows: [ ] }
}

export default connect()(CreatePanel)
