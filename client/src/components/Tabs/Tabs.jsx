import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function Tabs({ children }) {
    const [activeTab, setActiveTab] = useState(0);
    const childrenArray = React.Children.toArray(children); // Asegura que children es un array
    console.log('Children:', childrenArray); // Debería mostrar un array de elementos Tab

    return (
        <div className='flex flex-col justify-center items-center w-full'>
            <div className="flex justify-center w-full pt-16 pb-16">
                {childrenArray.map((tab, index) => {
                    if (!tab.props.title) {
                        console.error('Cada Tab debe tener una propiedad "title"');
                    }
                    return (
                        <button
                            key={index} 
                            className={`tab-button ${activeTab === index ? 'border-solid border-b-4 border-[#b5179e]' : ''} w-[200px] text-center`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.props.title}
                        </button>
                    );
                })}
            </div>
            <div className="flex w-full h-auto pb-20 ps-20 pe-20">
                {childrenArray[activeTab]}
            </div>
        </div>
    );
}

Tabs.propTypes = {
    children: PropTypes.node
};