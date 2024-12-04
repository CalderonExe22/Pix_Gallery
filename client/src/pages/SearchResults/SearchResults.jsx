import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import axiosApi from "../../services/axiosApi"
import SearchContainer from "../../components/SearchContainer/SearchContainer"
import { Spinner } from "flowbite-react"
export default function SearchResults() {
    const location = useLocation()
    const query = new URLSearchParams(location.search).get('q')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true)
            if(query){
                try {
                    const response = await axiosApi.get(`search/global-search/?q=${query}`)
                    if(response.status === 200){
                        setResults(response.data)
                    }
                } catch (error) {
                    console.log(error)
                }finally{
                    setLoading(false)
                }
            }
        }
        fetchResults()
    },[query])
    console.log(results)
    return (
        <section className="w-full h-full p-24">
            {loading ? (
                <div className="flex justify-center w-full">
                    <Spinner color="purple" aria-label="Extra large spinner example" size="xl" />
                </div>
            ) : (
                <SearchContainer results={results} />
            )}
        </section>
    )
}
