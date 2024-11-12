import { useState } from "react"
import PropTypes from "prop-types";
import style from './OptionsShow.module.css'
import { useNavigate } from "react-router-dom";
import CardPhoto from "../Cards/CardPhoto/CardPhoto";
import CardCollectionFolden from "../Cards/CardCollection/CardCollectionFolden";

export default function OptionsSearch({results}) {
    const keys = Object.keys(results)
    const [showOptions, setShowOptions] = useState(keys[1]); // Estado para mostrar/ocultar opciones
    const navigate = useNavigate()
    const showProfile = (idProfile) => {
        navigate('/perfil/'+idProfile)
        location.reload()
    }
    console.log(results)
    return (
        <div className="flex flex-col gap-10 mt-10 w-full">
            <div className={style.optionsButtons}>
                {keys.map((key) => (
                    results[key].length > 0 && (
                        <button
                        className={`${style.buttons} ${showOptions === key ? style.activeButton : ''}`}
                            key={key}
                            onClick={()=>setShowOptions(key)}
                        >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        </button>
                    )
                ))}
            </div>
            {Object.values(results).some(array => array.length > 0) ? (
                <div className={style.conteinerOptions}>
                    {showOptions === 'photos' && (
                        <>
                            {results.photos.map((photo) => (
                                <CardPhoto id={photo.id} url={photo.image_url} key={photo.id} title={photo.title} width={200} height={250}/>
                            ))} 
                        </>
                    )}
                    {showOptions === 'profiles' && (
                        <>
                            {results.profiles.map((profile) => (
                                <div key={profile.id} className={style.options} onClick={()=>showProfile(profile.id)}>  
                                    <div className={style.optionsText}>
                                        <span>{profile.user}</span> 
                                    </div>
                                    {profile.profile_photo ? (
                                        <img className={style.image} src={'https://res.cloudinary.com/dowtoqcra/'+profile.image} />
                                    ):(
                                        <img src="https://res.cloudinary.com/dowtoqcra/image/upload/v1729264496/wbtownzvwkokccchbbto.webp" alt="sinfotodeperfil" />
                                    )}
                                    
                                </div>
                            ))} 
                        </>
                    )}
                    {showOptions === 'collections' && (
                        <>
                            {results.collections.map((collection) => (
                                <CardCollectionFolden key={collection.id} photos={collection.photos} width={200} height={200} id={collection.id}  />
                            ))} 
                        </>
                    )}
                </div>
            ):(
                <h1 className="text-center">No hay resultados</h1>
            )}
        </div>
    )
}

OptionsSearch.propTypes = {
    results: PropTypes.object.isRequired,
};