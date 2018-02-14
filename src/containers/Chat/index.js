import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { getLastMessageId } from 'selectors/messages'
import { postMessage, pollMessages, removeMessage } from 'actions/messages'

import Header from 'components/Header'
import Live from 'components/Live'
import Input from 'components/Input'

import './style.scss'

@connect(
  state => ({
    token: state.conversation.token,
    chatId: state.conversation.chatId,
    channelId: state.conversation.channelId,
    conversationId: state.conversation.conversationId,
    lastMessageId: getLastMessageId(state),
    messages: state.messages,
  }),
  {
    postMessage,
    pollMessages,
    removeMessage,
  },
)
class Chat extends Component {
  state = {
    isPolling: false,
    messages: this.props.messages,
  }

  componentDidMount() {
    this.doMessagesPolling()
  }

  componentWillReceiveProps(nextProps) {
    const { messages } = nextProps
    if (messages !== this.state.messages) {
      this.setState({ messages })
    }
  }

  sendMessage = attachment => {
    const { token, channelId, chatId } = this.props
    const payload = { message: { attachment }, chatId }

    this.props.postMessage(channelId, token, payload).then(() => {
      if (!this.state.isPolling) {
        this.doMessagesPolling()
      }
    })
  }

  cancelSendMessage = message => {
    this.props.removeMessage(message.id)
  }

  retrySendMessage = message => {
    this.props.removeMessage(message.id)
    this.sendMessage(message.attachment)
  }

  doMessagesPolling = async () => {
    this.setState({ isPolling: true })
    const { token, channelId, conversationId } = this.props
    let shouldPoll = true
    let index = 0

    do {
      const { lastMessageId } = this.props
      let shouldWaitXseconds = false
      let timeToSleep = 0
      try {
        const { waitTime } = await this.props.pollMessages(
          channelId,
          token,
          conversationId,
          lastMessageId,
        )
        shouldPoll = waitTime === 0
        shouldWaitXseconds = waitTime > 0
        timeToSleep = waitTime * 1000
      } catch (err) {
        shouldPoll = false
      }
      index++

      /**
       * Note: If the server returns a waitTime != 0, it means that conversation has no new messages since 2 minutes.
       * So, let's poll to check new messages every "waitTime" seconds (waitTime = 120 seconds per default)
       */
      if (shouldWaitXseconds) {
        index = 0
        this.setState({ isPolling: false })
        await new Promise(resolve => setTimeout(resolve, timeToSleep))
      } else if (!shouldPoll && index < 4) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    } while (shouldPoll || index < 4)

    this.setState({ isPolling: false })
  }

  render() {
    const { closeWebchat, messages, preferences } = this.props

    return (
      <div className="RecastAppChat">
        <Header closeWebchat={closeWebchat} preferences={preferences} />

        <Live
          messages={messages}
          preferences={preferences}
          sendMessage={this.sendMessage}
          onRetrySendMessage={this.retrySendMessage}
          onCancelSendMessage={this.cancelSendMessage}
        />
        <div
          className="RecastAppLive--slogan"
          style={{ backgroundColor: preferences.backgroundColor }}
        >
          {'We run with Recast.AI'}
        </div>
        <Input onSubmit={this.sendMessage} />
      </div>
    )
  }
}

Chat.propTypes = {
  postMessage: PropTypes.func,
  closeWebchat: PropTypes.func,
  pollMessages: PropTypes.func,
  chatId: PropTypes.string,
  channelId: PropTypes.string,
  lastMessageId: PropTypes.string,
  conversationId: PropTypes.string,
  messages: PropTypes.array,
  preferences: PropTypes.object,
}

export default Chat
