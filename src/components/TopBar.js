import React, { useEffect, useRef, useState } from 'react'
import logo from '../assets/hoaxify.png'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { logoutSuccess } from '../redux/authActions'
import ProfileImageWithDefault from './ProfileImageWithDefault'

const TopBar = (props) => {

    const { username, isLoggedIn, displayName, image } = useSelector((store) => ({
        isLoggedIn: store.isLoggedIn,
        username: store.username,
        displayName: store.displayName,
        image: store.image
    }))

    const menuArea=useRef(null)

    const[menuVisible,setMenuVisible]=useState(false)

    useEffect(() => {
      document.addEventListener('click',menuClickTracker)
      return ()=>{
        document.removeEventListener('click',menuClickTracker)
      }
    },[isLoggedIn])
    
    const menuClickTracker=(event)=>{
       if(menuArea.current===null || !menuArea.current.contains(event.target)){
            setMenuVisible(false)
       }
    }

    const dispatch = useDispatch()

    const onLogoutSuccess = () => {
        dispatch(logoutSuccess())
    }
    const { t } = useTranslation()
    let links = (
        <ul className="navbar-nav ms-auto">
            <li>
                <Link className="nav-link" to="/login" >
                    {t('Login')}
                </Link>
            </li>
            <li>
                <Link className="nav-link" to="/signup" >
                    {t('Sign Up')}
                </Link>

            </li>
        </ul>
    )
    if (isLoggedIn) {
        let dropDownClass='dropdown-menu p-0 shadow'
        if(menuVisible){
            dropDownClass +=' show'
        }
        links = (
            <ul className="navbar-nav ms-auto" ref={menuArea}>
                <li className="nav-item dropdown">
                    <div className='d-flex' style={{ cursor: 'pointer' }} onClick={()=>setMenuVisible(true)}>
                        <ProfileImageWithDefault image={image} width="32" height="32" className="rounded-circle m-auto" />
                        <span className='nav-link dropdown-toggle'>
                            {displayName}
                        </span>
                    </div>
                    <div className={dropDownClass}>
                        <Link className="nav-link dropdown-item d-flex" to={`/user/${username}`} onClick={()=>setMenuVisible(false)}>
                            <span className="material-icons text-info">person</span>
                            {t('My Profile')}
                        </Link>
                        <span className="nav-link dropdown-item d-flex" onClick={onLogoutSuccess} style={{ cursor: 'pointer' }}>
                            <span class="material-icons text-danger">logout</span>
                            {t("Logout")}
                        </span>
                    </div>
                </li>
            </ul>)
    }

    return (
        <div className="shadow-sm bg-light mb-2">
            <nav className="navbar navbar-light container navbar-expand">
                <Link className="navbar-brand" to="/">
                    <img src={logo} width="60" alt="Hoaxify Logo" />
                    Hoaxify
                </Link>
                {links}
            </nav>
        </div>
    )

}
export default TopBar