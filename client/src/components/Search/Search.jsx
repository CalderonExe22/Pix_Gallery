import { useEffect, useRef, useState } from 'react'
import axiosApi from '../../services/axiosApi'
import style from './Search.module.css'
import OptionsShow from '../OptionsShow/OptionsShow'

export default function Search() {

    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    //const [loading, setLoading] = useState(false);
    const [isSearching, setIsSearching] = useState(false)
    const [showInputSearch,setShowInputSearch] = useState(false)
    
    const searchRef = useRef(null)
    const handleSearchClick  = () => {
        setShowInputSearch(!showInputSearch)
    }

    const handleClickOutside = (e) => {
        if(searchRef.current && !searchRef.current.contains(e.target)){
            setShowInputSearch(false)
        }
    }

    const fetchSearch = async (searchQuery) => {
        if(searchQuery.length > 0){
            //setLoading(true)
            setIsSearching(true)
            try {
                const response = await axiosApi.get(`search/global-search/?q=${searchQuery}`)
                setResults(response.data);
            } catch (error) { 
                console.log('Error fetching results:', error) 
            }
            //setLoading(false);
        }else {
            setIsSearching(false)
            setResults({ profiles: [], photos: [] })
        }
    }
    useEffect(() => {
        
        fetchSearch(query);

        if (showInputSearch) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [query,showInputSearch]);

    return (
        <>
            <div className={`${style.overlay} ${showInputSearch ? style.show : ''}`}></div>
            <div ref={searchRef}>
                <button className={style.links} onClick={handleSearchClick}>
                    <i className="fa-solid fa-search"></i> <span> Buscar </span>
                </button>
                <div className={`${style.search} ${showInputSearch ? style.show : ''}`}>
                    <form className={style.container_search}>
                        <input 
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar..."
                            className={style.inputSearch}
                        />
                    </form>
                    {isSearching && (
                        <div className={`${style.results} ${isSearching && showInputSearch ? style.showResults : ''}`}>
                            <OptionsShow  results={results}/>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}
