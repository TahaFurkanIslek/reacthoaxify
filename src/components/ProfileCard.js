import React from 'react'
import { useParams } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import Input from './Input'
import { useEffect } from 'react'
import { updateUser } from '../api/apiCalls'
import { useApiProgress } from '../shared/ApiProgress'
import ButtonWithProgress from './ButtonWithProgress'
import { updateSuccess } from '../redux/authActions'


const ProfileCard = (props) => {
  const [inEditMode, setInEditMode] = useState(false)
  const [updatedDisplayname, setUpdatedDisplayName] = useState()
  const { username: loggedInUsername } = useSelector((store) => ({ username: store.username }))
  const routeParams = useParams()
  const pathUsername = routeParams.username
  const [user, setUser] = useState({})
  const [editable, setEditable] = useState(false)
  const [newImage, setNewImage] = useState()
  const [validationErrors, setValidationErrors] = useState({})
  const dispatch=useDispatch()

  useEffect(() => {
    setUser(props.user)
  }, [props.user])

  useEffect(() => {
    setEditable(pathUsername === loggedInUsername)
  }, [pathUsername, loggedInUsername])
  const { username, displayName, image } = user
  const { t } = useTranslation()

  useEffect(() => {
    setValidationErrors((previousValidationErrors) => ({ ...previousValidationErrors, displayName: undefined }))//setValidationErrors içinde olduğu için parametre otomatik olarak Validation error objesine denk geliyor
  }, [updatedDisplayname])

  useEffect(() => {
    setValidationErrors((previousValidationErrors) => ({ ...previousValidationErrors, image: undefined }))
  }, [newImage])

  const onClickSave = async () => {
    let image;
    if (newImage) {
      image = newImage.split(',')[1]//sadece encoded kısmı alıyoruz.
    }

    const body = {
      displayName: updatedDisplayname,
      image
    }
    try {
      const response = await updateUser(username, body)
      setInEditMode(false)
      setUser(response.data)
      dispatch(updateSuccess(response.data))
    } catch (error) {
      setValidationErrors(error.response.data.validationErrors)
    }

  }

  useEffect(() => {
    if (!inEditMode) {
      setUpdatedDisplayName(undefined)
      setNewImage(undefined)
    }
    else {
      setUpdatedDisplayName(displayName)
    }

  }, [inEditMode, displayName])

  const onChangeFile = (event) => {
    if (event.target.files.length < 1) {
      return //dosya/foto ekleme işlemi yapmamış isek files arrayine boş array atamasın diye
    }
    const file = event.target.files[0]
    const fileReader = new FileReader()
    fileReader.onloadend = () => {
      setNewImage(fileReader.result)
    }
    fileReader.readAsDataURL(file)
  }

  const pendingApiCall = useApiProgress('put', '/api/1.0/users/' + username)
  const { displayName: displayNameError, image: imageError } = validationErrors

  return (
    <div className='card text-center'>
      <div className='card-header'>
        <ProfileImageWithDefault
          className='rounded-circle shadow'
          width="200"
          height="200"
          alt={`${username} profile`}
          image={image}
          tempimage={newImage}
        />
      </div>
      <div className='card-body'>
        {!inEditMode && (
          <>
            <h3>
              {displayName}@{username}
            </h3>
            {editable && <button className="btn btn-success d-inline-flex" onClick={() => setInEditMode(true)}>
              <span class="material-icons">
                edit
              </span>
              {t('Edit')}
            </button>}
          </>
        )}
        {inEditMode && (
          <div>
            <div className='mb-2'>
              <Input
                label={t('Change Display Name')}
                error={displayNameError}
                defaultValue={displayName}
                onChange={(event) => { setUpdatedDisplayName(event.target.value) }} />
            </div>
            <Input type="file" error={imageError} onChange={onChangeFile} />
            <div>
              <ButtonWithProgress
                onClick={onClickSave}
                pendingApiCall={pendingApiCall}
                disabled={pendingApiCall}
                className="btn btn-primary d-inline-flex"
                text={
                  <>
                    <span class="material-icons">save_as</span>
                    {t('Save')}
                  </>
                } />
              <button
                disabled={pendingApiCall}
                className='btn btn-light d-inline-flex ml-1'
                onClick={() => setInEditMode(false)}
              >
                <span class="material-icons">cancel</span>
                {t('Cancel')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileCard
