import { useEffect, useRef, useState } from "react";
import { construirRaw,construirRequestOptions,peticionClarifai } from "./static/js/funcionIa";

function IaApp() {
    const [resultadoReconocimiento,setResultadoReconocimiento]=useState("")
    const [validateURL,setValidateURL]=useState(false)
    const [estadoPrincipal,setEstadoPrincipal]=useState("")
    const [imageBytesString,setImageBytesString]=useState("")
    const [imageURL,setImageURL]=useState("")
    const [imageData,setImageData]=useState({
        "url":"",
        "base64":""
    })
    const imagen=useRef()
    const url=useRef()
    const imagenPorURL=useRef()
    function handleChangeEstadoPrincipal(e){
        if (e.target.value == "subir"){
            setEstadoPrincipal("subir")
            setResultadoReconocimiento("")
        }
        if(e.target.value == "link"){
            setEstadoPrincipal("link")
            setResultadoReconocimiento("")
        }
    }
    const handleAddFile=(e)=>{
        setResultadoReconocimiento("")
        const reader= new FileReader();
        reader.onload = (event)=>{
            imagen.current.style.display="flex"
            imagen.current.src=event.target.result
            setImageBytesString(reader.result.split(",")[1])
        }

        reader.readAsDataURL(e.target.files[0])
    }
    const handleValidarUrl=()=>{
        const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9.-]+)(:[0-9]{1,5})?(\/[^\s]*)?$/;
        console.log(imageURL)
        const isValid=regex.test(imageURL)
        if (isValid){
            imagenPorURL.current.style.display="flex"
            imagenPorURL.current.src=imageURL
        }
        setValidateURL(isValid)
    }
    const handleReconocer=async(e)=>{
        const raw=construirRaw(imageData)
        const requestOptions=construirRequestOptions(raw)
        const peticion=await peticionClarifai(requestOptions)
        await setResultadoReconocimiento(peticion)
    }

    const handleChangeInput=(e)=>{
        setImageURL(e.target.value)
    }

    useEffect(()=>{
        setImageData({
            "base64":imageBytesString
        })
    },[imageBytesString])
    useEffect(()=>{
        setImageData({
            "url":imageURL
        })
    },[imageURL])

    return (
    <>
    <div className="container">
        <h1 className="text-center py-4">Reconocimiento de Animales IA</h1>
        <p className="text-center">Reconoce y clasifica imágenes de animales de manera rápida y precisa. Simplemente sube una imagen o ingresa un enlace y descubre qué animal se encuentra en ella</p>
        <div className="w-100 text-center d-flex justify-content-center align-items-center gap-2" style={{height:"20vh"}}>
            <button className="btn btn-outline-primary w-50 py-3" value="subir" onClick={handleChangeEstadoPrincipal}>Subir una imagen</button>
            <button className="btn btn-outline-secondary w-50 py-3" value="link" onClick={handleChangeEstadoPrincipal}>Insertar el link a una imagen</button>
        </div>
    </div>
    {estadoPrincipal == "subir" && 
    <div className="container my-3">
        <div className="w-100 d-flex justify-content-center align-items-center my-3">
            <img ref={imagen} src="" alt="" className="mt-3"  style={{width:"400px",height:"400px", display:"none",objectFit:"contain"}}/>
        </div>
        <input className="form-control" type="file" onChange={handleAddFile}/>
        {imagen?.current?.style?.display == "flex" &&<div className="w-100 d-flex justify-content-center align-items-center py-3"> <button  onClick={handleReconocer} className="btn btn-primary px-3 w-50">Reconocer</button></div>}
        {resultadoReconocimiento &&
        <div>
            <h3>El resultado del reconocimiento es: </h3>
            {resultadoReconocimiento.map((el,id)=><p  className="text-center display-3 text-capitalize" key={id}>{el}</p>)}
        </div>}
    </div>}
    {estadoPrincipal == "link" &&
    <div className="container">
        <input type="url" onChange={handleChangeInput} className="form-control " id="floatingInputInvalid" placeholder="Inserte un url de imagen" ref={url}/>
        <div className="w-100 d-flex flex-column justify-content-center align-items-center py-3">
            <div>
                <img  ref={imagenPorURL} src="" alt="" style={{width:"400px",height:"400px",display:"none",objectFit:"contain"}}/>
            </div>
            <div className="d-flex py-3 w-100 justify-content-evenly align-items-center">
                <button onClick={handleValidarUrl} className="btn btn-secondary mx-4">Validar Url</button>
                {validateURL && <button onClick={handleReconocer} className="btn btn-primary px-3 w-50" value="url">Reconocer</button>}
            </div>
        </div>
            {resultadoReconocimiento &&
        <div>
            <h3>El resultado del reconocimiento es: </h3>
            {resultadoReconocimiento.map((el,id)=><p  className="text-center display-3 text-capitalize" key={id}>{el}</p>)}
        </div>}
    </div> }
    </>  );
}

export default IaApp;