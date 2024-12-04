import { useEffect, useState } from "react"
import axiosApi from "../../services/axiosApi";
import ListPhoto from "../ListsPhotos/ListsPhotos";
import PropTypes from "prop-types";
import { Spinner } from "flowbite-react";

export default function ExploreCategoryPage({ endpoint, title, layoutStyle, type }) {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        const fetchExplorerData = async () => {
            setLoading(true)
            try {
                const response = await axiosApi.get(endpoint)
                if (response.status === 200) {
                    setData(response.data);
                }
            } catch (error) {
                console.log(error)
            }finally{
                setLoading(false)
            }
        }
        fetchExplorerData()
    },[endpoint])
    console.log(data)
    return (
        <div className="flex flex-col w-full h-full p-10">
            <h1 className="text-2xl font-bold mb-6">{title}</h1>
            {loading ? (
                <div className="flex justify-center w-full">
                    <Spinner color="purple" aria-label="Extra large spinner example" size="xl" />
                </div>
            ) : (
                <ListPhoto gridRowEndOption={true} data={data} layoutStyle={layoutStyle} type={type} />
            )}
        </div>
    )
}

ExploreCategoryPage.propTypes = {
    endpoint: PropTypes.string.isRequired,
    title: PropTypes.string,
    layoutStyle: PropTypes.string,
    type: PropTypes.string
};
