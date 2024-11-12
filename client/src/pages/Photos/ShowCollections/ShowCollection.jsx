"use client";
import { useParams } from "react-router-dom"
import axiosApi from "../../../services/axiosApi"
import PropTypes from 'prop-types' 
import { useEffect, useState } from "react"
import { Carousel } from "flowbite-react";

export default function ShowCollection() {
    const {id} = useParams()
    const [collection, setCollection] = useState([])
    const [activeIndex, setActiveIndex] = useState(0)
    const fechCollection = async (idCollection) => {
        try {
            const response = await axiosApi.get('photos/collections/'+idCollection)
            if(response.data){
                setCollection(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }
    const dataPhoto = (index) => {
        setActiveIndex(index)
    }
    useEffect(()=>{
        fechCollection(id)
    },[id])
    console.log(collection)
    return (
        <div className="grid grid-cols-3 w-full h-full">
            {collection ? (
                <>
                <div className="col-span-2 h-screen w-full">
                    <Carousel onSlideChange={dataPhoto} slide={false}>
                        {collection?.photos?.map((photo) => (
                            <img className="w-full h-full object-cover" key={photo.id} src={photo.image_url} alt={photo.title} />
                        ))}
                    </Carousel>
                </div>
                <div className="col-span-1 flex flex-col gap-10 ms-7 me-7">
                    <div className="flex justify-start w-full">

                    </div>
                    <div className="flex flex-col gap-5">
                        <h1 className="text-4xl">{collection.name}</h1>
                        <h1>{collection.description}</h1>
                    </div>
                    <div className="flex flex-col gap-5">
                        {collection?.photos ? (
                            <>
                            <h1 className="text-4xl">{collection.photos[activeIndex].title}</h1>
                            <h1>{collection.photos[activeIndex].description}</h1></>
                        ) : (
                            <div>..cargando</div>
                        )}
                        
                    </div>
                </div>
                </>
            ) : (
                <div>Cargando datos del usuario...</div>
            )}
            
        </div>
    )
}

ShowCollection.propTypes = {
    id : PropTypes.number
}