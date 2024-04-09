import {useEffect, useRef} from "react";
import {isEqual} from "lodash";

function useDeepCompareEffect(callback, dependencies) {
    const currentDependenciesRef = useRef();

    if (!isEqual(currentDependenciesRef.current, dependencies)) {
        currentDependenciesRef.current = dependencies;
    }

    useEffect(() => {
        if (currentDependenciesRef.current) {
            callback();
        }
        callback();
    }, [currentDependenciesRef.current]);
}
export default useDeepCompareEffect;
