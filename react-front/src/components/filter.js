import '../styles/filter.css'
import React, { useState, useEffect,useRef } from 'react';
import { useParams} from 'react-router-dom';
import { MagnifyingGlassIcon,CheckIcon, MixerHorizontalIcon} from '@radix-ui/react-icons'

function PriceRange({filter,setOpen})
{
  const { query } = useParams();
  const [min,setMin] = useState("");
  const [max,setMax] = useState("");

  useEffect(() => {
    setMax("");
    setMin("");
  },[query,filter.category])

  const handleChange = (e,setValue) => {
    let val = e.target.value;
    val = val.replace(/[^0-9]/g, '');  // Keep only digits

    if (parseInt(val, 10) > 150000) {
      val = '150000';  // Max value is 100000
    }
    setValue(val);
  };

  return (
    <div className = 'filter-price-range'>
      <p style = {{fontWeight:300,margin:0,fontSize:18}}>Fiyat Aralığı</p>
      <div className = "filter-price-range-inputs">
        <input value = {min} onChange = {(e) => {handleChange(e,setMin)}} className = "filter-price-range-input-min" placeholder='Min'></input>
        <div style = {{marginLeft:10,marginRight:10}}>-</div>
        <input value = {max} onChange = {(e) => {handleChange(e,setMax)}} className = "filter-price-range-input-max" placeholder='Max'></input>
        <div className = "filter-price-range-submit-button" onClick = {() => {
          const p1 = min ? parseInt(min) : 0;
          const p2 = max ? parseInt(max) : 150000;
          filter.setRange({min: p1, max: p2});
          setOpen(false);
        }}>
          <MagnifyingGlassIcon />
        </div>
      </div>
    </div>);
}


function FilterCompanyItem({company,filter})
{
  return (
    <div className = "filter-company-item">
      <div onClick = { () => {
          if(filter.companyBool[`${company}`]){
            const copy = {...filter.companyBool};
            copy[`${company}`] = false; // is this bad practice?
            filter.setCompanyBool(copy);
          }
          else {
            const copy = {...filter.companyBool};
            copy[`${company}`] = true; // is this bad practice?
            filter.setCompanyBool(copy);
          }
        }
      } className = "filter-co-item-button">{filter.companyBool[`${company}`] &&  <CheckIcon />}</div>
      <p style = {{margin:0,marginLeft:10,fontWeight:300,fontSize:16}}>{company}</p>
    </div>
  );

}

function FilterCompanies({companies,filter})
{
  const companiesHTML = companies.map((company) => {
    return <FilterCompanyItem key = {company} company = {company} filter = {filter}/>;
  });


  return (
    <div className = "filter-company-container">
      <p style = {{fontWeight:300,margin:0,fontSize:18}}>Markalar</p>
      {companiesHTML}
    </div>
  );
}

// function FilterLogo({filter,companies})
// {
//   const [open,setOpen] = useState(false);

//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);

//   useEffect(() => {
//     const handleResize = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener('resize', handleResize);

//     // Cleanup
//     return () => {
//       window.removeEventListener('resize', handleResize);
//     };
//   }, []);

//   <div className = 'filter-logo'>
//     <MixerHorizontalIcon />
//     <div className = 'filter-container'>
//       <PriceRange filter = {filter}/>
//       <FilterCompanies companies = {companies} filter = {filter}/>
//     </div>
//   </div>


// }


function FilterContainer({filter,companies})
{
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [open,setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);


    };
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target))
      {
        setOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousedown',handleClick);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousedown',handleClick);
    };
  }, []);

  return (
    <>
    {(companies.length !== 0) && 
      <>
        <div ref = {ref} className = 'filters'>
          {windowWidth < 1300 && 
            <div className = 'filter-logo' onClick = {() => {setOpen(!open)}}>
              <MixerHorizontalIcon />
            </div>
          }
          {(windowWidth > 1300 || open) && 
            <div className = 'filter-container'>
              { windowWidth < 1300 && <div className = 'black-background'> </div>}
              <PriceRange filter = {filter} setOpen={setOpen}/>
              <FilterCompanies companies = {companies} filter = {filter}/>
            </div>
          }
        </div>
      </>}
    </>
  );
}

export default FilterContainer;