import React, { Component } from 'react'
import PropTypes from 'prop-types'

import './style.scss'

class Menu extends Component {
  constructor(props) {
    super(props)
    document.addEventListener('mousedown', this.handleMouseClick)
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleMouseClick)
  }

  handleMouseClick = e => {
    if (!this.node.contains(e.target) && e.target.id !== 'menu-svg') {
      this.props.closeMenu()
    }
  }

  render() {
    const { currentMenu, addMenuIndex, removeMenuIndex, postbackClick, closeMenu } = this.props
    const { title, call_to_actions } = currentMenu

    return (
      <div className="Menu" ref={node => (this.node = node)}>
        {!!title && (
          <div onClick={removeMenuIndex} className="MenuHeader">
            {title}
          </div>
        )}

        {call_to_actions.map((action, index) => {
          return (
            <div key={index} className="MenuElement">
              {action.type === 'postback' && (
                <div
                  onClick={() => {
                    postbackClick(action.payload)
                    closeMenu()
                  }}
                >
                  {action.title}
                </div>
              )}

              {action.type === 'nested' && (
                <div onClick={() => addMenuIndex(index)}>{action.title}</div>
              )}

              {action.type === 'web_url' && (
                <a
                  href={action.payload}
                  rel="noopener noreferrer"
                  target="_blank"
                  onClick={closeMenu}
                >
                  {action.title}
                </a>
              )}
            </div>
          )
        })}
      </div>
    )
  }
}

Menu.propTypes = {
  currentMenu: PropTypes.object,
  closeMenu: PropTypes.func,
  addMenuIndex: PropTypes.func,
  removeMenuIndex: PropTypes.func,
  postbackClick: PropTypes.func,
}

export default Menu
