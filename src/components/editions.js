import React, { useState, useEffect } from 'react';
import axios from 'axios';
import NavBar from './navbar';
import { List, ListItem, ListItemText, TextField } from '@material-ui/core';
import { getApiUrl } from '../utils';

const Editions = () => {
    const [editions, setEdition] = useState([]);
    const [search, setSearch] = useState([
        {
            name: 'cidade',
            label: 'Cidade',
            value: '',
        },
        {
            name: 'dataInicio',
            label: 'Data Incial',
            value: '',
        },
    ]);

    useEffect(() => {
        listEditions();
    }, []);

    const listEditions = () => {
        let url = getApiUrl('edicao');
        axios.get(url).then(res => {
            const { data } = res;

            const newData = Object.assign([], data);

            setEdition(newData);
        });
    }

    const onSearch = event => {
        const { value, name } = event.target;

        const newSearch = Object.assign([], search);

        newSearch.map(s => {
            if (s.name === name) {
                s.value = value;
            }
        });

        setSearch(newSearch);

        let url = getApiUrl('edicao');
        let cidade = search.find(fld => fld.name === "cidade");
        let dataInicio = search.find(fld => fld.name === "dataInicio");
        let searchFilter = []
        if (cidade.value) searchFilter.push(`${cidade.name}=${cidade.value}`);
        if (dataInicio.value) searchFilter.push(`${dataInicio.name}=${dataInicio.value}`);
        url += `?${searchFilter.join("&")}`;
        console.log(url)
        axios.get(url).then(response => {
            const { data } = response;

            setEdition(data);
        });
    }


    return (
        <div>
            <NavBar />

                {
                    search.map(s => {
                        return (
                            <TextField 
                                style={{margin: '5px'}}
                                key={s.name}
                                value={s.value}
                                label={s.label}
                                onChange={onSearch}
                                name={s.name}
                            />
                        )
                    })
                }
                



                <List style={{marginTop: '50px'}}>
                    {editions.map(edition => {
                        return (
                            <ListItem 
                                key={edition.id}
                                style={{borderBottom: '1px solid #ccc'}}
                            >
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: `repeat(10, 1fr)`,
                                    gap: '20px'
                                }}>
                                    <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'row'}}>
                                        <div>EVENTO</div>
                                        <div>{edition.evento.nome}</div>
                                    </div>
                                    <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'row'}}>
                                        <div>NÚMERO</div>
                                        <div>{edition.numero}</div>
                                    </div>

                                    <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'row'}}>
                                        <div>ANO</div>
                                        <div>{edition.ano}</div>
                                    </div>

                                    <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'row'}}>
                                        <div>CIDADE SEDE</div>
                                        <div>{edition.cidadeSede}</div>
                                    </div>

                                    <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'row'}}>
                                        <div>DATA INÍCIO</div>
                                        <div>{edition.dataInicio}</div>
                                    </div>

                                    <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'row'}}>
                                        <div>DATA FIM</div>
                                        <div>{edition.dataFim}</div>
                                    </div>

                                    <div style={{display: 'grid', gap: '10px', gridAutoFlow: 'row'}}>
                                        <div>PAÍS</div>
                                        <div>{edition.pais}</div>
                                    </div>
                                </div>

                                
                            </ListItem>
                        )
                    })}
                </List>
            
        </div>
    )
}

export default Editions;