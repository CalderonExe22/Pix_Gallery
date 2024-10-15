import { Suspense } from "react";

const LazyLoad = (Component) => {
    return (
        <Suspense fallback={<div>...loading</div>}>
            <Component />
        </Suspense>
    );
}

export default LazyLoad