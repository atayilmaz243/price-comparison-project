import '../styles/dropdown.css'
import React,{useState,useRef, useEffect}  from 'react'


function DropDown({items,value,setValue})
{
  const [isOpen,setOpen] = useState(false);
  const dref = useRef();

  useEffect(() => {
    let closeDropdown = (e) => {
      if (!dref.current.contains(e.target))
      {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown',closeDropdown);
    return () => {
      document.removeEventListener('mousedown',closeDropdown);
    };
  })
  const dropItems = items && items.map((item,index) => {
    return (
      <div key = {index} className = 'dropdown-item' onClick = {() => {setValue(item.value);setOpen(false)}}>{item.value}</div>);
  });

  const dropdownitems = 
    (<div className = "dropdown-item-container">
      {dropItems}
    </div>);

  return (<div ref = {dref} className = "dropdown-container">
    <div className = "arrow-down"></div>
    <div className = "dropdown-drop" onClick = {() => {setOpen(!isOpen);}}>{value}<div className = "arrow-down"></div></div>
    {isOpen && dropdownitems}
  </div>);


}


export default DropDown;