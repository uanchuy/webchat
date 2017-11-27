import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cx from 'classnames'

import Text from './Text'
import Picture from './Picture'

import './style.scss'

class Message extends Component {

  render () {
    const { message } = this.props
    const { type, content } = message.attachment
    const isBot = message.participant.isBot

    return (
      <div className={cx('Message', { bot: isBot })}>
        <img
          className='Message--logo'
          src='https://cdn.recast.ai/bots/desjardins/icon-dialogue-chatbot.png'
        />

        {type === 'text' && <Text content={content} isBot={isBot} />}

        {type === 'picture' && <Picture content={content} isBot={isBot} />}
      </div>
    )
  }
}

Message.propTypes = {
  message: PropTypes.object,
}

export default Message
