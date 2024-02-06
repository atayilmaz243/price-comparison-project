


export const setUserList = async (id,list) => {
  fetch(process.env.REACT_APP_API_URL + '/set-user-list', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({id:id,list: list}) // Your payload
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // console.log('succesfully set user list into database.')
  })
  .catch(error => console.log('error set user list into database'));
};

export const dropItem = (uid,id,list,setList) => {
  let copy = [...list];
  copy = copy.filter((item) => id !== item);
  setList(copy);
  setUserList(uid,copy);
  changeFollow(id,-1);
};


export const addItem = (uid,id,list,setList) => {
  let copy = [...list,id];
  setList(copy);
  setUserList(uid,copy);
  changeFollow(id,1);
};

export const IncView = (id) =>
{
  fetch(process.env.REACT_APP_API_URL + '/change-product-view', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id:id}) // Your payload
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // console.log('succesfully changed view');
  })
  .catch(error => console.log('error change view'));


};

const changeFollow = (id,change) =>
{
  fetch(process.env.REACT_APP_API_URL + '/change-product-follow', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({id:id,change:change}) // Your payload
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    // console.log('succesfully changed follow');
  })
  .catch(error => console.log('error change follow'));


};
