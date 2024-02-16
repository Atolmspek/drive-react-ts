import React, { useEffect, useState, useCallback } from "react";
import FicheroModel from "../../../models/FicheroModel";
import { formatFecha, formatSize, getImg } from "./utils/Utils";
import { FileRejection, useDropzone } from "react-dropzone";
import { ContextMenu } from "./ContextMenu";

export const FilesTable = () => {
  const [ficheros, setFicheros] = useState<FicheroModel[]>([]);
  const [httpError, setHttpError] = useState(null);
  const [newUpload, setNewUpload] = useState(false);
  const [isVisible, setIsVisible]=useState(false);
  const items = ['Eliminar', 'Renombrar', 'Por fecha', 'Por nombre']
  const [selectedRightClickFile, setSelectedRightClickFile]=useState("");
  const [coordinates, setCoordinates]=useState({x:0, y:0});
  const [filesUpdated, setFilesUpdated] = useState(false);


  const handleFilesUpdated = () => {
    setFilesUpdated(true);
  };

  const handleRightClick = (e: any, id: any) => {
      e.preventDefault();
      setSelectedRightClickFile(id);
      setIsVisible(true);
      const coords = {x:e.clientX, y:e.clientY}
      setCoordinates(coords);
  }

  const onHide = () => {
    setIsVisible(false);
  }

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
      rejectedFiles: FileRejection[],
      event: any
    ) => {
      event.preventDefault();
      event.stopPropagation();
      const file = new FileReader();
      file.readAsDataURL(acceptedFiles[0]);
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      try {
        const response = await fetch("http://localhost:8080/drive/new/upload", {
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          console.log(response);
          console.log("File uploaded successfully");
          setNewUpload(true);
          initialFilesFetch();
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file", error);
      }
      setNewUpload(true);
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    noClick: true,
  });

  //Fetch data for the file table
  const initialFilesFetch = useCallback(async () => {
    const baseUrl: string = "http://localhost:8080/api/ficheroes";
    const url: string = `${baseUrl}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Algo ha ido mal");
      }

      const responseJson = await response.json();
      const responseData = responseJson._embedded.ficheroes;

      const loadedFiles: FicheroModel[] = [];

      for (const key in responseData) {
        loadedFiles.push({
          id: responseData[key].id,
          descripcion: responseData[key].descripcion,
          ruta: responseData[key].ruta,
          tipo: getImg(responseData[key].tipo),
          size: formatSize(responseData[key].size),
          fCreacion: formatFecha(responseData[key].fcreacion),
        });
      }
      setFilesUpdated(false);
      setFicheros(loadedFiles);
    } catch (error) {}
  }, [filesUpdated==true]);
  //Controlamos desde este componente si se han actualizado
  //los ficheros en el componente hijo al hacer borrados/renombrados
  //en caso positivo se establece desde allí como true el booleano pasado como props
  //se actualiza el estado y desde la api se coge la nueva lista, renderizando de nuevo


  //Initial load of data with fetchFicheros
  useEffect(() => {
    initialFilesFetch();
  }, [initialFilesFetch]);

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  const ficherosDestacados = ficheros.slice(-3);
  const baseUrl = "http://localhost:8080/drive";

  return (
    <div className="container-md text-center bg-white mt-6 rounded">
      <div className="container-sm">
        <div className="mt-2 card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
            <h6 className="text-white text-capitalize ps-3">Tus ficheros</h6>
          </div>
        </div>

        <div className="row">
          {ficherosDestacados.map((file, index) => (
            <div key={index} className="col-md-4 mb-4 ">
              <div className="card mw-20 mt-3 h-100  ">
                <div className="row g-0">
                  <div className="col-md-4">
                    <a
                      className="card-title"
                      href={`${baseUrl}/get/${file.id}`}
                      download={file.ruta}
                    >
                      <img
                        src={file.tipo}
                        height={96}
                        width={96}
                        className="img-fluid rounded-start mt-4"
                        alt="..."
                      />
                    </a>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <a
                        className="card-title"
                        href={`${baseUrl}/get/${file.id}`}
                        download={file.ruta}
                      >
                        <h5 className="card-title">{file.ruta}</h5>
                      </a>
                      <p className="card-text">{file.fCreacion}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        {...getRootProps()}
        className="table-responsive bg-white"
        style={{ overflowY: "auto", maxHeight: "550px" }}
      >
        <input {...getInputProps()} />
        <table className="table table-striped rounded align-items-center">
          <thead>
            <tr>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Descripción
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Tamaño
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Fecha de modificación
              </th>
            </tr>
          </thead>
          <tbody>
            {ficheros.map((file) => (
              <tr key={file.id}>
                <td>
                <a href={`${baseUrl}/get/${file.id}`} defaultValue={file.id} onContextMenu={(e)=>handleRightClick(e, file.id)} download={file.ruta}>
            {file.ruta}
        </a>
                </td>
                <td>{file.descripcion}</td>
                <td>
                  <img src={file.tipo} height="28px" width="28px" alt="icono" />
                </td>
                <td>{file.size}</td>
                <td>{file.fCreacion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isVisible && <ContextMenu onHide={onHide} handleFilesUpdated={handleFilesUpdated} items={items} coordinates={coordinates} id={selectedRightClickFile}/>}
    </div>
  );
};
