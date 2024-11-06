import {PropTypes} from 'prop-types'

function Input ({ label, type, name, register, errors, required, validationRules }) {
    return (
        <div className='flex flex-col'>
            <label htmlFor={name}>{label}:</label>
            <input 
                id={name}
                type={type} 
                {...register(name,
                    {
                        required,
                        ...validationRules
                    }
                )} 
                autoComplete={name}
            />
            {errors[name] && <p className='text-red-800'>{errors[name].message}</p>}
        </div>
    );
};

export default Input;

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    name : PropTypes.string,
    id: PropTypes.oneOfType([
        PropTypes.string,
    ]),
    register: PropTypes.func,
    validationRules: PropTypes.object,
    required: PropTypes.oneOfType([ // 'required' puede ser un string (mensaje de error) o un boolean
        PropTypes.string,
        PropTypes.bool,
    ]),
    errors: PropTypes.object,
}