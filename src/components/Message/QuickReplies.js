import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Slider from 'react-slick'
import _map from 'lodash/map'
import _sum from 'lodash/sum'

import { truncate } from 'helpers'

import Text from './Text'
import { PrevArrow, NextArrow } from 'components/arrows'

class QuickReplies extends Component {
  state = {
    displayQuickReplies: this.props.isLastMessage,
    showArrow: true,
  }

  componentDidMount() {
    const widthQuickReplies = _sum(
      _map(this.buttons, button => {
        const dimensions = button.getBoundingClientRect()
        return dimensions.width
      }),
    )

    if (widthQuickReplies <= 270) {
      this.setState({ showArrow: false })
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ displayQuickReplies: nextProps.isLastMessage })
  }

  buttons = {}

  doSendMessage = message => {
    this.props.sendMessage(message)
    this.setState({ displayQuickReplies: false })
  }

  render() {
    const { content, style } = this.props
    const { displayQuickReplies, showArrow } = this.state
    const { title, buttons } = content

    return (
      <div
        className="RecastAppQuickReplies"
        ref={ref => {
          this.container = ref
        }}
      >
        <Text content={title} style={style} />

        {displayQuickReplies && buttons && !!buttons.length && (
          <Slider
            arrows={showArrow}
            variableWidth
            speed={200}
            infinite={false}
            draggable={false}
            prevArrow={<PrevArrow />}
            nextArrow={<NextArrow />}
            className="RecastAppSlider RecastAppQuickReplies--slider"
          >
            {buttons.map((b, i) => (
              <div
                ref={ref => {
                  this.buttons[i] = ref
                }}
                key={i}
                className="RecastAppQuickReplies--button"
                onClick={() => this.doSendMessage({ type: 'quickReply', content: b })}
                style={{
                  border: `1px solid ${style.accentColor}`,
                  color: style.accentColor,
                }}
              >
                {truncate(b.title, 20)}
              </div>
            ))}
          </Slider>
        )}
      </div>
    )
  }
}

QuickReplies.propTypes = {
  style: PropTypes.object,
  content: PropTypes.object,
  sendMessage: PropTypes.func,
}

export default QuickReplies
