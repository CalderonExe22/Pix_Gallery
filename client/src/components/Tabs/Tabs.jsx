import React, { useState } from 'react';
import PropTypes from 'prop-types';

export default function Tabs({ children, extraChildren, styleButtonTab }) {
    const [activeTab, setActiveTab] = useState(0)
    const childrenArray = React.Children.toArray(children)


    return (
        <div className='relative flex flex-col justify-center items-center w-full'>
            <div className="sticky top-16 left-0 z-40 bg-white flex justify-center w-full pt-10 pb-16 gap-10">
                {childrenArray.map((tab, index) => {
                    if (!tab.props.title) {
                        console.error('Cada Tab debe tener una propiedad "title"');
                    }
                    return (
                        <button
                            key={index} 
                            className={`${styleButtonTab} ${activeTab === index ? 'border-solid border-b-4 border-[#b5179e] text-[#b5179e]' : ''}`}
                            onClick={() => setActiveTab(index)}
                        >
                            {tab.props.title}
                        </button>
                    );
                })}
            </div>
            {extraChildren &&
                (<div className='flex justify-start w-full p-16'>
                    {extraChildren && <div>{extraChildren}</div>}
                </div>)
            }
            <div className="flex w-full h-auto">
                {childrenArray[activeTab]}
            </div>
        </div>
    );
}

Tabs.propTypes = {
    children: PropTypes.node,
    extraChildren: PropTypes.node,
    styleButtonTab: PropTypes.string
};