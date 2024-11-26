import { useState } from "react"
import PropTypes from "prop-types";
import style from './OptionsShow.module.css'
import { useNavigate } from "react-router-dom";
import CardPhoto from "../Cards/CardPhoto/CardPhoto";
import CardCollectionFolden from "../Cards/CardCollection/CardCollectionFolden";
import CardProfile from "../Cards/CardProfile/CardProfile";
import CardCollection from "../Cards/CardCollection/CardCollection";

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
                                <CardPhoto key={photo.id} data={photo} show={false}/>
                            ))} 
                        </>
                    )}
                    {showOptions === 'profiles' && (
                        <>
                            {results.profiles.map((profile) => (
                                <CardProfile key={profile.user?.id} profile={profile} />
                            ))} 
                        </>
                    )}
                    {showOptions === 'collections' && (
                        <>
                            {results.collections.map((collection) => (
                                <CardCollection key={collection.id} collection={collection} show={false}/>
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