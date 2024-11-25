
import style from './Home.module.css'
import ListsPhotos from '../../components/ListsPhotos/ListsPhotos';
import Tabs from '../../components/Tabs/Tabs';
import Tab from '../../components/Tabs/Tab';
import { useEffect, useState } from 'react';
import axiosApi from '../../services/axiosApi';

export default function Home() {
    const [photos, setPhotos] = useState([])
    const [collections, setCollections] = useState([])
    const fetchPhotos = async () => {
        const response = await axiosApi.get('photos/photography/get_all_photographies/')
        const dataWithSizes = response.data.map(photo => ({
            ...photo,
            rowSpan: Math.floor(Math.random() * 5) + 10, // Tamaño aleatorio entre 10 y 15
        }));
        setPhotos(dataWithSizes)
    }
    const fetchCollections = async () => {
        const response = await axiosApi.get('photos/collections/all_collections/')
        const dataWithSizes = response.data.map(collection => ({
            ...collection,
            rowSpan: Math.floor(Math.random() * 5) + 10, // Tamaño aleatorio entre 10 y 15
        }));
        setCollections(dataWithSizes)
    }
    useEffect(()=>{
        fetchPhotos()
        fetchCollections()
    },[])
    console.log(photos)
    return (
        <div className={style.home_container}>
            <Tabs>
                <Tab title={'Fotografias'}>
                    <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'photos'} data={photos} />
                </Tab>
                <Tab title={'Colecciones'}>
                    <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'collections'} data={collections} />
                </Tab>
            </Tabs>
            
        </div>
    )
}
