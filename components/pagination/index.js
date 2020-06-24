import React from 'react'

import { updateQuery } from '@app-elements/router'

import paginationRange from './paginationRange'

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
      <nav class='pagination'>
        {previous
          ? (
            <a href={pageBuilder(activePage - 1)}>
              <span className='arrow back' /> Back
            </a>
          )
          : (
            <span className='disabled'>
              <span className='arrow back' /> Back
            </span>
          )}
        <ul>
          {pages.map(
            (page, index) => page
              ? (
                <li key={`page-${page}`}>
                  <a href={pageBuilder(page)} className={activePage === page ? 'active' : ''}>{page}</a>
                </li>
              )
              : <li key={`break-${index}`}>&hellip;</li>
          )}
        </ul>
        {next
          ? <a href={pageBuilder(activePage + 1)}>Next <span className='arrow next' /></a>
          : <span className='disabled'>Next <span className='arrow next' /></span>}
      </nav>
    )
  }
}

export default Pagination
