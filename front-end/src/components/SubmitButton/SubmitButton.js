import React from 'react'
import "./SubmitButton.scss"
function SubmitButton({onclick , text , className}) {
    return (
        <button className={`submit-button ${className}`} onClick={onclick}>
            {text}
        </button>

        
    )
}

export default SubmitButton
