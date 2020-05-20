/* eslint no-useless-escape: 0 */
import React from 'react'

const delimiter = /((?:https?:\/\/)?(?:(?:[a-z0-9]?(?:[a-z0-9\-]{1,61}[a-z0-9])?\.[^\.|\s])+[a-z\.]*[a-z]+|(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3})(?::\d{1,5})*[a-z0-9.,_\/~#&=;%+?\-\\(\\)]*)/ig

const protocol = typeof window !== 'undefined'
  ? window.location.protocol
  : 'https:'

export function Linkify ({ text, anchorProps = {} }) {
  if (!text) return

  return text.split(delimiter).map(word => {
    const match = word.match(delimiter)
    if (match) {
      const url = match[0]
      const segments = url.split('/')

      // no scheme given, so check host portion length
      if (segments[1] !== '' && segments[0].length < 5) {
        return word
      }

      const href = url.indexOf('http') === 0 ? url : `${protocol}//${url}`

      return (
        <a href={href} {...anchorProps}>{url}</a>
      )
    } else {
      return word
    }
  })
}
