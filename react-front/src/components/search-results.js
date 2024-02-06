import '../styles/search.css'
import '../styles/resize/search-results.css';

import React,{useState,useEffect} from 'react';
import { useParams,useNavigate } from 'react-router-dom';



function Item({imgLink,name,price,priceD,id}) {
  const navigate = useNavigate();

  return (
    <div className = "item" onClick = {() => {
      navigate(`/product/${id}`)
    }}>
      <div className = "item-image">
        <img src = {imgLink} className = "item-image" alt = " " />
      </div>
      <p className = "item-name">{name}</p>
      <p className = "item-a8643"> En Ucuz</p>
      <p className = "item-price-tl">{price},<span className = "item-price-decimal">{priceD} ₺</span></p>
    </div>
  );
}

function CheckPriceRange(min,max,price)
{
  let val = price;
  val = val = val.replace(/[^0-9]/g, '');
  if (val < min || val > max)
  {
    return false;
  }
  return true;
}

function ItemGrid({items,filter}) {
  const arr = items.map((item) => {
    return (
        <Item
        imgLink={item.img_link} 
        id = {item.id}
        key ={item.id} 
        name={item.name} 
        price={item.price}
        priceD={item.priceD}
      />);
  });
        
  return (
    <div className = "searchpage-item-grid">
      {arr}
    </div>
  );

}

function ItemContainer({items,filter,category}){
  const { query } = useParams();
  let formatedName = null;
  if (category)
  {
    formatedName = `${category}`;
  }
  else
  {
    formatedName = `${query}`;
  }
  return (
    <>
      {
        items.length === 0 ?
        <div className = 'item-not-found'>
            "{formatedName}" ile eşleşen ürün bulunamadı.
        </div>
        :
        <div className= "item-container">
          <div className = "item-container-info">
            <p className = "item-container-name">{ category ? formatedName : ('"' + formatedName + '"')}</p>
            <div className = "line"></div>
          </div>
            <ItemGrid items = {items} filter = {filter}/>
        </div>
      }         
    </>
  );
}

function SearchResults({filter,itemContainers,category}){
  const [allItems,setAllItems] = useState([]);
  const [visibleItems,setVItems] = useState([]);
  const [lastIndex,setLIndex] = useState(0);
  useEffect(() => {
    const res = itemContainers.filter((item) => (filter.companyBool[`${item.company}`] && CheckPriceRange(filter.range.min,filter.range.max,item.price)));
    setAllItems(res);
    setVItems(res.slice(0,Math.min(res.length,12)));
    setLIndex(Math.min(res.length,12))
  },[itemContainers,filter.companyBool,filter.range]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 10) {
        loadMoreItems();
      }
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line
  },[lastIndex]);

  function loadMoreItems()
  {
  
    if (lastIndex === allItems.length)
    {
      // console.log('aaa');
      return;
    }
    // console.log('bbb');
    // console.log(allItems);
    const newIndex = Math.min(allItems.length,lastIndex+12);
    setLIndex(newIndex);
    setVItems(allItems.slice(0,newIndex));
  }

  return (
    <>
      <div className = "searchpage-item-container">
        <ItemContainer 
        items={visibleItems} 
        filter = {filter}
        category = {category}
        />
      </div>
    </>
  );
}

export default SearchResults;