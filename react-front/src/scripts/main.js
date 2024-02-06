import '../styles/main-top.css';
import '../styles/main-item-container.css'
import '../styles/main-body.css'
import '../styles/main.css'
import '../styles/category.css'
import '../styles/resize/main.css'
import React, { useState, useEffect,useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import TopContainer from '../components/top';
import {MobileIcon, HomeIcon, ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import Category from '../components/category/category';
import { Headphones,HeadphonesFilled } from '../components/svg-icons';

function Item({imgLink,name,price,priceD,id}) {
  const navigate = useNavigate();
  return (
    <>
    <div className = "item">
      <div className = "item-image">
        <img onClick = {() => {navigate(`/product/${id}`)}} src = {imgLink} className = "item-image" alt = " " />
      </div>
      <p onClick = {() => {navigate(`/product/${id}`)}} className = "item-name" title = {name}>{name}</p>
      <p className = "item-a8643"> En Ucuz</p>
      <p onClick = {() => {navigate(`/product/${id}`)}}className = "item-price-tl">{price},<span className = "item-price-decimal">{priceD} ₺</span></p>
    </div>
  </>
  );
}

function ItemGrid({items,slide}) {
  const [lastIndex,setLIndex] = useState(null);
  const firstIndex = useRef(0);
  const [visibleItems,setVItems] = useState([]);

  function calcWidth()
  {
    if (window.innerWidth > 920)
    {
      return 4;
    }
    else if(window.innerWidth > 670)
    {
      return 3;
    }
    else return 2;
  }

  useEffect(() => {
    if (slide)
    {
      setLIndex(calcWidth());
      const handleResize = () => {
        setLIndex(firstIndex.current+calcWidth());
      };
  
      window.addEventListener('resize', handleResize);
  
      return () => {
        window.removeEventListener('resize', handleResize);
      };

    }
    else
    {
      setVItems(items);
    }
    // eslint-disable-next-line 
  },[]);

  // kontrol et
  useEffect(() => {
    if (lastIndex)
    {
      if (lastIndex > items.length)
      {
        setLIndex(items.length);
      }
      else
      {
        const fIndex = (lastIndex-calcWidth());
        if (fIndex < 0)
        {
          setLIndex(calcWidth());
        }
        else
        {
          firstIndex.current = fIndex;
          setVItems(items.slice(fIndex,lastIndex));
        }
      }
    }
    // eslint-disable-next-line 
  },[lastIndex]);


  const arr = visibleItems.map((item) => (
    <Item
      imgLink={item.img_link} 
      id = {item.id}
      key ={item.id} 
      name={item.combinedName} 
      price={item.price}
      priceD={item.priceD}
    />
  ));

  return (
    <>
      <div className = "item-grid">
        {arr}
        {slide && 
        <>
          {
            firstIndex.current !== 0 && <ChevronLeftIcon onClick = {() => {
              setLIndex(lastIndex-calcWidth());
            }} className = 'left-arrow'/>
          }

          {
            lastIndex !== items.length && 
            <ChevronRightIcon onClick = {() => {
              setLIndex(lastIndex+calcWidth());
            }} className = 'right-arrow'/>  
          }
        </>}
      </div>
      
    </>
  );

}

function ItemContainer({name,items,slide}){
  return (
    <>
      <div className= "item-container">
        <div className = "item-container-info">
          <p className = "item-container-name">{name}</p>
          <div className = "line"></div>
        </div>
          <ItemGrid items = {items} slide = {slide}/>
      </div>
    </>
  ); 
}

function MainContainer(){
  
  const [itemContainers, setItemContainers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + "/main");
        const data = await response.json();
        setItemContainers(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, []);

  const arr = itemContainers.map((container, index) => (
    <ItemContainer 
      key={index} 
      name={container.name} 
      items={container.items} 
      slide = {container.slide}
    />
  ));

  return (
    <>
      <div className = "main-container">
        {arr}
      </div>
    </>
  );
}


function Categories({category,setCategory,setCategoryName})
{
  const [hovered, setHovered] = useState(false);

  return (
    <div className = 'category'>
      <div className = 'category-container' onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        <div className = {(!hovered && category === 'home') ? 'category-selected category-item' : 'category-item'}
          onClick = {() => {setCategory('home')}}>
          <HomeIcon />
        </div>
        <div className = {(!hovered && category === 'telefon') ? 'category-selected category-item' : 'category-item'}
          onClick = {() => {setCategory('telefon');setCategoryName('Telefonlar')}}>
          <MobileIcon />
        </div>
        <div className = {(!hovered && category === 'Kulaklık') ? 'category-selected category-item' : 'category-item'}
          onClick = {() => {setCategory('Kulaklık');setCategoryName('Kulaklık modelleri')}}>
          {category === 'Kulaklık' ? <HeadphonesFilled /> : <Headphones />}
        </div>
      </div>
    </div>



  );

}
// aaa
function App() {
  const [list,setList] = useState(null);
  const [user,setUser] = useState(null);
  const [category,setCategory] = useState('home');
  const [categoryName,setCategoryName] = useState(null);

  // console.log(process.env.REACT_APP_API_URL);
  return (<>
    <TopContainer list = {list} setList = {setList} user = {user} setUser = {setUser}/>
    <Categories category= {category} setCategory = {setCategory} setCategoryName = {setCategoryName}/>
    {category === 'home' ? 

        <MainContainer />
    :
      <Category category = {category} categoryName= {categoryName}/>}
  </>
  );
}

export default App;
