import React from 'react'
import PropTypes from 'prop-types'
import { sanitizeUrl } from '@braintree/sanitize-url'
import propOr from 'ramda/es/propOr'
import cx from 'classnames'

import { truncate } from 'helpers'

import Button from 'components/Button'

const _getVaildTelHref = (button, readOnlyMode) => {
  if (button) {
    const { value } = button
    if (!readOnlyMode && value) {
      return value.indexOf('tel:') === 0 ? value : `tel:${value}`
    }
  }
  return '#'
}

const _getUrlInfo = (button, readOnlyMode) => {
  if (button) {
    const { value } = button
    const target = readOnlyMode ? '_self' : '_blank'
    const href = readOnlyMode || !value ? '#' : value
    return {
      target,
      href,
    }
  }
  return {}
}

const _getButtonTitle = (button, buttonTitleMaxLength) => {
  if (button) {
    const { title } = button
    return title ? truncate(title, buttonTitleMaxLength) : null
  }
  return null
}

const ListElement = ({ title, subtitle, imageUrl, buttons, sendMessage, readOnlyMode }) => {
  const titleMaxLength = 25
  const subTitleMaxLength = 50
  const buttonTitleMaxLength = 20

  const button = propOr(null, 0, buttons)
  const type = propOr('none', type, button)

  // https://sapjira.wdf.sap.corp/browse/SAPMLCONV-4781 - Support the pnonenumber options
  const buttonTitle = _getButtonTitle(button, buttonTitleMaxLength)
  const buttonClassName = cx('RecastAppListElement--button CaiAppListElement--button', { 'CaiAppListElement--ReadOnly': readOnlyMode })
  const telHref = _getVaildTelHref(button, readOnlyMode)
  let content = null
  switch (type) {
  case 'phonenumber':
    content = (
      <a
        className={buttonClassName}
        href={telHref}>
        {buttonTitle}
      </a>
    )
    break
  case 'web_url':
    if (sanitizeUrl(button.value) !== 'about:blank') {
      const { href, target } = _getUrlInfo(button, readOnlyMode)
      content = (
        <a
          className={buttonClassName}
          href={href}
          target={target}
          rel='noopener noreferrer'>
          {buttonTitle}
        </a>
      )
    } else {
      content = 'about:blank'
    }
    break
  default:
    break
  }

  return (
    <div className='RecastAppListElement CaiAppListElement'>
      {imageUrl
        && sanitizeUrl(imageUrl) !== 'about:blank' && (
        <img src={imageUrl} className='RecastAppListElement--img CaiAppListElement--img' />
      )}

      <div className='RecastAppListElement--container CaiAppListElement--container'>
        <p className='RecastAppListElement--title CaiAppListElement--title'>{truncate(title, titleMaxLength)}</p>
        <p className='RecastAppListElement--subtitle CaiAppListElement--subtitle'>{truncate(subtitle, subTitleMaxLength)}</p>

        {button
          && (content ? (content !== 'about:blank' && (
            content
          )
          ) : (
            <div
              className={buttonClassName}
              onClick={() => sendMessage({ type: 'text', content: button.value })}
            >
              {buttonTitle}
            </div>
          ))}
      </div>
    </div>
  )
}

ListElement.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  imageUrl: PropTypes.string,
  buttons: PropTypes.array,
  sendMessage: PropTypes.func,
  readOnlyMode: PropTypes.bool,
}

const List = ({ content, sendMessage, readOnlyMode }) => {
  const button = content.buttons && content.buttons[0]

  return (
    <div className={'RecastAppList CaiAppList'}>
      {content.elements.map((element, i) => (
        <ListElement
          key={i} {...element}
          sendMessage={sendMessage}
          readOnlyMode={readOnlyMode} />
      ))}

      {button && (
        <div className='RecastAppList--button CaiAppList--button'>
          <Button
            button={button}
            sendMessage={sendMessage}
            readOnlyMode={readOnlyMode} />
        </div>
      )}
    </div>
  )
}

List.propTypes = {
  content: PropTypes.object,
  sendMessage: PropTypes.func,
  readOnlyMode: PropTypes.bool,
}

export default List
