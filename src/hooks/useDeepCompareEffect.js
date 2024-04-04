import {useEffect, useRef} from "react";
import {isEqual} from "lodash";

function useDeepCompareEffect(callback, dependencies) {
    const currentDependenciesRef = useRef();

    if (!isEqual(currentDependenciesRef.current, dependencies)) {
        console.log('Dependencies changed:', { old: currentDependenciesRef.current, new: dependencies });
        currentDependenciesRef.current = dependencies;
    }

    useEffect(() => {
        console.log('Effect triggered:', currentDependenciesRef.current);
        callback();
    }, [currentDependenciesRef.current]);
}
export default useDeepCompareEffect;
