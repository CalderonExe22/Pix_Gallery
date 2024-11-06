import { useState } from "react"
import PropTypes from "prop-types";
import style from './OptionsSearch.module.css'

export default function OptionsSearch({results}) {
    
    const keys = Object.keys(results)
    const [showOptions, setShowOptions] = useState(keys[1]); // Estado para mostrar/ocultar opciones
    return (
        <div className="flex flex-col gap-10 mt-10">
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
            {results < 0 ? (console.log('si')):(console.log('no'))}
            <div className={style.conteinerOptions}>
                {results[showOptions] && results[showOptions].map((item) => (
                    <div key={item.id} className={style.options}>
                        <div className={style.optionsText}>
                            {Object.keys(item).filter(field => field !== 'id' && field !== 'image').map(field => (  
                                <p key={field}>{item[field]}</p>  
                            ))}
                        </div>
                        {item.image && (
                            <img className={style.image} src={'https://res.cloudinary.com/drtkhsozv/'+item.image} alt={item.title || 'Image'} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

OptionsSearch.propTypes = {
    results: PropTypes.object.isRequired,
};