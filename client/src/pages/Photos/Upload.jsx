import { useState } from "react"
import UploadPhoto from "../../components/UploadPhoto/UploadPhoto"
import UploadCollection from "../../components/UploadCollection/UploadCollection"

export default function Upload() {
    const [show, setShow ] = useState(true)


    const collectionOrPhotography = () =>{
        setShow(!show)
    }

    return (
        <div className={`flex flex-col h-[500px] w-full`}>
            <div className={`flex justify-center items-center ${show ? 'h-full' : 'h-0 overflow-hidden' } w-full transform transition-all duration-500`}>
                <UploadPhoto showForm={collectionOrPhotography} />
            </div>
            <div className={`flex justify-center items-center ${show ? 'h-0 overflow-hidden' : 'h-full' } w-full transform transition-all duration-500`}>
                <UploadCollection  showForm={collectionOrPhotography} />
            </div>
        </div>
    )
}