import { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();



export const NavigationProvider = ({ children }) => {
    const [activeBaseRoute, setActiveBaseRoute] = useState('/');
    const [activeCaption, setActiveCaption] = useState('');

    const [stack, setStack] = useState(
        [
        ]);

    const pushToStack = (item) => {
        setStack((prevStack) => [...prevStack, { caption: item.caption, url: item.url}]);
    };

    const popFromStack = (index) => {
        if (index < stack.length - 1) {
            const updatedStack = stack.slice(0, index + 1);
            setStack(updatedStack);
        } else {
            console.error('Invalid index');
        }
    };

    const emptyStack = () => {
        setStack([]);
    };

    const setBaseRoute = (to, caption) => {
        emptyStack();
        setActiveBaseRoute(to);
        setActiveCaption(caption);
    };
    const appendChildCaptionToActiveBaseRoute = (childCaption) => {
        setActiveCaption(`${activeCaption} / ${childCaption}`);
    };

    return (
        <NavigationContext.Provider
            value={{
                activeBaseRoute,
                activeCaption,
                setBaseRoute ,
                appendChildCaptionToActiveBaseRoute,
                pushToStack,
                popFromStack,
                emptyStack,
                stack

        }}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigationContext = () => useContext(NavigationContext);
