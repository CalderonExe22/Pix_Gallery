import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axiosApi from "../../services/axiosApi"
import SearchContainer from "../../components/SearchContainer/SearchContainer"
export default function SearchResults() {
    const location = useLocation()
    const query = new URLSearchParams(location.search).get('q')
    const [results, setResults] = useState([])
    useEffect(() => {
        const fetchResults = async () => {
            if(query){
                try {
                    const response = await axiosApi.get(`search/global-search/?q=${query}`)
                    if(response.status === 200){
                        setResults(response.data)
                    }
                } catch (error) {
                    console.log(error)
                }
            }
        }
        fetchResults()
    },[query])
    console.log(results)
    return (
        <section className="w-full h-full p-24">
            <SearchContainer results={results} />
        </section>
    )
}
