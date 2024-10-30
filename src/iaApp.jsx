import { useEffect, useRef, useState } from "react";
import { construirRaw,construirRequestOptions,peticionClarifai } from "./static/js/funcionIa";

function IaApp() {
    const [estadoPrincipal,setEstadoPrincipal]=useState("")
    const [imageBytesString,setImageBytesString]=useState("")
    const [imageURL,setImageURL]=useState("")
    const [imageData,setImageData]=useState({
        "url":"",
        "base64":""
    })
    const imagen=useRef()
    function handleChangeEstadoPrincipal(e){
        if (e.target.value == "subir"){
            setEstadoPrincipal("subir")
        }
        if(e.target.value == "link"){
            setEstadoPrincipal("link")
        }
    }
    const handleAddFile=(e)=>{
        console.log(e.target.files[0])
        const reader= new FileReader();
        reader.onload = (event)=>{
            imagen.current.style.display="flex"
            imagen.current.src=event.target.result
            setImageBytesString(reader.result.split(","[1]))
        }

        reader.readAsDataURL(e.target.files[0])
    }
    
    const handleReconocer= (e)=>{
        let raw=""
        if (estadoPrincipal == "subir" ){
            raw=construirRaw(imageData.base64)
        }
        if (estadoPrincipal == "link"){
            raw=construirRaw(imageData.url)
        }
        
        const requestOptions=construirRequestOptions(raw)
        const peticion=peticionClarifai(requestOptions)
        console.log(peticion)
    }



    useEffect(()=>{
        setImageData({
            "base64":imageBytesString,
            "url":""
        })
        console.log(imageBytesString)
    },[imageBytesString])
    useEffect(()=>{
        setImageData({
            "base64":"",
            "url":imageURL
        })
    },[imageURL])

    return (
    <>
    <div className="container">
        <h1 className="text-center py-4">Reconocimiento de Animales IA</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati nostrum sequi beatae? Maiores fugiat, tenetur commodi ea similique expedita, veniam, maxime ipsum ab obcaecati pariatur tempora fugit aperiam dolor inventore.</p>
        <div className="w-100 text-center d-flex justify-content-center align-items-center gap-2" style={{height:"20vh"}}>
            <button className="btn btn-outline-primary w-50 py-3" value="subir" onClick={handleChangeEstadoPrincipal}>Subir una imagen</button>
            <button className="btn btn-outline-secondary w-50 py-3" value="link" onClick={handleChangeEstadoPrincipal}>Insertar el link a una imagen</button>
        </div>
    </div>
    {estadoPrincipal == "subir" && 
    <div className="container my-3">
        <div className="w-100 d-flex justify-content-center align-items-center my-3">
            <img ref={imagen} src="" alt="" className="mt-3"  style={{width:"200px",height:"300px", display:"none"}}/>
        </div>
        <input className="form-control" type="file" onChange={handleAddFile}/>
        {imagen?.current?.style?.display == "flex" &&<div className="w-100 d-flex justify-content-center align-items-center py-3"> <button  onClick={handleReconocer} className="btn btn-primary px-3 w-50">Reconocer</button></div>}
    </div>}
    {estadoPrincipal == "link" &&
    <div className="container">
        <h3>Menu para insertar el link a una imagen</h3>
    </div> }
    </>  );
}

export default IaApp;