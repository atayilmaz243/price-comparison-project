import '../styles/product.css';
import '../styles/resize/product.css'
import { useParams,useNavigate } from 'react-router-dom';
import React, { useState, useEffect,useMemo,useRef } from 'react';
import TopContainer from '../components/top'
import PriceChart from '../components/priceChart'
import DropDown from '../components/dropdown'
import { BookmarkFilledIcon, BookmarkIcon, Cross1Icon, EnterFullScreenIcon } from '@radix-ui/react-icons';
import { addItem, IncView, dropItem } from '../components/functions';
import { Login } from '../components/userlogin';




function OptionBox(box){
    const navigate = useNavigate();
    const changeURL = () => {
        navigate(`/product/${box.id}`);
    };

    if (box.type === "1") {
    return (
    <button className = "product-option-box" style = {box.check ? {borderColor :'#828282'} : {}} onClick = {changeURL}>
        <img className = "product-option-box-img" src = {box.img_link} alt = ""/>
        <div className = "product-option-info">
            <p className = "product-option-info-name">{box.name}</p>

        </div>
    </button>);
    }
    else {
        return (
        <button className = "product-option-storage-box" style = {box.check ? {borderColor :'#828282'} : {}} onClick = {changeURL}>
            <p className = "product-option-info-name">{box.name}</p>
        </button>);
    }
}

function InfoOption(option) {
    if (option.type === "1")
    {
        const arr = option.boxes.map((box) => {
            return (<OptionBox type = "1" img_link = {box.img_link} name = {box.name} key = {box.name} id = {box.id} check = {box.check}/> );
        });
        return (
        <div className = "product-option1">
            <p className = "product-option-name">{option.name}</p>   
            <div className = "product-color-box-container">
                {arr}
            </div>
        </div>);
    }
    else
    {
        const arr = option.boxes.map((box) => {
            return (<OptionBox type = "2" name = {box.name} key = {box.id} id = {box.id} check = {box.check}/> );
        });
        return (
        <div className = "product-option2">
            <p className = "product-option-name">{option.name}</p>   
            <div className = "product-storage-box-container">
                {arr}
            </div>
        </div>);
    }
}



function InfoProp({info}) {
    const { id } = useParams();
    const [options,setOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(process.env.REACT_APP_API_URL + `/product-info-option/${id}`);
                const data = await res.json();
                if (!res.ok)
                {
                    throw new Error(data.error);
                }
                // console.log(data);
                setOptions(data);



            } catch(e)
            {
                console.log(e);
            }
        }
        fetchData();
    },[id]);


    const arr = options.map( (option,index) => {
        return <InfoOption boxes = {option.boxes} name = {option.name} type = {option.type} key = {index}/>;
    });
    return (
        <div className = "product-head-information">
            <p className = "product-name" title = {info.name}>{info.name}</p>
            <p className = "product-name-features">{info.features}</p>

            <div className = "product-least-price-info">
                <p className = "product-curr-price-tl">{info.price}<span className = "product-price-decimal">,{info.priceD} TL</span></p> 
            </div>
            {arr}
        </div>
    );
}

function InfoContainer({imgLink,info}){

    return (
        <>
        <div className = "product-first-container">
            <div className = "product-image-container">
                <img className = "product-image" src={imgLink} alt = ""/>
            </div>
            <InfoProp info = {info}/>  
        </div>  
        </>
    );
}


function SellerInfo (seller) {
    return (
        <div className = "product-seller">
            <img className = "product-seller-img" src = {seller.logo} alt = "" />
            <div className = 'product-seller-name-price'>
                <p className = "product-seller-name">{seller.name}</p>
                <p className = "product-seller-price"> {seller.price} <span style = {{fontWeight:300, fontSize: 16}}>TL</span></p>
            </div>
            <button className="product-seller-button" onClick = {() => {
                window.open(seller.link, '_blank');
            }} >Satıcıya git</button>
        </div>
    );


}

function SellerContainer({sellers}) {

    const arr = sellers.map((seller) => {
        return <SellerInfo key = {seller.id} name = {seller.name} logo = {seller.logo} price = {seller.price} priceD = {seller.priceD} link = {seller.link}/>
    });
    return (
        <>  
            <div className = "product-seller-outline">
                
                
                <p className = "display-name">Satıcılar</p>
                <div className = "product-line"></div>
                <div className = "product-seller-container">
                    {arr}
                </div>   


            </div>
        
        </>

    );
}

function GraphOpen({chart,currency,date,setOpen})
{
    const ref = useRef();

    useEffect(() => {
        const closeOnClick = (e) => {
            if (!ref.current.contains(e.target))
            {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown',closeOnClick);
        
        return () => {
            document.removeEventListener('mousedown',closeOnClick);
        };


    });


    return (
        <div className = "graph-body">
            <div ref = {ref} className = "graph-container">
                <div onClick = {() => {setOpen(false)}} className = "graph-close-button">
                    <Cross1Icon />
                </div>  
                <div className = "graph-info">
                    {date + ' - ' + currency + ' Grafiği'}
                </div>
                {chart}
            </div>
        </div>
    );



}


function PriceHistory() {
    const { id } = useParams();
    const [currency,setCurrency] = useState('TL');
    const [date,setDate] = useState('Son 2 Yıl');
    const [graphOpen,SetGraphOpen] = useState(false);
    const [chartData,setData] = useState(null);
    const [width,setWidth] = useState(window.innerWidth);


    useEffect(() => {
        const handleResize = () => {
            setWidth(window.innerWidth);
        };
            window.addEventListener('resize', handleResize);
    
      
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    },[]);


    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(process.env.REACT_APP_API_URL + `/chart-data/${id}/${currency}/${date}`);
            const data = await res.json();
            setData(data);
        }
        fetchData();
    },[currency,date,id]);


    const dataCurrency = [
        {value : 'TL'},
        {value : 'Dolar'}
    ];

    const dataDate = [
        {value : 'Son 2 Yıl'},
        {value : 'Son 3 Ay'},
        {value : 'Son 1 Ay'},
        {value : 'Son 7 Gün'},
    ]


    const chart = useMemo(() => {
        if (chartData)
        {
            const options = {
                responsive : true,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip : {
                        displayColors: false,
                        callbacks : {
                            label: function(context) {
                                const formattedValue = context.parsed.y.toLocaleString('de-DE', {
                                  maximumFractionDigits: (currency === 'TL' ? 0 : 2)
                                });
                                return [`Fiyat: ${formattedValue} ${(currency === 'TL' ? '₺' : '$')}`];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks : {
                            display: false,
                        }
                    },
                    y: {
                        ticks: {
                        callback: function(value, index, values) {
                            return value.toLocaleString('de-DE');
                        }
                        }
                    }
                }
            };
        
            return <PriceChart data = {chartData.data} options = {options}/>;
        }
        else return null;
        // eslint-disable-next-line
    },[chartData]);


    return (
        <div className = "price-chart-container">
            {!chartData ? <div>Loading...</div> : <>
                {graphOpen && <GraphOpen chart = {chart} currency = {currency} date = {date} setOpen={SetGraphOpen}/>}
                <p className = "display-name">Fiyat Geçmişi</p>
                <div className = "product-line"></div>
                <div className = "price-chart-info-container">
                    
                    <div className = "price-chart">
                        {width > 719 && <EnterFullScreenIcon onClick = {() => {SetGraphOpen(true)}} className = 'price-chart-resize-logo'/>}
                        {chart}
                    </div>
                    <div className = "price-history-info">
                        <div className = "price-select">
                            <p style = {{margin:0,marginRight: 10,fontSize: 16,fontWeight:300}}>Para birimi</p>
                            <DropDown items = {dataCurrency} value = {currency} setValue = {setCurrency}/>
                        </div>
                        <div className = "price-select">
                            <p style = {{margin:0,marginRight: 10,fontSize: 16,fontWeight:300}}>Zaman aralığı</p>
                            <DropDown items = {dataDate} value = {date} setValue = {setDate}/>
                        </div>
                        <div className = "price-min-display">
                            <p className = 'price-min-display-1231'>En düşük fiyat:</p>
                            <div className = 'price-min-info'>
                                {(chartData.minprice.price && chartData.minprice.price !== '0') ? <p style = {{margin:0,padding:0,fontSize: 18,fontWeight:500}}>{chartData.minprice.price}<span style = {{fontWeight:500,fontSize: 15}}>,{chartData.minprice.priceD} {(currency === 'TL' ? '₺' : '$')}</span></p> :
                                    <p style = {{margin:0}}>Bulunamadı.</p>
                                }
                                {chartData.minprice.date && <p className = "price-min-date">~{chartData.minprice.date}</p>}
                            </div>
                        </div>
                    </div>

                </div>
            </>}
        </div>
    );


}


function Bookmark({flag,uid,id,list,setList})
{
    const [openLogin,setLogin] = useState(false);

    return (
    <>
        {openLogin && <Login setOpen={setLogin}/>}
        <div onClick = {() => {
                if (list)
                {
                    if (flag)
                    {
                        dropItem(uid,id,list,setList);
                    }
                    else
                    {
                        addItem(uid,id,list,setList);
                    }
                }
                else
                {
                    setLogin(true);
                }
            }
        }
        className = 'product-bookmark'>
            {flag ? <BookmarkFilledIcon style = {{color: 'rgb(0,159,232)' }} /> :<BookmarkIcon />}
        </div>
    </>);
}

function App() {
    const [response, setResponse] = useState({});
    const { id } = useParams();
    const [list,setList] = useState(null);
    const [user,setUser] = useState(null);
    const [bookmarked,setBookmarked] = useState(false);

    useEffect(() => {
        if (list)
        {
            let flag = false;
            for (let i =0 ; list.length>i ; i++)
            {
                if (list[i] === id)
                {
                    flag = true;
                    break;
                }
            }
            setBookmarked(flag);
        }
        else
        {
            setBookmarked(false);
        }
    },[list,id]);

    useEffect(() => {

        const fetchData = async () => {
          try {
            const res = await fetch(process.env.REACT_APP_API_URL + `/product/info-head/${id}`); // response -> res
            const data = await res.json();
            setResponse(data);
          } catch (error) {
            console.error('Error:', error);
          }
        };
        
        IncView(id);
        fetchData();
      }, [id]);

    return (<>
      <TopContainer list = {list} setList = {setList} user = {user} setUser = {setUser}/>
      <div className = "product-outline">
        <Bookmark flag = {bookmarked} uid = {user && user.uid} id = {id} list = {list} setList = {setList}/>
        {(!response.info) ? <p>Loading...</p> : <InfoContainer imgLink={response.img_link} info={response.info}/>} 
        <PriceHistory />
        {(response.sellers) && <SellerContainer sellers = {response.sellers}/>}   
      </div>
    </>
    );
  }
  
  export default App;