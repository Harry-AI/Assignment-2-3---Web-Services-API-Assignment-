import React,{useEffect, useState} from 'react';
import './App.css';



function App() {
  const url = 'https://comp6210-9546.restdb.io/rest/subjects';
  const headers =  { 
      'cache-control': 'no-cache',
      'x-apikey': '636b2270e9a77f5984220840',
      'content-type': 'application/json',
  };

  const [subjects, setSubjects] = useState([]);
  const [isLoaded, setLoaded] = useState(false);
  const [isLoading, setAdded] = useState(false);
  const [toggleForms, setToggle] = useState(false);
  const [item, setItem] = useState('');
  const [id, setID] = useState('');
  const [_class, setClass] = useState('');
  const [description, setDescription] = useState('');
  const [containment, setContainment] = useState('');

  function clearFields() {
    setItem('')
    setClass('')
    setContainment('')
    setDescription('')
  }
  
  async function handleSubmit(event) {
    event.preventDefault()
    const subject = {
      class: _class,
      containment,
      description,
      item,
    };

    setAdded(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(subject)
      });

      const data = await res.json()
      setSubjects([...subjects,data])
      setAdded(false)

      clearFields()
    } catch (error) {
      console.log(error)
    }
  }

  async function handleUpdate(event) {
    event.preventDefault()
    const subject = {
      class: _class,
      containment,
      description,
      item,
    };

    setAdded(true);
    try {
      const res = await fetch(`${url}/${id}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(subject)
      });

      await res.json()

      fetchSubjects()

      setAdded(false)
      clearFields()
      setToggle(false)
    } catch (error) {
      console.log(error)
    }
  }


  async function handleEdit(id) {
    try {
      const res = await fetch(`${url}/${id}`,{ headers});
      const data = await res.json();
      
      setItem(data.item);
      setClass(data.class);
      setContainment(data.containment);
      setDescription(data.description);
      setID(id);
      setToggle(true)

    } catch (error) {
      console.log(error)
    }
  }

  async function handleDelete(id) {
    try {
   
      const res = await fetch(`${url}/${id}`,{ method:'DELETE', headers})
      await res.json()

      const updated = subjects.filter(subject => subject._id !== id)
      setSubjects(updated)
    } catch (error) {
      console.log(error)
    }
  }

  async function fetchSubjects() {

    try {
      const res = await fetch(url,{headers});
      const data = await res.json()
      setSubjects(data)
      setLoaded(true)
    } catch (error) {
      console.log(error)
    }
  }


  useEffect(()=>{
    fetchSubjects();
  });

  const FormFields =(
      <>
      <div>
            <label>Name</label>
            <input type="text" onChange={(e)=>{
              setItem(e.target.value)
            }} value={item} placeholder="Enter SCP name"/>
          </div>
          <div>
            <label>Class</label>
            <input type="text" onChange={(e)=> {
              setClass(e.target.value)
            }} value={_class} placeholder="Enter SCP class"/>
          </div>
          <div>
            <label>Containment</label>
            <input type="text" onChange={(e)=> {
              setContainment(e.target.value)
            }} value={containment} placeholder="Enter SCP containment"/>
          </div>
          <div>
            <label>Description</label>
            <textarea onChange={(e)=> {
              setDescription(e.target.value)
            }} value={description}></textarea>
          </div>
      </>
    );
  
  const subjectsHTML = subjects.map(data=>{
    return (
      <li key={data._id}>
        <h4>{data.item}</h4>
        <div><strong>{data.class}</strong></div>
        <div><strong>{data.containment}</strong></div>
        <p>{data.description}</p>
        <div className='item-btns'>
          <button className='edit' onClick={()=> handleEdit(data._id)}><i className="bi bi-pencil-square"></i></button>
          <button className='delete' onClick={()=> handleDelete(data._id)}><i className="bi bi-trash"></i></button>
          </div>
      </li>
    )
  });

  const AddForm =(<aside>
    <h3>Add new entry</h3>
        <p>{isLoading && <div className="loader"></div>}</p>
        <form onSubmit={handleSubmit}>
          {FormFields}
         <div>
          <button>ADD</button>
         </div>
        </form>
  </aside>);


  const UpdateForm =(<aside>
    <h3>Update Entry</h3>
        <p>{isLoading && <div className="loader"></div>}</p>
        <form onSubmit={handleUpdate}>
          {FormFields}
        <div>
          <button>Update</button>
        </div>
        </form>
  </aside>);


  return (
    <main className="App">
     <header>
      <h1>COMP6210</h1>
     </header>
     <div className='container'>
    
    {toggleForms?UpdateForm:AddForm}
     <section>
      <h3>SCP Subjects</h3>
      <ul>{isLoaded ? subjectsHTML: <div className="loader"></div>}</ul>
     </section>
     </div>
     
    </main>
  );
}



export default App;
