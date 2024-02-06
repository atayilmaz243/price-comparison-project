
import "../styles/wishlist.css"
import "../styles/resize/wishlist.css"

import TopContainer from "../components/top"
import { Cross1Icon,ArrowUpIcon,ArrowDownIcon,OpenInNewWindowIcon} from "@radix-ui/react-icons";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dropItem, setUserList } from "../components/functions";

function WishItem({item,list,setList,user,swap,index})
{
  // console.log(item.id);
  // console.log(item);
  const navigate = useNavigate();
  return <>
  <div className = 'line' style = {{margin:0,marginTop:15,marginBottom:15}}></div>
  <div className = 'wish-item'>
    <div className = 'wish-item-image'>
      <img src = {item.img_link} alt = ""/>
    </div>
    {/* <div className = 'wish-item-info'> */}
    <div className = 'wish-flexbox'>
      <div className = "wish-item-name">
        <div style = {{fontWeight:500,fontSize:15}}>{item.company}</div>
        <div style = {{fontWeight:300,fontSize:16}} className = 'wish-name-wrap' title = {item.name}>{item.name}</div>
        <div style = {{fontWeight:300,fontSize:16}} className = 'wish-name-wrap2'>{item.features}</div>
      </div>
      <div className = "wish-item-price">
        <div className = 'wish-item-price-label'>
          <div className = 'wish-label-a213'>En ucuz</div>
          <div>{item.price} TL</div>
        </div>
        <div className = 'wish-item-buttons'>

          <button onClick = {() => {
              navigate(`/product/${item.id}`);
            }}className = 'wish-item-button'>
            <OpenInNewWindowIcon />
          </button>
{/* 
          <button className = 'wish-item-button'>
            <BellIcon />
          </button> */}
        </div>
      </div>
    </div>
    {/* </div> */}
    


    <div className = "wish-item-op-logo-container">
      <Cross1Icon className = 'wish-item-op-logo' onClick = {() => {dropItem(user.uid,item.id,list,setList)}}/>
      {(list[0] !== item.id) && <ArrowUpIcon onClick = {() => {swap(index,index-1)}} className = 'wish-item-op-logo' />}
      {(list[list.length-1] !== item.id) && <ArrowDownIcon onClick = {() => {swap(index,index+1)}} className = 'wish-item-op-logo' />}
    </div>

  </div>
  </>
}

function Wish({items,list,setList,user})
{
  const [itemsHTML,setHTML] = useState(null);
  function swap(i1,i2)
  {
    let copy = list.slice();
    const tmp = copy[i1];
    copy[i1] = copy[i2];
    copy[i2] = tmp;
    setList(copy);
    setUserList(user.uid,copy);
  }
  // console.log(items);
  // console.log(list);
  useEffect(() => {
    const HTML = items && items.map((item,index) => (
      <WishItem item = {item} key = {item.id} list = {list} setList = {setList} user = {user} swap = {swap} index = {index}/>
    ));
    setHTML(HTML);
  // eslint-disable-next-line
  },[items]);

  return <div className = 'wish'>
    {(items && items.length !== 0) ?
      <>
      <p style = {{margin:0,marginBottom:-5,marginTop:20,fontWeight:500,fontSize: 26}}>Takip listesi</p>
      {itemsHTML}
      </>
      :
      <div className = 'wish-empty-list'>Takip listenizde ürün bulunmamakta</div>
      
    }
  </div>

}



export default function WishList()
{
  const [items,setItems] = useState(null);
  const [list,setList] = useState(null);
  const [user,setUser] = useState(null);
  return (
    <>
      <TopContainer setListItems = {setItems} list = {list} setList = {setList} user = {user} setUser = {setUser}/>
      <Wish items = {items} list = {list} setList = {setList} user = {user}/>
    </>
  );

}