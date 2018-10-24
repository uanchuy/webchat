import React from 'react'
import PropTypes from 'prop-types'

import './style.scss'

const SendButton = ({sendMessage, preferences, value}) => (
    <div
        className="RecastSendButtonContainer"
    >
        <button
            className="RecastSendButton"
            onClick={sendMessage}
            disabled={!value}
        >
            <svg
                style={{
                    width: 40,
                    fill: value ? preferences.accentColor : preferences.botMessageColor,
                }}
                viewBox="0 0 30 18"
            >
                <path d="M26.79 9.38A0.31 0.31 0 0 0 26.79 8.79L0.41 0.02C0.36 0 0.34 0 0.32 0 0.14 0 0 0.13 0 0.29 0 0.33 0.01 0.37 0.03 0.41L3.44 9.08 0.03 17.76A0.29 0.29 0 0 0 0.01 17.8 0.28 0.28 0 0 0 0.01 17.86C0.01 18.02 0.14 18.16 0.3 18.16A0.3 0.3 0 0 0 0.41 18.14L26.79 9.38ZM0.81 0.79L24.84 8.79 3.98 8.79 0.81 0.79ZM3.98 9.37L24.84 9.37 0.81 17.37 3.98 9.37Z" />
            </svg>
        </button>
    </div>
)

SendButton.propTypes = {
    preferences: PropTypes.object,
    sendMessage: PropTypes.func,
    value: PropTypes.string
}

export default SendButton
