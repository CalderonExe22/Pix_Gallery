import {PropTypes} from 'prop-types'

export default function Input ({ label, type = 'text', name, register, errors, required = false, validationRules = {}, placeholder = '' ,classNameStyle = '', onChange = () => {}, isChecked = true}) {
    return (
        <div className='flex flex-col items-start gap-3'>
            {label && (
                <label htmlFor={name}>{label}:</label> 
            )}
            <input
                onChange={onChange} 
                checked={type === 'checkbox' ? isChecked : undefined}
                className={classNameStyle}
                id={name}
                type={type} 
                {...register(name,
                    {
                        required,
                        ...validationRules
                    }
                )} 
                autoComplete={name}
                placeholder={placeholder}
            />
            {errors[name] && <p className='text-red-800'>{errors[name].message}</p>}
        </div>
    );
};


Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name : PropTypes.string,
    classNameStyle: PropTypes.string,
    placeholder: PropTypes.string,
    onChange:PropTypes.func,
    isChecked: PropTypes.bool,
    id: PropTypes.oneOfType([
        PropTypes.string,
    ]),
    register: PropTypes.func,
    validationRules: PropTypes.object,
    required: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
    ]),
    errors: PropTypes.object,
}