import React from 'react'
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { Link } from 'react-router-dom'
import { format } from 'timeago.js'
import { useTranslation } from 'react-i18next'

const HoaxView = (props) => {
  const { hoax } = props
  const { userP, content ,timestamp} = hoax
  const { username, displayName, image } = userP

  const{i18n}=useTranslation()
  const formatted=format(timestamp,i18n.language)

  return (
    <div className='card p-1'>
      <div className='d-flex'>
        <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle m-1" />
        <div className='flex-fill m-auto p-2'>
          <Link to={`/user/${username}`} className="text-dark">
            <h6 className='d-inline'>
              {displayName}@{username}
            </h6>
            <span> - </span>
            <span>{formatted}</span>
          </Link>
        </div>
      </div>
      <div className='p-2'>
        {content}
      </div>

    </div>
  )
}
export default HoaxView