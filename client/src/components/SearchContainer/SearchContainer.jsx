import PropTypes from "prop-types"
import CardPhoto from "../Cards/CardPhoto/CardPhoto";
"use client";
import { Dropdown } from "flowbite-react";
import CardCollection from "../Cards/CardCollection/CardCollection";
import { useState } from "react";
import CardProfile from "../Cards/CardProfile/CardProfile";

export default function SearchContainer({results}) {
    const [filter, setFilter] = useState('all')
    const handleFilterChange = (selectedFilter) => {
        setFilter(selectedFilter)
    }
    const filteredResults = () => {
        switch (filter) {
            case 'photos':
                return results?.photos?.map((photo) => (
                    <CardPhoto key={photo.id} data={photo} gridRowEndOption={true} show={true} idUser={photo.user?.id} />   
                ))
            case 'collections':
                return results?.collections?.map((collection) => (
                    <CardCollection key={collection.id} collection={collection} gridRowEndOption={true} show={true} idUser={collection.user?.id}/>   
                ))
            case 'profiles':
                return results?.profiles?.map((profile) => (
                    <CardProfile key={profile.user?.id} profile={profile} />
                ))
            default:
                return <>
                    {results?.photos?.map((photo) => (
                        <CardPhoto key={photo.id} data={photo} gridRowEndOption={false} show={true} idUser={photo.user?.id}/>
                    ))}
                    
                    {results?.collections?.map((collection) => (
                        <CardCollection key={collection.id} collection={collection} gridRowEndOption={false} show={true} idUser={collection.user?.id} />
                    ))}

                    {results?.profiles?.map((profile) => (
                    <CardProfile key={profile.user?.id} profile={profile} />
                    ))}
                </>
        }
    }
    return (
        <div className="flex flex-col gap-10 h-full w-full py-36">
            <div className="flex justify-between w-full">
                <span className="text-base font-medium">Resultados: {results?.photos?.length + results.collections?.length + results.profiles?.length}</span>
                <Dropdown label="Filtrar resultados" inline>
                    <Dropdown.Item onClick={() => handleFilterChange("all")} >Todos</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange("photos")} >Fotografias</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange("collections")}>Colecciones</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleFilterChange("profiles")}>perfiles</Dropdown.Item>
                </Dropdown>
            </div>
            <div className="grid grid-cols-[repeat(4,minmax(200px,1fr))] gap-10 w-full h-auto z-0 py-20">
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