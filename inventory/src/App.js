//import styles from "./App.module.css";
import SearchBar from "./SearchBar";
import { useState, useEffect } from "react";
import AddItem from "./AddItem";
import ItemsDisplay from "./ItemsDisplay";

function App() {
  const [filters, setFilters] = useState({});
  const [data, setData] = useState({ items: [] });

  useEffect(() => {
    fetch("http://localhost:3000/items").then((response) => response.json()).then((data) => setData({ items: data }))
  }, []);//[] = dependency list - uE will run when they change if empty will only run once(mount), if data will run also when data variable changes, can have multiple uEs

  const updateFilters = (searchParams) => {
    setFilters(searchParams);
  };

  const deleteItem = (item) => {
    const items = data["items"];
    const requestOptions = {
      method: "DELETE"
    }

    fetch(`http://localhost:3000/items/${item.id}`, requestOptions).then((response) => {
      if (response.ok) {
        const index = items.indexOf(item);
        items.splice(index, 1);
        setData({ items: items });
        alert(`Item: ${item.name} deleted!`);
      }
    })
  }
 
  const addItemToData = (item) => {
    let items = data["items"];

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    };
    fetch("http://localhost:3000/items", requestOptions).then((response) => response.json()).then((data) => {
      items.push(data);
      setData({ items: items });
    });
  }

  const filterData = (data) => {

    if (Object.keys(filters).length === 0) {
      return data;
    }

    return data.filter(item => {
      return (
        (!filters.name || item.name === filters.name) &&
        (filters.price === 0 || item.price === filters.price) &&
        (!filters.type || item.type === filters.type) &&
        (!filters.brand || item.brand === filters.brand)
      );
    });
  }


  return (
    <div className="container">
      <div className="row mt-3">
      <ItemsDisplay deleteItem={deleteItem} items={filterData(data["items"])} />
      </div>
      <div className="row mt-3">
      <SearchBar updateSearchParams={updateFilters} />
      </div>
      <div className="row mt-3">
      <AddItem addItem={addItemToData} />
      </div>
    </div>
  );
}

export default App;
