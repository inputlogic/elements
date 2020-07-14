/* global afterEach test expect */

import { render } from 'preact'
import { RouteProvider, Router, StackRouter, SyncRouterState, Link, useRouter } from './index.js'

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

const RouteTest = () => {
  const { routeTo } = useRouter()
  routeTo('/users')
  return null
}

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
  },
  routeTest: {
    path: '/route-test',
    component: RouteTest
  }
}

afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

test('Router exports', () => {
  expect(typeof RouteProvider).toBe('function')
  expect(typeof Router).toBe('function')
  expect(typeof StackRouter).toBe('function')
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

test('Link should render', (done) => {
  // Wait till Router state is set, then check if Link
  // rendered the active class.
  const sync = state => {
    const link = document.body.querySelector('a')

    expect(state.path).toBeDefined()
    expect(state.route).toBeDefined()

    expect(link).toBeDefined()
    expect(link.className).toContain('active')
    expect(link.className).toContain('test')

    done()
  }

  render(
    <RouteProvider routes={routes}>
      <Link to='home' className='test' activeClass='active'>Go Home</Link>
      <Router routes={routes} />
      <SyncRouterState>{sync}</SyncRouterState>
    </RouteProvider>,
    document.body
  )

  expect(document.body.querySelector('#home')).toBeDefined()
  expect(document.body.querySelector('#users')).toBeNull()
  expect(document.body.querySelector('#user')).toBeNull()
})
