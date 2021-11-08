import * as React from 'react';
import c from "./List.scss";

const List = (props) => {
    const options = props.options 
    return (
        <div>
            <select className={c.list + " " + c.list__text + " " + c.list_theme} required>
                {
                    options.map(u => <option>{u.optionName}</option>)
                }
            </select>
        </div>
    )
}

export default List;