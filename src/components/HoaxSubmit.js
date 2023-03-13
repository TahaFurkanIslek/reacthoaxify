import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ProfileImageWithDefault from './ProfileImageWithDefault'
import { postHoax, postHoaxAttachment} from '../api/apiCalls'
import { useApiProgress } from '../shared/ApiProgress'
import ButtonWithProgress from './ButtonWithProgress'
import Input from './Input'
import AutoUploadImage from './AutoUploadImage'


const HoaxSubmit = () => {
    const { image } = useSelector((store) => ({ image: store.image }))
    const [focused, setFocused] = useState(false)
    const [hoax, setHoax] = useState('')
    const [errors, setErrors] = useState({})
    const [newImage, setNewImage] = useState()
    const { t } = useTranslation()
    const pendingApiCall = useApiProgress('post', '/api/1.0/hoaxes',true)
    const pendingFileUpload=useApiProgress('post','/api/1.0/hoax-attachments',true)

    useEffect(() => {
        setErrors({})
    }, [hoax])

    useEffect(() => {
        if (!focused) {
            setHoax('')
        }
        setErrors({})
        setNewImage()
    }, [focused])

    const onClickHoaxify = async () => {
        const body = {
            content: hoax
        }
        try {
            await postHoax(body)
            setHoax('')
            setFocused(false)
        } catch (error) {
            if (error.response.data.validationErrors) {
                setErrors(error.response.data.validationErrors)
            }
        }
    }

    const onChangeFile = (event) => {
        if (event.target.files.length < 1) {
          return //dosya/foto ekleme işlemi yapmamış isek files arrayine boş array atamasın diye
        }
        const file = event.target.files[0]
        const fileReader = new FileReader()
        fileReader.onloadend = () => {
          setNewImage(fileReader.result)
          uploadFile(file)
        }
        fileReader.readAsDataURL(file)
      }

    const uploadFile=async(file)=>{
        const attachment=new FormData()
        attachment.append('file',file)
        await postHoaxAttachment(attachment)
    } 

    let textAreaClass = "form-control"
    if (errors.content) {
        textAreaClass += " is-invalid"
    }
    return (
        <div className='card p-1 flex-row'>
            <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle me-1" />
            <div className='flex-fill'>
                <textarea
                    onChange={(event) => setHoax(event.target.value)}
                    className={textAreaClass}
                    rows={focused ? "3" : "1"}
                    onFocus={() => setFocused(true)}
                    value={hoax}
                />
                <div className="invalid-feedback">{errors.content}</div>
                {focused && 
                    <>
                    <div className="text-end mt-1">
                    <Input type="file" onChange={onChangeFile}/>
                    {newImage&&<AutoUploadImage image={newImage}/>}
                    <ButtonWithProgress
                        pendingApiCall={pendingApiCall}
                        className='btn btn-primary'
                        disabled={pendingApiCall}
                        text={"Hoaxify"}
                        onClick={onClickHoaxify} />
                    <button
                        disabled={pendingApiCall}
                        className='btn btn-light d-inline-flex ml-1'
                        onClick={() => setFocused(false)}>
                        <span class="material-icons">cancel</span>
                        {t('Cancel')}
                    </button>
                </div>
                </>}
            </div>
        </div>
    )
}

export default HoaxSubmit