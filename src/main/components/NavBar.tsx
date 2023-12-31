import '../../assets/css/nucleo-icons.css'
import '../../assets/css/nucleo-svg.css'
import '../../assets/css/material-dashboard.css'
import { useOktaAuth } from '@okta/okta-react'
import { SpinnerLoading } from '../utils/SpinnerLoading'
import { Link } from 'react-router-dom'
export const NavBar = () => {

  const {oktaAuth, authState} = useOktaAuth();

  if (!authState) {
    return <SpinnerLoading/>
  }

  const handleLogout = async () => oktaAuth.signOut();

  console.log(authState);

    return (
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
        <div className="container-fluid py-1 px-3">
          <nav aria-label="breadcrumb">
            
            <ol className="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5">
              <li className="breadcrumb-item text-sm"><a className="opacity-5 text-dark" href="javascript:;">Pages</a></li>
              <li className="breadcrumb-item text-sm text-dark active" aria-current="page">index</li>
            </ol>
            <h6 className="font-weight-bolder text-center mb-0">index</h6>
            
          </nav>
          <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
            <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                
                <div className="input-group input-group-outline">
                  <label className="form-label">Introduce para buscar</label>
                  <input type="text" className="form-control"/>
                </div>
                
            </div>
            <ul className="navbar-nav  justify-content-end">
            
              <li className="nav-item d-flex align-items-center">
                {!authState.isAuthenticated ?
                <Link to="/login" className="btn btn-outline-primary btn-sm mb-0 me-3">
                  <i className="fa fa-user me-sm-1"></i>
                  
                  <span className="d-sm-inline d-none">Iniciar sesión</span>
               
                </Link>
                 : 
                 <button onClick={handleLogout} className="btn btn-outline-primary btn-sm mb-0 me-3">
                 <i className="fa fa-user me-sm-1"></i>
                 
                 <span className="d-sm-inline d-none">Cerrar sesión</span>
              
               </button>
                 }
              </li>
             
            </ul>
          </div>
        </div>
      </nav>
      


    );
}



