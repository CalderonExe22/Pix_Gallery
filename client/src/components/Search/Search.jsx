import { useEffect, useState } from 'react'
import axiosApi from '../../services/axiosApi'

export default function Search() {

    const [query, setQuery] = useState('')
    const [results, setResults] = useState({ profiles: [], photos: []})
    const [loading, setLoading] = useState(false);

    const fetchSearch = async (searchQuery) => {
        if(searchQuery.length > 0){
            setLoading(true)
            try {
                const response = await axiosApi.get(`search/global-search/?q=${searchQuery}`)
                setResults(response.data);
            } catch (error) {
                console.log('Error fetching results:', error) 
            }
            setLoading(false);
        }else {
            setResults({ profiles: [], photos: [] })
        }
    }

    useEffect(() => {
        fetchSearch(query);
    }, [query]);

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search..."
            />

            {loading ? <p>Loading...</p> : null}

            <div>
                <h3 className='font-bold'>Profiles</h3>
                {results.profiles.map(profile => (
                    <div key={profile.id}>
                        <h4>{profile.user}</h4>
                        <p>{profile.bio}</p>
                    </div>
                ))}

                <h3 className='font-bold'>Photos</h3>
                {results.photos.map(photo => (
                    <div key={photo.id}>
                        <h4>{photo.title}</h4>
                        <p>{photo.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
