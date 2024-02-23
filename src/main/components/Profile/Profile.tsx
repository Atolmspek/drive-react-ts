import { useEffect } from "react";
import profilePic from "../../../assets/img/avatar2.jpg";
import { fetchResults } from "../../utils/UserDataRest";
import UserModel from "../../../models/UserModel";
import React from "react";
import { getNombre } from "../Login/TokenHandler";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { SpinnerLoading } from "../../utils/SpinnerLoading";

interface Message {
  key: string;
  sender: string;
  body: string;
  receiver: string;
  date: Date;
}

export const Profile = () => {
  const [mainUser, setMainUser] = React.useState<UserModel>();
  const [otherUsers, setOtherUsers] = React.useState<UserModel[]>([]);
  const [fireBaseMessages, setFireBaseMessages] = React.useState<Message[]>([]);
  const [lastMsg, setLastMsg] = React.useState<Message[]>([]);
  const [isReady, setIsReady] = React.useState<boolean>(false);


  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "tarjetas", "mensajes"), (doc) => {
      if (doc.exists()) {
        const data = doc.data().lists;
        setFireBaseMessages(data);
        console.log(fireBaseMessages);
        console.log("Datos recibidos de Firebase:", data);
        setIsReady(true);
        
      } else {
        console.log("No hay datos en Firebase.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const toggleUser = (username: string) => {
    // Filtrar mensajes

    const msgFromThisUser = fireBaseMessages.filter(
      (element) =>
        element.sender === username ||
        (element.sender === getNombre && element.receiver === username)
    );
    msgFromThisUser.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
  
    
    // Devolver el primer mensaje del array, que será el más reciente
    const currentlastMsg = msgFromThisUser[0];
   // setLastMsg([...lastMsg, currentlastMsg]);
    console.log(currentlastMsg);
    console.log(currentlastMsg.body);
    return currentlastMsg.body
  };


  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchResults();

      const mainUser = result.find((user) => user.nombre === getNombre);
      const otherUsers = result.filter((user) => user.nombre !== getNombre);
      setOtherUsers(otherUsers);
      if (mainUser) {
        setMainUser(mainUser);
      }
    };
    
    fetchData();
  }, []);
  //si coincide con el logeado, a un array, los demás usuarios a otro?

 
  useEffect(() => {

    const orderedMsg= ()=> {
      otherUsers.map((user=> {
        const msgFromThisUser = fireBaseMessages.filter(
          (element) =>
            element.sender === user.nombre ||
            (element.sender === getNombre && element.receiver === user.nombre)
        );
      }))
    }
   
   /* orderedMsg.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });*/
  
    

  }, []);

  
    return (isReady) ? (
      <div className="container-fluid px-2 px-md-7 main-content w-auto">
        <div
          className="page-header min-height-300 border-radius-xl mt-4"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
          }}
        >
          <span className="mask  bg-gradient-primary  opacity-6" />
        </div>
        <div className="card card-body mx-3 mx-md-4 mt-n6">
          <div className="row gx-4 mb-2">
            <div className="col-auto">
              <div className="avatar avatar-xl position-relative">
                <img
                  src="../assets/img/bruce-mars.jpg"
                  alt="profile_image"
                  className="w-100 border-radius-lg shadow-sm"
                />
              </div>
            </div>
            <div className="col-auto my-auto">
              <div className="h-100">
                <h5 className="mb-1">{mainUser?.nombre}</h5>
                <p className="mb-0 font-weight-normal text-sm">
                  CEO / Co-Founder
                </p>
              </div>
            </div>
            <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
              <div className="nav-wrapper position-relative end-0">
                <ul className="nav nav-pills nav-fill p-1" role="tablist">
                  <li className="nav-item">
                    <a
                      className="nav-link mb-0 px-0 py-1 active "
                      data-bs-toggle="tab"
                      href=""
                      role="tab"
                      aria-selected="true"
                    >
                      <i className="material-icons text-lg position-relative">
                        home
                      </i>
                      <span className="ms-1">App</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link mb-0 px-0 py-1 "
                      data-bs-toggle="tab"
                      href=""
                      role="tab"
                      aria-selected="false"
                    >
                      <i className="material-icons text-lg position-relative">
                        email
                      </i>
                      <span className="ms-1">Mensajes</span>
                    </a>
                  </li>
                  <li className="nav-item">
                    <a
                      className="nav-link mb-0 px-0 py-1 "
                      data-bs-toggle="tab"
                      href=""
                      role="tab"
                      aria-selected="false"
                    >
                      <i className="material-icons text-lg position-relative">
                        settings
                      </i>
                      <span className="ms-1">Configuración</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="row">
              <div className="col-12 col-xl-4">
                <div className="card card-plain h-100">
                  <div className="card-header pb-0 p-3">
                    <h6 className="mb-0">Platform Settings</h6>
                  </div>
                  <div className="card-body p-3">
                    <h6 className="text-uppercase text-body text-xs font-weight-bolder">
                      Cuenta
                    </h6>
                    <ul className="list-group">
                      <li className="list-group-item border-0 px-0">
                        <div className="form-check form-switch ps-0">
                          <input
                            className="form-check-input ms-auto"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            defaultChecked
                          />
                          <label
                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                            htmlFor="flexSwitchCheckDefault"
                          >
                            Tema oscuro
                          </label>
                        </div>
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <div className="form-check form-switch ps-0">
                          <input
                            className="form-check-input ms-auto"
                            type="checkbox"
                            id="flexSwitchCheckDefault1"
                          />
                          <label
                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                            htmlFor="flexSwitchCheckDefault1"
                          >
                            Mostrar imagen de perfil de otros usuarios
                          </label>
                        </div>
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <div className="form-check form-switch ps-0">
                          <input
                            className="form-check-input ms-auto"
                            type="checkbox"
                            id="flexSwitchCheckDefault2"
                            defaultChecked
                          />
                          <label
                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                            htmlFor="flexSwitchCheckDefault2"
                          >
                            Email me when someone mentions me
                          </label>
                        </div>
                      </li>
                    </ul>
                    <h6 className="text-uppercase text-body text-xs font-weight-bolder mt-4">
                      Aplicación
                    </h6>
                    <ul className="list-group">
                      <li className="list-group-item border-0 px-0">
                        <div className="form-check form-switch ps-0">
                          <input
                            className="form-check-input ms-auto"
                            type="checkbox"
                            id="flexSwitchCheckDefault3"
                          />
                          <label
                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                            htmlFor="flexSwitchCheckDefault3"
                          >
                            Nuevos lanzamientos y proyectos
                          </label>
                        </div>
                      </li>
                      <li className="list-group-item border-0 px-0">
                        <div className="form-check form-switch ps-0">
                          <input
                            className="form-check-input ms-auto"
                            type="checkbox"
                            id="flexSwitchCheckDefault4"
                            defaultChecked
                          />
                          <label
                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                            htmlFor="flexSwitchCheckDefault4"
                          >
                            Actualizaciones mensuales del producto
                          </label>
                        </div>
                      </li>
                      <li className="list-group-item border-0 px-0 pb-0">
                        <div className="form-check form-switch ps-0">
                          <input
                            className="form-check-input ms-auto"
                            type="checkbox"
                            id="flexSwitchCheckDefault5"
                          />
                          <label
                            className="form-check-label text-body ms-3 text-truncate w-80 mb-0"
                            htmlFor="flexSwitchCheckDefault5"
                          >
                            Suscripción a la Newsletter
                          </label>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-xl-4">
                <div className="card card-plain h-100">
                  <div className="card-header pb-0 p-3">
                    <div className="row">
                      <div className="col-md-8 d-flex align-items-center">
                        <h6 className="mb-0">Información de perfil</h6>
                      </div>
                      <div className="col-md-4 text-end">
                        <a href="">
                          <i
                            className="fas fa-user-edit text-secondary text-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Edit Profile"
                          />
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-3">
                    <p className="text-sm">{mainUser?.bio}</p>
                    <hr className="horizontal gray-light my-4" />
                    <ul className="list-group">
                      <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                        <strong className="text-dark">Nombre completo:</strong>{" "}
                        &nbsp;
                        {mainUser?.nombre}
                      </li>
                      <li className="list-group-item border-0 ps-0 text-sm">
                        <strong className="text-dark">Móvil:</strong> &nbsp;
                        {mainUser?.movil}
                      </li>
                      <li className="list-group-item border-0 ps-0 text-sm">
                        <strong className="text-dark">Email:</strong> &nbsp;
                        {mainUser?.email}
                      </li>
                      <li className="list-group-item border-0 ps-0 text-sm">
                        <strong className="text-dark">País:</strong> &nbsp;
                        España
                      </li>
                      <li className="list-group-item border-0 ps-0 pb-0">
                        <strong className="text-dark text-sm">Redes:</strong>{" "}
                        &nbsp;
                        <a
                          className="btn btn-facebook btn-simple mb-0 ps-1 pe-2 py-0"
                          href={`https://www.twitter.com/${mainUser?.twitter}`}
                        >
                          <i className="fab fa-facebook fa-lg" />
                        </a>
                        <a
                          className="btn btn-twitter btn-simple mb-0 ps-1 pe-2 py-0"
                          href={`https://www.facebook.com/${mainUser?.facebook}`}
                        >
                          <i className="fab fa-twitter fa-lg" />
                        </a>
                        <a
                          className="btn btn-instagram btn-simple mb-0 ps-1 pe-2 py-0"
                          href={`https://www.instagram.com/${mainUser?.instagram}`}
                        >
                          <i className="fab fa-instagram fa-lg" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <div className="card card-plain h-100">
                  <div className="card-header pb-0 p-3">
                    <h6 className="mb-0">Conversations</h6>
                  </div>
                  <div className="card-body p-3">
                    <ul className="list-group">
                      {otherUsers.map((user) => (
                        <li
                          className="list-group-item border-0 d-flex align-items-center px-0 mb-2 pt-0"
                          key={user.nombre}
                        >
                          <div className="avatar me-3">
                            <img
                              src="../assets/img/kal-visuals-square.jpg"
                              alt="kal"
                              className="border-radius-lg shadow"
                            />
                          </div>
                          <div className="d-flex align-items-start flex-column justify-content-center">
                            <h6 className="mb-0 text-sm">{user.nombre}</h6>
                            <p className="mb-0 text-xs">
                           {toggleUser(user.nombre)}
                            </p>
                          </div>
                          <a
                            className="btn btn-link pe-3 ps-0 mb-0 ms-auto w-25 w-md-auto"
                            href=""
                          >
                            Responder
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ) : <SpinnerLoading/>;
  }

;
