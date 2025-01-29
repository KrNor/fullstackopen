import { useState } from "react";

const PhoneBook = (props) => {
  return (
    <div>
      Find(filter) name: <input value={props.value} onChange={props.onChange} />
    </div>
  );
};
const PersonForm = (props) => {
  return (
    <form onSubmit={props.onSubmit}>
      <div>
        name:
        <input value={props.nameValue} onChange={props.onNameChange} />
      </div>
      <div>
        number:
        <input value={props.numberValue} onChange={props.onNumberChange} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  );
};

const Numbers = (props) => {
  if (props.listToShow.length < 1) {
    return <div>there are no contacts that fit the search criteria</div>;
  }
  return (
    <div>
      {props.listToShow.map((person) => (
        <Number key={person.id} numb={person} />
      ))}
    </div>
  );
};

const Number = (props) => {
  return (
    <p>
      {props.numb.name} {props.numb.number}
    </p>
  );
};

const App = () => {
  const [persons, setPersons] = useState([
    { name: "Arto Hellas", number: "040-123456", id: 1 },
    { name: "Ada Lovelace", number: "39-44-5323523", id: 2 },
    { name: "Dan Abramov", number: "12-43-234345", id: 3 },
    { name: "Mary Poppendieck", number: "39-23-6423122", id: 4 },
  ]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");
  const [currId, setCurrId] = useState(persons[persons.length - 1].id);
  const changeName = (event) => {
    event.preventDefault();
    setNewName(event.target.value);
  };
  const changeNumber = (event) => {
    event.preventDefault();
    setnewNumber(event.target.value);
  };
  const changeSearch = (event) => {
    event.preventDefault();
    setNewSearch(event.target.value);
  };
  const addContact = (event) => {
    event.preventDefault();
    if (
      persons.map((person) => person.name).includes(newName) ||
      newName.length < 1
    ) {
      window.alert(`the name: "${newName}" is invalid!`);
    } else {
      var newId = currId + 1;
      setPersons(
        persons.concat({ name: newName, number: newNumber, id: newId })
      );
      setCurrId(newId);
      // console.log("form is submitted");
      // console.log(
      //   persons.concat({ name: newName, number: newNumber, id: newId })
      // );
      setNewName("");
      setnewNumber("");
    }
  };
  const personsToShow =
    newSearch.length < 1
      ? persons
      : persons.filter((persona) =>
          persona.name.toLowerCase().includes(newSearch)
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <PhoneBook value={newSearch} onChange={changeSearch} />
      <h2>Add a new Contact</h2>
      <PersonForm
        onSubmit={addContact}
        nameValue={newName}
        onNameChange={changeName}
        numberValue={newNumber}
        onNumberChange={changeNumber}
        currentId={currId}
      />
      <h2>Numbers</h2>
      <Numbers listToShow={personsToShow} />
    </div>
  );
};

export default App;
