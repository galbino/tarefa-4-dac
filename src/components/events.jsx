import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemIcon, ListItemText, Collapse, TextField, IconButton, Button, Modal } from '@material-ui/core';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import { ExpandLess, ExpandMore, Delete, Add, Create, Save } from '@material-ui/icons';
import { getApiUrl } from '../utils';
import NavBar from './navbar';

const Events = () =>  {
    const [items, setItems] = useState([]);
    const [edicao, setEdicao] = useState({});
    const [open, setOpen] = React.useState(false);

    
    useEffect(() => {
        listItems();
    }, []);

    const listItems = () => {
      let url = getApiUrl('evento');
      axios.get(url).then(res => {
          const { data } = res;

          const newData = Object.assign([], data);
          newData.map(item => item.isEditing = false);

          setItems(newData);
      });
  }

    const updateItem = (item) => {
      item.edicoes.map(edicao => { 
        edicao.evento = {id: item.id};
        return edicao;
      })
      console.log(item);
      if (item.id) {
        let url = getApiUrl(`evento/${item.id}`);
        axios.put(url, item)
            .then(() => listItems());
      } else {
        let url = getApiUrl(`evento`);
        axios.post(url, item).then(() => listItems());
      }
    }

    const updateEdicao = (item) => {
      const newEdicao = Object.assign({}, edicao);
      const newItems = Object.assign([], items);
      const newItem = newItems.find(it => it === item);
      if (newEdicao.id){
        newItem.edicoes = newItem.edicoes.filter(oldEdicao => {
          if (oldEdicao.id === newEdicao.id) {
            return newEdicao;
          }
          return oldEdicao;
        });
      } else {
        newItem.edicoes.push(newEdicao);
      }
      setItems(newItems);
      setOpen(false);
    }

    const deleteItem = (e, item) => {
      e.stopPropagation();
      if (item.id){
        let url = getApiUrl(`evento/${item.id}`);
        axios.delete(url)
            .then(() => listItems());
      } else listItems();
    }

  const editItem = (item) => {
    const newItems = Object.assign([], items);
    let newItem = newItems.find(it => it === item);
    newItem.isEditing = !newItem.isEditing;
    if (newItem.isEditing) {
      let url = getApiUrl(`evento/${item.id}`);
      axios.get(url)
            .then(resp => { 
              const { data } = resp;
              data.isEditing = true;
              newItems.filter(objItem => {
                if (objItem === newItem) {
                  return resp.data;
                }
                return objItem;
              })
      })
    }
    setItems(newItems);
  }

  const handleChange = (e, item)  => {
    const newItems = Object.assign([], items);
    const newItem = newItems.find(it => it === item);
    newItem[e.target.name] = e.target.value;
    setItems(newItems);

  }

  const onCreateClick = () => {
    let newItem = {
      nome: "",
      sigla: "",
      area: "",
      isEditing: true,
      edicoes: [],
      instituicao: ""
    };
    console.log(items);
    const newItems = Object.assign([], items);
    newItems.push(newItem);
    setItems(newItems);
  }

  const handleEdicaoChange = (e)  => {
    const newEdicao = Object.assign({}, edicao);
    newEdicao[e.target.name] = e.target.value;
    setEdicao(newEdicao);
  }


  const handleClose = () => {
    setOpen(false);
  };

  const onAddClick = () => {
    let newEdicao = {
      id: "",
      numero: "",
      ano: "",
      dataInicio: null,
      dataFim: null,
      cidadeSede: "",
      pais: "",
      evento: {id: ""}
    };
    setEdicao(newEdicao);
    setOpen(true);
  }

  const onSelectEdicao = (index, item) => {
    const newItems = Object.assign([], items);
    const newItem = newItems.find(it => it === item);
    newItem.selected = index;
    setItems(newItems);
  }
  const editEdicao = (e, ed) => {
    e.stopPropagation();
    setEdicao(ed);
    setOpen(true);
  }

  const deleteEdicao = (e, item, ed) => {
    e.stopPropagation();
    const newItems = Object.assign([], items);
    const newItem = newItems.find(it => it === item);
    newItem.edicoes = newItem.edicoes.filter(edicao => {if (ed.id !== edicao.id) return edicao})
    console.log(newItem);
    setItems(newItems);
    // axios.delete(`http://localhost:8080/tarefa_03-1.0-SNAPSHOT/api/edicao/${edicao.id}`)
        // .then(() => listItems());
  }

  return (
      <>
      <NavBar />
      <div style={{ display: 'flex', margin: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          style={{width: '130px'}}
          startIcon={<Add /> }
          onClick={onCreateClick}
        >
            Evento
        </Button>
      </div>
      <List>
        {items.map(item => {
          return (
            <div key={item.id ? item.id : "new"}>
            <ListItem button onClick={() => editItem(item)}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary={item.nome} /> 
              <Button
                variant="contained"
                color="secondary"
                startIcon={<Delete />}
                onClick={(e) => deleteItem(e, item)}
              >
                Deletar
              </Button>
              {item.isEditing ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
            <Collapse in={item.isEditing} timeout="auto" unmountOnExit>
                <div style={{display: 'flex', gap: '10px', justifyContent: 'center', padding: '10px'}}>
                  {Object.keys(item).map(k => {
                    return (
                      (k !== "isEditing" && k !== "edicoes" && k !== "selected")  &&
                        <TextField key={item.id ? item.id + "_" + k : "new_" + k} name={k} value={item[k]} label={k} disabled={k === "id"} onChange={(e) => handleChange(e, item)}/>
                      )
                  })}
                </div>
                <div>
                  <Modal open={open} onClose={handleClose} aria-labelledby="simple-modal-title" aria-describedby="simple-modal-description">
                    <div style={{ 
                          position: 'absolute',
                          width: 400,
                          backgroundColor: "white",
                          border: '2px solid #CCC',
                          top: "20%",
                          left: "35%",
                          display: "grid",
                          padding: "30px"
                      }}
                    >
                      {Object.keys(edicao).map(k => {
                        return (
                          (k !== "selected" && (k !== "id" || edicao[k]) && k !== "evento")  &&
                            <TextField 
                              key={item.id ? item.id + "_" + k : "new_" + k}
                              name={k} 
                              value={edicao[k]} 
                              label={k} 
                              disabled={k === "id"} 
                              onChange={handleEdicaoChange}
                              style={{margin: '5px'}}
                            />
                          )
                      })}
                      <br></br>
                      <Button variant="contained" onClick={() => updateEdicao(item)}>{edicao.id ? "Salvar" : "Criar"}</Button>
                    </div>
                  </Modal>
                  {item.edicoes.length > 0 && 
                    <List style={{ backgroundColor: '#ccc'}}>
                      {item.edicoes.map((ed, index) => {
                        return (
                          <ListItem button onClick={() => onSelectEdicao(index, item)} key={ed.id ? ed.id : index} selected={index === item.selected}>
                            <ListItemText primary={ed.numero} />
                            <IconButton 
                              aria-label="edit" 
                              onClick={(e) => editEdicao(e, ed)}
                            > 
                              <Create /> 
                            </IconButton>
                            <IconButton aria-label="delete" onClick={(e) => deleteEdicao(e, item, ed)}> 
                              <Delete /> 
                            </IconButton>
                          </ListItem>
                        )
                      })}
                    </List>
                  }
                </div>
                <br/><br/>
                
                <div style={{gap: '10px', display: 'flex', justifyContent: 'center', marginBottom: '15px'}}>
                  <Button
                    variant="contained"
                    color="primary"
                    style={{width: '130px'}}
                    startIcon={<Add /> }
                    onClick={onAddClick}
                  >
                      Edição
                  </Button>
                  <Button 
                    color="primary" 
                    variant="contained" 
                    style={{width: '130px', backgroundColor: '#4BB543'}}
                    startIcon={<Save /> }
                    onClick={() => updateItem(item)}
                  >
                    {item.id ? "Salvar" : "Criar"}
                  </Button>
                </div>
            </Collapse>
            </div>
          )
        })}
      </List>
      
          {/* {
              items.map(item => {
                  return <div key={item.id}>

                      <div onClick={() => editItem(item)}>edit</div>
                      <div onClick={() => deleteItem(item)}>delete</div>

                      <div>
                          {item.isEditing &&
                              <div>
                                  campos para editar
                              </div>
                          }
                      </div>


                  </div>
              })
          } */}
      </>
  );
    
}

export default Events;