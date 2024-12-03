import style from './ListsPhotos.module.css'
import CardPhoto from '../Cards/CardPhoto/CardPhoto'
import PropTypes from 'prop-types'
import CardCollection from '../Cards/CardCollection/CardCollection'

export default function ListsPhotos({data, type, layoutStyle, gridRowEndOption}) {
    
    const getContainerClass = () => {
        if (layoutStyle === "grid") {
            return style.containerGrid; // Estilo de CSS Grid
        } else if (layoutStyle === "columns") {
            return style.containerColumns; // Estilo de CSS Columns
        }else if (layoutStyle === 'gridOrden') {
            return style.containerGridOrden
        }
        else {
            return "";
        }
    };
    return (
        <div className={getContainerClass()}>
            {data && data.length > 0 ? (
                data.map((item) => {
                    if (type === 'photos') {
                        return <CardPhoto showLike={true} key={item.id} data={item} gridRowEndOption={gridRowEndOption} show={false} />;
                    } else if (type === "collections") {
                        return <CardCollection gridRowEndOption={gridRowEndOption} key={item.id} collection={item}/>;
                    }
                    return null;
                })
            ) : (
                <p className='text-center'>No hay datos disponibles</p>
            )}
        </div>
    )
}

ListsPhotos.propTypes = {
    data : PropTypes.array,
    type : PropTypes.string,
    layoutStyle: PropTypes.string,
    gridRowEndOption: PropTypes.bool
}