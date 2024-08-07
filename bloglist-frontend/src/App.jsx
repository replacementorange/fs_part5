import { useState, useEffect, useRef } from 'react' // useRef hook is used to create a blogFormRef reference (toggable component)
import Blog from './components/Blog'
import Login from './components/Login'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import CreateBlog from './components/CreateBlog'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()
  const [message, setMessage] = useState(null)
  const [style, setStyle] = useState()
  const [user, setUser] = useState(null)
  const [newBlog, setNewBlog] = useState({title: '', author: '', url: ''})
  // https://fullstackopen.com/en/part5/props_children_and_proptypes#references-to-components-with-ref
  const blogFormRef = useRef(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const onChangeUsername = (e) => {setUsername(e.target.value)}
  const onChangePassword = (e) => {setPassword(e.target.value)}

  // login
  const handleLogin = async(event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password})

      window.localStorage.setItem(
        'loggedUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('Wrong credentials or password')
      setStyle({ color: 'red'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }
  
  // logout
  const handleLogout = (event) => {
    event.preventDefault()
    window.localStorage.removeItem('loggedUser')
    setUser(null)
  }

  // create new blog
  const handleCreateBlog = async(event) => {
    event.preventDefault()

    try {
      const response = await blogService.create(newBlog)
      setBlogs([...blogs,response])

      blogFormRef.current.toggleVisibility() // VISIBILITY
      setMessage(`a new blog '${newBlog.title}' by ${newBlog.author} has been added`)
      setStyle({ color: 'green'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)

    } catch (exception) {
      setMessage(`Error for create blog: ${exception}`)
      setStyle({ color: 'red'})
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const onChangeTitle = (e) => setNewBlog({ ...newBlog, title: e.target.value })
  const onChangeAuthor = (e) => setNewBlog({ ...newBlog, author: e.target.value })
  const onChangeUrl = (e) => setNewBlog({ ...newBlog, url: e.target.value })

  // https://fullstackopen.com/en/part5/login_in_frontend#exercises-5-1-5-4
  // if user is not logged in --> form is visible
  if (user===null) {
    return (
      <div>

        <Notification 
          message={message} 
          styles={style}
        />

        <h2>Login in to application</h2>

        <Login
          handleLogin={handleLogin}
          username={username}
          password={password}
          onChangeUsername={onChangeUsername}
          onChangePassword={onChangePassword}
          />

      </div>
    )
  }

  return (
    <div>

      <Notification 
          message={message} 
          styles={style}
        />

      <h2>blogs</h2>
      <p>Logged in as: <b>{user.name}</b> <button onClick={handleLogout}>Logout</button></p>

      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <CreateBlog
          title={newBlog.title}
          author={newBlog.author}
          url={newBlog.url}
          changeTitle={onChangeTitle}
          changeAuthor={onChangeAuthor}
          changeUrl={onChangeUrl}
          handleCreate={handleCreateBlog}
        />
      </Togglable>

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}

    </div>
  )
}

export default App