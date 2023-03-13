import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getHoaxes, getNewHoaxCount, getNewHoaxes, getOldHoaxes } from '../api/apiCalls'
import HoaxView from './HoaxView'
import { useApiProgress } from '../shared/ApiProgress'
import Spinner from './Spinner'
import { useParams } from 'react-router-dom'

const HoaxFeed = () => {
  const [hoaxPage, setHoaxPage] = useState({ content: [], last: true, number: 0 })
  const { content, last } = hoaxPage
  const { username } = useParams()
  const [newHoaxCount, setNewHoaxCount] = useState(0)

  const path = username ? `/api/1.0/users/${username}/hoaxes?page=` : '/api/1.0/hoaxes?page='
  const initialHoaxLoadProgress = useApiProgress('get', path)

  let lastHoaxId = 0
  let firstHoaxId = 0
  if (hoaxPage.content.length > 0) {

    firstHoaxId = hoaxPage.content[0].id

    const lastHoaxIndex = hoaxPage.content.length - 1
    lastHoaxId = hoaxPage.content[lastHoaxIndex].id
  }

  const oldHoaxPath = username ? `/api/1.0/users/${username}/hoaxes/${lastHoaxId}` : `/api/1.0/hoaxes/${lastHoaxId}`
  const loadOldHoaxesProgress = useApiProgress('get', oldHoaxPath, true)

  const newHoaxPath=username?`/api/1.0/users/${username}/hoaxes/${firstHoaxId}?direction=after`:`/api/1.0/hoaxes/${firstHoaxId}?direction=after`
  const loadNewHoaxesProgress = useApiProgress('get',newHoaxPath, true)

  const { t } = useTranslation()

  useEffect(() => {
    const getCount = async () => {
        const response = await getNewHoaxCount(firstHoaxId, username)
        setNewHoaxCount(response.data.count)
    }
    let looper = setInterval(() => {
      getCount()
    }, 5000)
     return function cleanup() {
       clearInterval(looper)
     }
  }, [firstHoaxId, username])



  useEffect(() => {
    const loadHoaxes = async (page) => {
      try {
        const response = await getHoaxes(username, page)
        setHoaxPage(previousHoaxPage => ({
          ...response.data,
          content: [...previousHoaxPage.content, ...response.data.content]
        }))
      } catch (error) { }
    }
    loadHoaxes();
  }, [username])


  const loadOldHoaxes = async () => {
    const response = await getOldHoaxes(lastHoaxId, username)
    setHoaxPage(previousHoaxPage => ({
      ...response.data,
      content: [...previousHoaxPage.content, ...response.data.content]
    }))
  }

  const loadNewHoaxes = async () => {
    const response = await getNewHoaxes(firstHoaxId,username)
    setHoaxPage(previousHoaxPage => ({
      ...previousHoaxPage,
      content: [...response.data, ...previousHoaxPage.content]
    }))
    setNewHoaxCount(0)
  }

  if (content.length === 0) {
    return <div className='alert alert-secondary text-center'>{initialHoaxLoadProgress ? <Spinner /> : t('There are no hoaxes')}</div>
  }


  return (
    <div>
      {newHoaxCount > 0 &&
        (<div className='alert alert-secondary text-center mb-1'
          style={{ cursor: loadNewHoaxesProgress ? 'not-allowed' : 'pointer' }}
          onClick={loadNewHoaxesProgress ? () => { } : () => loadNewHoaxes()}
        >
          {loadNewHoaxesProgress?<Spinner/>:t('There are new hoaxes')}
        </div>)}
      {content.map(hoax => {
        return <HoaxView key={hoax.id} hoax={hoax} />
      })}
      {!last && <div className='alert alert-secondary text-center'
        style={{ cursor: loadOldHoaxesProgress ? 'not-allowed' : 'pointer' }}
        onClick={loadOldHoaxesProgress ? () => { } : () => loadOldHoaxes()}>
        {loadOldHoaxesProgress ? <Spinner /> : t('Load old hoaxes')}
      </div>}
    </div>
  )
}

export default HoaxFeed