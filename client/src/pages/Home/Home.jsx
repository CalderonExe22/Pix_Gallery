
import style from './Home.module.css'
import ListsPhotos from '../../components/ListsPhotos/ListsPhotos';
import Tabs from '../../components/Tabs/Tabs';
import Tab from '../../components/Tabs/Tab';
import { useEffect, useState } from 'react';
import axiosApi from '../../services/axiosApi';
import Filter from '../../components/Filter/Filter'
import { Spinner } from 'flowbite-react';

export default function Home() {
    const [photos, setPhotos] = useState([])
    const [collections, setCollections] = useState([])
    const [categoryId, setCategoryId] = useState('')
    const [tagId, setTagId] = useState('')
    const [isFree, setIsFree] = useState('')
    const [loadingPhotos, setLoadingPhotos] = useState(false)
    const [loadingCollections, setLoadingCollections] = useState(false)

    const fetchPhotos = async (categoryId = '', tagId = '', isFree = '') => {
        setLoadingPhotos(true)
        try {
            const response = await axiosApi.get('photos/photography/get_all_photographies/', {
                params: { category: categoryId, tag: tagId, is_free: isFree }
            })
            if (response.status === 200) {
                setPhotos(response.data)
            }
        } catch (error) {
            console.log(error)
        }finally{
            setLoadingPhotos(false)
        }
    }
    
    const fetchCollections = async (categoryId = '', tagId = '', isFree = '') => {
        setLoadingCollections(true)
        try {
            const response = await axiosApi.get('photos/collections/all_collections/', {
                params: { category: categoryId, tag: tagId, is_free: isFree }
            })
            setCollections(response.data)
        } catch (error) {
            console.log(error)
        }finally{
            setLoadingCollections(false)
        }
    }

    useEffect(()=>{
        document.title = 'Inicio'
        fetchPhotos(categoryId, tagId, isFree)
        fetchCollections(categoryId, tagId, isFree)
    },[categoryId, tagId, isFree])

    const handleFilterChange = (category, tag, isFreeValue) => {
        setCategoryId(category); 
        setTagId(tag); 
        setIsFree(isFreeValue)
    };

    return (
        <div className={style.home_container}>
            <Tabs styleButtonTab={'w-[170px] font-semibold text-xl'} extraChildren={<Filter onFilterChange={handleFilterChange} />}>
                <Tab title={'Fotografias'}>
                    {loadingPhotos ? (
                        <div className="flex justify-center w-full">
                            <Spinner color="purple" aria-label="Extra large spinner example" size="xl" />
                        </div>
                    ) : (
                        <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'photos'} data={photos} />
                    )}
                </Tab>
                <Tab title={'Colecciones'}>
                    {loadingCollections ? (
                        <div className="flex justify-center w-full">
                            <Spinner color="purple" aria-label="Extra large spinner example" size="xl" />
                        </div>
                    ) : (
                        <ListsPhotos gridRowEndOption={true} layoutStyle={'grid'} type={'collections'} data={collections} />
                    )}
                </Tab>
            </Tabs>
        </div>
    )
}
