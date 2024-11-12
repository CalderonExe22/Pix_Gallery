import PropTypes from 'prop-types'
export default function CardCollection({photo}) {
    return (
        <div className="relative overflow-hidden rounded-lg shadow-lg h-[350px] w-[300px] group">
            <img 
                src="https://womantimes.com/wp-content/uploads/2021/11/karsten-winegeart-lQ8WvR54MOU-unsplash-scaled.jpg" 
                className='absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 transform z-30 group-hover:-translate-x-2/3'
                alt=""
            />
            <img 
                src="https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcSC4DtHTGprsp7K8u0ZlfSDmIDplvQYH5vniT0I3rpcl6wqBh8b" 
                className='absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 transform z-20 group-hover:-translate-x-1/3'
                alt=""
            />
            <img 
                src="https://www.elmueble.com/medio/2024/10/17/conejo-en-el-campo_b12f5f96_173893247_241017115925_900x900.webp" 
                className='absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 transform z-10'
                alt=""
            />
            <div className="absolute z-50 inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-full flex items-center justify-center gap-2 pb-4 z-50 transform translate-y-full transition-all duration-300 group-hover:translate-y-0">
                <span className="text-xs"></span>
                <button><i className="fa-solid fa-heart"></i></button>
            </div>
        </div>
    )
}

CardCollection.propTypes = {
    photos : PropTypes.array
}