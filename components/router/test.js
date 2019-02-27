/* global afterEach jest test expect */

import { render } from 'preact'
import createStore from 'atom'
import Router from './index.js'

function Provider (props) { this.getChildContext = () => ({ store: props.store }) }
Provider.prototype.render = props => props.children[0]

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

const store = createStore([], { currentPath: '/' })

afterEach(() => {
  document.getElementsByTagName('html')[0].innerHTML = ''
})

test('Router exports', () => {
  expect(typeof Router).toBe('function')
})

test('Router should render Home', () => {
  render(
    <Provider store={store}>
      <Router routes={routes} />
    </Provider>,
    document.body
  )

  expect(document.body.querySelector('#home')).toBeDefined()
  expect(document.body.querySelector('#users')).toBeNull()
  expect(document.body.querySelector('#user')).toBeNull()
})

test('Router should automatically wire up <a /> elements', () => {
  window.scrollTo = jest.fn()

  store.setState({ currentPath: '/users' })

  render(
    <Provider store={store}>
      <Router routes={routes} />
    </Provider>,
    document.body
  )

  expect(document.body.querySelector('#home')).toBeNull()
  expect(document.body.querySelector('#users')).toBeDefined()
  expect(document.body.querySelector('#user')).toBeNull()

  const anchor = document.body.querySelector('a')

  anchor.click()

  expect(store.getState().currentPath).toEqual(anchor.href.replace('http://localhost', ''))
})

test('Router should render parent routes', () => {
  store.setState({ currentPath: '/users/2' })

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
    <Provider store={store}>
      <Router routes={parentRoutes} />
    </Provider>,
    document.body
  )

  expect(document.body.querySelector('#parent')).toBeDefined()
  expect(document.body.querySelector('#user')).toBeDefined()
  expect(document.body.querySelector('#home')).toBeNull()
  expect(document.body.querySelector('#users')).toBeNull()
})
