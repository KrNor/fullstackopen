import { useState } from "react";

// const ContactList = (props) => {
//   if (props.newSearch.length < 1) {
//     console.log(props.newSearch.length);
//     props.persons.map((personn) => {
//       return (
//         <p key={personn.name}>
//           {personn.name} {personn.number}
//         </p>
//       );
//     });
//   }
//   return (
//     //   {props.persons.map((person) => {
//     // if (person.name.includes(newSearch)) {
//     //   <p key={person.name}>
//     //     {person.name} {person.number}
//     //   </p>;
//     // }
//     // })}
//     <div>temp</div>
//   );
// };

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
  const changeSearch = (event) => {
    event.preventDefault();
    setNewSearch(event.target.value);
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
  const personsToShow =
    newSearch.length < 1
      ? persons
      : persons.filter((persona) =>
          persona.name.toLowerCase().includes(newSearch)
        );

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        Find(filter) name: <input value={newSearch} onChange={changeSearch} />
      </div>
      <h2>Add a new Contact</h2>
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
      <div>
        {personsToShow.map((person) => (
          <p key={person.name}>
            {person.name} {person.number}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
