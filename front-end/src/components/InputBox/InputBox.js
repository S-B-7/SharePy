import React from 'react'
import "./InputBox.scss"

function InputBox({label,type, variable, setVar, className, style}) {
    return (
        <div id="field" className = {className} style={style}>
            <input name="inputbox" className="field-input"
                type={type}
                value={variable} 
                onChange={e=>setVar(e.target.value.trim())} 
                placeholder={label}
            />
            <label htmlFor="inputbox" className="field-label">{label}</label>
        </div>
    )
}

export default InputBox
