import { useState } from "react"
import PropTypes from "prop-types";
import style from './OptionsShow.module.css'

export default function OptionsSearch({results}) {
    const keys = Object.keys(results)
    const [showOptions, setShowOptions] = useState(keys[1]); // Estado para mostrar/ocultar opciones
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
                                <div key={photo.id} className={style.options}>  
                                    <div className={style.optionsText}>
                                        <span>{photo.title}</span> 
                                        <span>{photo.description}</span> 
                                    </div>
                                    <img className={style.image} src={'https://res.cloudinary.com/drtkhsozv/'+photo.image} />
                                </div>
                            ))} 
                        </>
                    )}
                    {showOptions === 'profiles' && (
                        <>
                            {results.profiles.map((profile) => (
                                <div key={profile.id} className={style.options}>  
                                    <div className={style.optionsText}>
                                        <span>{profile.user}</span> 
                                    </div>
                                    {profile.profile_photo ? (
                                        <img className={style.image} src={'https://res.cloudinary.com/drtkhsozv/'+profile.image} />
                                    ):(
                                        <img src="https://res.cloudinary.com/dowtoqcra/image/upload/v1729264496/wbtownzvwkokccchbbto.webp" alt="sinfotodeperfil" />
                                    )}
                                    
                                </div>
                            ))} 
                        </>
                    )}
                    {showOptions === 'categories' && (
                        <>
                            {results.categories.map((category) => (
                                <div key={category.id} className={style.options}>  
                                    <div className={style.optionsText}>
                                        <span>{category.name}</span>
                                    </div>
                                    <img alt={category.name} className={style.image} src={'https://res.cloudinary.com/drtkhsozv/'+category.image} />                                </div>
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