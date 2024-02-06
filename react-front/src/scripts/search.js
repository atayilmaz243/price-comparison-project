import React, { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import TopContainer from '../components/top'
import FilterContainer from '../components/filter';
import SearchResults from '../components/search-results';


function App() {
  const [data, setData] = useState(null);
  const [range,setRange] = useState({min:0,max:100000});
  const [companyBool,setCompanyBool] = useState(null); // 
  const { query } = useParams();
  const [list,setList] = useState(null);
  const [user,setUser] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_API_URL + `/search-page/${query}`);
        const res = await response.json();
        setData(res);
        let companyBool = {};
        // eslint-disable-next-line
        res.companies.map((company) => {
          companyBool[`${company}`] = true;
        });
        setCompanyBool(companyBool);
        setRange({min:0,max:150000});
        console.log('aaa');
        console.log(res.itemContainers);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [query]);


  return (<>
    <TopContainer list = {list} setList = {setList} user = {user} setUser = {setUser}/>
    <div className = "searchpage-body">
      {data && <>
        <FilterContainer companies = {data.companies} filter = {{companyBool:companyBool,range:range,setCompanyBool:setCompanyBool,setRange:setRange}}/>
        <SearchResults filter = {{companyBool:companyBool,range:range,setCompanyBool:setCompanyBool,setRange:setRange}} itemContainers = {data.itemContainers}/> 
      </>}
    </div>
  </>
  );
}

export default App;
