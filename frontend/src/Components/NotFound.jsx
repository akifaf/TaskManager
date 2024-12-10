import React from 'react'
import { Link } from 'react-router-dom'


function NotFound() {
  return (
    <div>
    <h1>Not Found 404</h1>
    <Link to='/'>Go to Home</Link>

    </div>
  )
}

export default NotFound