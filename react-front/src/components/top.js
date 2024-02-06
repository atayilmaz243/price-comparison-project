import '../styles/main-top.css';
import '../styles/background.css';
import '../styles/resize/top.css';
import React, { useState, useEffect,useRef,useMemo } from 'react';
import { BookmarkIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom';
import UserAuth,{Login} from './userlogin';


function SearchResults({results,isOpen,setOpen,SearchRef}) {
  const navigate = useNavigate();


  useEffect(() => {
    let closeOnClick = (e) => {
      if (!SearchRef.current.contains(e.target))
      {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown',closeOnClick);
    return () => {
      document.removeEventListener('mousedown',closeOnClick);
    };

  });

 // usememo below
  const filteredItems = useMemo(() => { return results.map((item) => {
      return <div className = "Search-result" key = {item.id} onClick = {() => {
        navigate(`/product/${item.id}`);
        setOpen(false);
      }}>{item.name}</div>;
    });},[results,navigate,setOpen]); // setopen creates problem here

  return (
    <div className = "Search-results-container">
      {isOpen && filteredItems}
    </div>
  );

}

function SearchBarContainer(){
  const [items,setItems] = useState([]);
  const [isOpen,setOpen] = useState(false);
  const SearchRef = useRef();
  const navigate = useNavigate();
  const [query,setQuery] = useState("");

  useEffect(() => 
  {
    if (query === "")
    {
      setItems([]);
    }
    else {
      const fetchData = async () => {
        const res = await fetch(process.env.REACT_APP_API_URL + `/search/${query}`);
        const data = await res.json();
        setItems(data);
      }
      fetchData();
    }
  },[query]);

  return (<>
    {(isOpen && query) && <div className = "top-blank"></div>}
    <div ref = {SearchRef} className = "top-search-container">
      <input onClick = {() => setOpen(true)} type="text" value = {query} onKeyDown={(e) => {
        if (e.key === 'Enter' && query) {
          navigate(`/search-page/${query}`);
          setOpen(false);
          e.target.blur();
        }
      }} 
      onChange = {(e) => setQuery(e.target.value)} placeholder="Hangi ürünü incelemek istersiniz?" className="top-search-bar"/>

      <button className = "top-search-button" onClick = {() => {
          if (query) 
          {
            navigate(`/search-page/${query}`);
          }
        }}>
          <img src = "https://storage.googleapis.com/images4134123/other/search-button-image.png" alt = " "/>
      </button>

      <SearchResults results = {items} isOpen = {isOpen} setOpen = {setOpen} SearchRef = {SearchRef}/>
    </div>
  </>)
}

// function HomeLogo(){
//   return (<div className = "home-logo-container">
//     <img src = "https://storage.googleapis.com/images4134123/other/homo-page-logo.jpeg" alt = ""/>
//   </div>);



// }

// !!!
function WishLogo({counter,user})
{
  const [openLogin,setLogin] = useState(false);
  const navigate = useNavigate();
  return (
  <>
    {openLogin && <Login setOpen = {setLogin} />}
    <div className = 'top-wish-logo' onClick = {() => {
      if (!user)
      {
        setLogin(true);
      }
      else
      {
        navigate('/wishlist')
      }
    }}>
      <BookmarkIcon />
      {(counter && counter !== 0)  ?  <div className = 'top-wish-logo-counter'>
        {counter}
      </div> : null}
    </div>
  </>
  );

}

function TopContainer({setListItems,list,setList,user,setUser}){
  const [wishCounter,setWishCounter] = useState(null);
  const navigate = useNavigate();
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.scrollY);


  useEffect(() => {
    if (list)
    {
      setWishCounter(list.length);
    }
    else
    {
      setWishCounter(null);
    }
  },[list]);


  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setHeight(window.scrollY);
      // console.log(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (<>
    <div id="top-container" style = {{height: ((width <= 560 && height < 10) ? 180 : 60)}}>
        {/* <HomeLogo /> */}
        { (width > 560 || (height < 10)) &&
          <>
            <div className = 'top-left'>
              <div className = 'top-logo' onClick = {() => {navigate('/')}}><img src = "../logo.png" alt = "" style = {{height:35,width:35}}/></div>
            </div>
            <SearchBarContainer />
          </>
        }
        <div className = 'top-right'>

          <WishLogo counter = {wishCounter} user = {user}/>
          <UserAuth setListItems = {setListItems} list = {list} setList={setList} user = {user} setUser = {setUser}/>

        </div>
    </div>
  </>);
}

export default TopContainer;