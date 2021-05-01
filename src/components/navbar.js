import React from 'react';
import { useHistory } from 'react-router-dom';


const NavBar = () => {
    const history = useHistory();

    const handleRedirect = (route) => {
        history.push(route);
    }

    const pages = [
       {
           name: 'events',
           label: 'EVENTOS',
           route: '/events'
       },
       {
        name: 'ediitons',
        label: 'EDIÇÕES',
        route: '/editions'
    }
    ];

    return (
        <div style={{display: 'flex', fontSize: '18px', gap: '20px', justifyContent: 'center', margin: '20px'}}>
            {pages.map(page => 
                   <div 
                        key={page.name} 
                        onClick={() => handleRedirect(page.route)} 
                        style={{cursor: 'pointer'}}
                    >
                        {page.label}
                   </div>
                
            )}
        </div>   
    )
}

export default NavBar;