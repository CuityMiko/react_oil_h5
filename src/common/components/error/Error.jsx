import React from 'react';

class Error extends React.Component {
    state = {
        title: '错误页'
    };
    
    render() {
        const {title} = this.state;
        return (
            <div className="center" style={{height: '100%', background: '#ececec', overflow: 'hidden'}}>
                <h3>{title}</h3>
            </div>
        )
    }
}

export default Error;