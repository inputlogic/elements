import React from 'react'
import { updateQuery } from '@app-elements/router'

import paginationRange from './paginationRange'
import styles from './style.less'

const pageBuilder = page => updateQuery({ page })

export class Pagination extends React.Component {
  render () {
    const { activePage, pageSize, request } = this.props
    const { count, next, previous } = request
    if (!count || count < pageSize) {
      return
    }

    const numPages = Math.ceil(count / pageSize)
    const pages = paginationRange(activePage, numPages)

    return (
      <nav className={styles.pagination}>
        {previous
          ? (
            <a href={pageBuilder(activePage - 1)}>
              <span className={[styles.arrow, styles.back].join(' ')} /> Back
            </a>
          )
          : (
            <span className={styles.disabled}>
              <span className={[styles.arrow, styles.back].join(' ')} /> Back
            </span>
          )}
        <ul>
          {pages.map(
            (page, index) => page
              ? (
                <li key={`page-${page}`}>
                  <a href={pageBuilder(page)} className={activePage === page ? styles.active : ''}>{page}</a>
                </li>
              )
              : <li key={`break-${index}`}>&hellip;</li>
          )}
        </ul>
        {next
          ? <a href={pageBuilder(activePage + 1)}>Next <span className={[styles.arrow, styles.next].join(' ')} /></a>
          : <span className={styles.disabled}>Next <span className={[styles.arrow, styles.next].join(' ')} /></span>}
      </nav>
    )
  }
}
