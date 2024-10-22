
import style from './Home.module.css'
import ListsPhotos from '../../components/ListsPhotos/ListsPhotos';

export default function Home() {
    return (
        <div className={style.home_container}>
            <ListsPhotos />
        </div>
    )
}
