import { ChangeEventHandler } from 'react';
import '../styles/switch.css'
interface SwitchProps{
    title:string;
    content:string;
    onToggle?:ChangeEventHandler;
    isOn?:boolean;
}
function Switch({title,content,onToggle,isOn}:SwitchProps) {

    


    return (
        <div className='switchBtn'>
            <div>
                <label className="switch">
                    <input type="checkbox"   checked={isOn}
        onChange={onToggle} />
                    <span className="slider round"></span>
                </label>
            </div>
            <div className='title'>
                <p>{title}</p>
                <span>{content}</span>
            </div>
        </div>
    )
}

export default Switch