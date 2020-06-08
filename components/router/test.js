/* global afterEach test expect */

import { render } from 'preact'
import { RouteProvider, Router, Link } from './index.js'

const Home = () => (
  <div id='home'>Home</div>
)

const Users = () => (
  <div id='users'>
    <a href='/users/1'>User 1</a>
    <a href='/users/2'>User 2</a>
    <a href='/users/3'>User 3</a>
  </div>
)

const User = ({ id }) => (
  <div id='user'>User {id}</div>
)

const routes = {
  home: {
    path: '/',
    component: Home
  },
  users: {
    path: '/users',
    component: Users
  },
  user: {
    path: '/users/:id',
    component: User
  }
}

afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

test('Router exports', () => {
  expect(typeof Router).toBe('function')
})

test('Router should render Home', () => {
  render(
    <RouteProvider routes={routes}>
      <Router routes={routes} />
    </RouteProvider>,
    document.body
  )

  expect(document.body.querySelector('#home')).toBeDefined()
  expect(document.body.querySelector('#users')).toBeNull()
  expect(document.body.querySelector('#user')).toBeNull()
})

test('Router should render parent routes', () => {
  const Parent = () => (
    <div id='parent'>
      <Router routes={routes} />
    </div>
  )
  const parentRoutes = {
    parent: {
      routes,
      component: Parent
    }
  }

  render(
    <RouteProvider routes={routes} initialPath='/users/2'>
      <Router routes={parentRoutes} />
    </RouteProvider>,
    document.body
  )

  expect(document.body.querySelector('#parent')).toBeDefined()
  expect(document.body.querySelector('#user')).toBeDefined()
  expect(document.body.querySelector('#home')).toBeNull()
  expect(document.body.querySelector('#users')).toBeNull()
})

test('Link should render', () => {
  render(
    <RouteProvider routes={routes}>
      <Link to='home'>Go Home</Link>
      <Router routes={routes} />
    </RouteProvider>,
    document.body
  )

  expect(document.body.querySelector('#home')).toBeDefined()
  expect(document.body.querySelector('#users')).toBeNull()
  expect(document.body.querySelector('#user')).toBeNull()
  expect(document.body.querySelector('a')).toBeDefined()
  console.log(document.body.children[0])
})
