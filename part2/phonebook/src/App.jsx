import { useState, useEffect } from "react";
import contactsService from "./services/contacts";

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
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setnewNumber] = useState("");
  const [newSearch, setNewSearch] = useState("");

  const hook = () => {
    console.log("effect");
    contactsService.getAll().then((response) => {
      console.log("promise fulfilled");
      setPersons(response.data);
    });
  };
  useEffect(hook, []);
  const [currId, setCurrId] = useState(4); //persons[persons.length - 1].id;
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
      const contactObject = {
        name: newName,
        number: newNumber,
      };
      contactsService
        .create(contactObject)
        .then((response) => {
          setPersons(persons.concat(response.data));
          console.log("form is submitted");
          setNewName("");
          setnewNumber("");
        })
        .catch(
          (error) =>
            console.log(
              "there was a mistake with the submission, please try again"
            )
          // this doesn't work how I want for now but i'll keep it for now (or maybie it does )
        );
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
