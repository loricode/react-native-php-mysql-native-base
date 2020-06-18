import React , {useState, useEffect} from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import {Container, 
        Header,
        Content, 
        Card,
        CardItem,
        Item,Input,
        Body,Text,Button} from 'native-base'
       
import axios from 'axios';

export default function App(){

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [cantidad, setCantidad] = useState('');
  const [bandera, setBandera] = useState(false);
  const [id, setId] = useState('');
  const [lista, setLista] = useState([]);
  const [isReady,setIsRady]=useState(false);

  async function cargar(){
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
     
    });
   
     setIsRady(true)
  }


const guardar = async () => {
    try {
      if(!bandera){
       const obj = {nombre, precio, cantidad}
       await axios.post('http://192.168.1.5/backend/producto.php',obj);
     
  }else{
       const obj1 = {id, nombre, precio, cantidad}
       await axios.post('http://192.168.1.5/backend/actualizar.php',obj1);
       setBandera(false);
    }
  } catch (error) {
      console.log(error) 
  }
  
  setId('');
  setNombre('');
  setPrecio('');
  setCantidad('');
  await listar();
}

//listar datos 
const listar = async () => {
  try {
     const res = await axios.get('http://192.168.1.5/backend/listar.php');
     setLista(res.data)
       
    } catch (error) {
     console.log(error)
   }
}

useEffect(() => {
  cargar(); 
  listar();
},[])


const eliminar = async (id) => {
  const obj = {id}
  try {
     await axios.post('http://192.168.1.5/backend/eliminar.php',obj); 
  } catch (error) {
    console.log(error)
  }
   listar();
}

const actualizar = async (id) => {
  const obj = {id};

  try {
    const res = await axios.post('http://192.168.1.5/backend/obtener.php', obj);
    setId(res.data[0].id);
    setNombre(res.data[0].nombre);
    setPrecio(res.data[0].precio);
    setCantidad(res.data[0].cantidad);
  } catch (error) {
    console.log(error)
  }
  setBandera(true);
   listar();
}


  return (
    !isReady? 
       <AppLoading /> :
  
   <Container>
    <Header />
    <Content>
    <Card>
      <Item rounded style={{margin:10}}>
            <Input placeholder='nombre'
                onChangeText={nombre => setNombre(nombre)}
                value={nombre}/>
      </Item>
      <Item rounded style={{margin:10}}>
            <Input placeholder='precio'
                onChangeText={precio => setPrecio(precio)}
                value={precio}/>
      </Item>
      <Item rounded style={{margin:10}}>
            <Input placeholder='cantidad'
                onChangeText={cantidad=>setCantidad(cantidad)}
                value={cantidad}/>
      </Item>

        <Button bordered
            onPress={() => guardar()}
          >
            <Text>agregar</Text>
      </Button>
  </Card>

    {lista.map(item => (
      <Card key={item.id}>
        <CardItem>
          <Body>
            <Text>
                {item.nombre}  {item.precio}  {item.cantidad}
            </Text>

            <CardItem footer>
            <Button bordered  style={{margin:20}}
                onPress={() => eliminar(item.id)}
             >
                <Text>Eliminar</Text>
             </Button>
             <Button bordered 
                onPress={() => actualizar(item.id)}
              >
                 <Text>Editar</Text>
             </Button>  
            </CardItem>
           
          </Body>
        </CardItem>
      </Card>
    ))}
    </Content>
  </Container>
  
  );
}
