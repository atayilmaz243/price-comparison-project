import React, { useState, useEffect } from 'react';
import TopContainer from '../top'
import FilterContainer from '../filter';
import SearchResults from '../search-results';
import '../../styles/search.css'


function Category({category,categoryName}) {
  const [data, setData] = useState(null);
  const [range,setRange] = useState({min:0,max:100000});
  const [companyBool,setCompanyBool] = useState(null); // 
  const [list,setList] = useState(null);
  const [user,setUser] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + `/category/${category}`);
        const res = await response.json();
        setData(res);
        let companyBool = {};
        // eslint-disable-next-line
        res.companies.map((company) => {
          companyBool[`${company}`] = true;
        });
        setCompanyBool(companyBool);
        setRange({min:0,max:150000});
        // console.log('aaa');
        // console.log(res.itemContainers);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [category]);


  return (<>
    <TopContainer list = {list} setList = {setList} user = {user} setUser = {setUser}/>
    <div className = "searchpage-body" style = {{marginTop:0}}>
      {data && <>
        <FilterContainer companies = {data.companies} filter = {{companyBool:companyBool,range:range,setCompanyBool:setCompanyBool,setRange:setRange,category:category}}/>
        <SearchResults category = {categoryName} filter = {{companyBool:companyBool,range:range,setCompanyBool:setCompanyBool,setRange:setRange}} itemContainers = {data.itemContainers}/> 
      </>}
    </div>
  </>
  );
}

export default Category;
