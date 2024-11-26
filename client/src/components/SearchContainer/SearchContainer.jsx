import PropTypes from "prop-types"
import CardPhoto from "../Cards/CardPhoto/CardPhoto";
"use client";
import { Dropdown } from "flowbite-react";
import CardCollection from "../Cards/CardCollection/CardCollection";
import { useState } from "react";

export default function SearchContainer({results}) {
    const [filter, setFilter] = useState('all')
    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter)
    }
    const filteredResults = () => {
        switch (filter) {
            case 'photos':
                return results?.photos?.map((photo) => (
                    <CardPhoto key={photo.id} data={photo} show="false" gridRowEndOption="true" idUser={photo.user?.id} />   
                ))
            case 'collections':
                return results?.collections?.map((collection) => (
                    <CardCollection key={collection.id} collection={collection} show="false" gridRowEndOption="true" idUser={collection.user?.id} />   
                ))
            default:
                return <>
                    {results?.photos?.map((photo) => (
                        <CardPhoto key={photo.id} data={photo} show="false" gridRowEndOption="true" idUser={photo.user?.id} />
                    ))}
                    
                    {results?.collections?.map((collection) => (
                        <CardCollection key={collection.id} collection={collection} show="false" gridRowEndOption="true" idUser={collection.user?.id} />
                    ))}
                </>
        }
    }
    return (
        <div className="flex flex-col gap-10 h-full w-full">
            <div className="flex justify-between w-full">
                <span>Resultados: {results?.photos?.length + results?.collections?.length + results?.profiles?.length}</span>
                <Dropdown label="Filtrar resultados">
                    <Dropdown.Item onClick={() => handleFilterChange("all")} >Todos</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange("photos")} >Fotografias</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange("collections")}>Colecciones</Dropdown.Item>
                </Dropdown>
            </div>
            <div className="grid grid-cols-5 gap-10 w-full h-auto z-0">
                {filteredResults()}
            </div>
        </div>
    )
}

SearchContainer.propTypes = {
    results: PropTypes.oneOfType([
        PropTypes.object, 
        PropTypes.array, 
    ]),
};