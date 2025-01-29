import { useState } from "react";

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "1111-111-111" },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");

  const changeName = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
    console.log(event.target.value);
  };
  const changeNumber = (event) => {
    event.preventDefault();
    setnewNumber(event.target.value);
    console.log(event.target.value);
  };
  const addContact = (event) => {
    event.preventDefault();
    console.log(persons);
    if (persons.map((person) => person.name).includes(newName)) {
      window.alert(`the name: "${newName}" is already in the phonebook!`);
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber }));
      console.log("form is submitted");
      console.log(persons.concat({ name: newName, number: newNumber }));
    }
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addContact}>
        <div>
          name: <input value={newName} onChange={changeName} />
        </div>
        <div>
          number: <input value={newNumber} onChange={changeNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>debug: {newName}</div>
      <div>
        {persons.map((person) => (
          <p key={person.name}>
            {person.name} {person.number}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
