import PropTypes from 'prop-types';
export default function Tab({children, title}) {
    return (
        <div className="flex justify-center items-center h-full w-full">
            {children}
        </div>
    )
}

Tab.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string
  };